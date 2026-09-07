import { ref, set, get, update, remove, onValue, runTransaction } from 'firebase/database';
import { database } from '../../../services/firebase';
import { ShortUrl, ShortenerAdsConfig, DEFAULT_ADS_CONFIG } from '../types';

const LOCAL_STORAGE_KEY = 'veloral_short_urls_cache';
const GUEST_SLUGS_KEY = 'veloral_guest_created_slugs';
const ADS_CONFIG_KEY = 'veloral_shortener_ads_cache';

// Generate random short alphanumeric slug (e.g. "k9x2m4")
export function generateRandomSlug(length = 6): string {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Clean and validate target URL
export function normalizeUrl(url: string): string {
  let cleaned = url.trim();
  if (!cleaned) return '';
  if (!/^https?:\/\//i.test(cleaned)) {
    cleaned = `https://${cleaned}`;
  }
  return cleaned;
}

// Save slug to local guest history
export function rememberGuestSlug(slug: string) {
  try {
    const raw = localStorage.getItem(GUEST_SLUGS_KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];
    if (!list.includes(slug)) {
      list.unshift(slug);
      localStorage.setItem(GUEST_SLUGS_KEY, JSON.stringify(list.slice(0, 100)));
    }
  } catch {}
}

export function getGuestSlugs(): string[] {
  try {
    const raw = localStorage.getItem(GUEST_SLUGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Create a new shortened URL
export async function createShortUrl(payload: {
  targetUrl: string;
  customSlug?: string;
  title?: string;
  createdBy?: string;
  creatorEmail?: string;
  expiresAt?: number | null;
  password?: string | null;
  adMode?: 'default' | 'enabled' | 'direct';
  isAdmin?: boolean;
}): Promise<ShortUrl> {
  const target = normalizeUrl(payload.targetUrl);
  if (!target) {
    throw new Error('Valid destination URL is required');
  }

  // Validate custom slug or generate random one
  let slug = payload.customSlug ? payload.customSlug.trim().toLowerCase() : '';
  if (slug) {
    // slug validation: alphanumeric, hyphens, underscores, 3-30 chars
    slug = slug.replace(/[^a-z0-9-_]/gi, '');
    if (slug.length < 2) {
      throw new Error('Custom slug must be at least 2 characters long');
    }

    // Reserved routes check
    const reserved = ['admin', 'app', 'profile', 'creator', 'events', 'explore', 'codes', 'seller', 'login', 'register', 'r', 's', 'api', 'sw', 'manifest'];
    if (reserved.includes(slug)) {
      throw new Error(`The slug "${slug}" is reserved for system routes. Please pick another name.`);
    }

    // Check if slug exists
    const existingRef = ref(database, `short_urls/${slug}`);
    const snapshot = await get(existingRef);
    if (snapshot.exists()) {
      throw new Error(`The short link alias "${slug}" is already taken. Please choose a different one.`);
    }
  } else {
    // Find unique random slug
    let attempts = 0;
    let uniqueSlug = generateRandomSlug(6);
    while (attempts < 5) {
      const checkRef = ref(database, `short_urls/${uniqueSlug}`);
      const snap = await get(checkRef);
      if (!snap.exists()) {
        slug = uniqueSlug;
        break;
      }
      uniqueSlug = generateRandomSlug(6);
      attempts++;
    }
    if (!slug) {
      slug = generateRandomSlug(8);
    }
  }

  // Only admin can control the ad redirect mode
  const finalAdMode = payload.isAdmin ? (payload.adMode || 'default') : 'default';

  const shortUrl: ShortUrl = {
    id: slug,
    slug,
    targetUrl: target,
    title: payload.title?.trim() || '',
    createdAt: Date.now(),
    createdBy: payload.createdBy || 'guest',
    creatorEmail: payload.creatorEmail || '',
    clicks: 0,
    expiresAt: payload.expiresAt || null,
    password: payload.password?.trim() || null,
    enabled: true,
    adMode: finalAdMode,
  };

  const dbRef = ref(database, `short_urls/${slug}`);
  await set(dbRef, shortUrl);

  // Remember in guest list
  rememberGuestSlug(slug);

  // Cache in local list
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    const cached: ShortUrl[] = raw ? JSON.parse(raw) : [];
    cached.unshift(shortUrl);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cached.slice(0, 50)));
  } catch {}

  return shortUrl;
}

// Get single short URL by slug
export async function getShortUrlBySlug(slug: string): Promise<ShortUrl | null> {
  const cleanSlug = slug.trim().toLowerCase();
  if (!cleanSlug) return null;

  try {
    const dbRef = ref(database, `short_urls/${cleanSlug}`);
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      return snapshot.val() as ShortUrl;
    }
  } catch (err) {
    console.error('Error fetching short URL from Firebase:', err);
  }

  // Fallback to local cache if offline
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const list: ShortUrl[] = JSON.parse(raw);
      const found = list.find((item) => item.slug.toLowerCase() === cleanSlug);
      if (found) return found;
    }
  } catch {}

  return null;
}

// Record link click and update analytics
export async function recordLinkClick(slug: string, referer?: string): Promise<void> {
  try {
    const dbRef = ref(database, `short_urls/${slug}`);
    await runTransaction(dbRef, (current: ShortUrl | null) => {
      if (current) {
        return {
          ...current,
          clicks: (current.clicks || 0) + 1,
          lastClickedAt: Date.now(),
        };
      }
      return current;
    });

    // Optional click event log
    const clickLogRef = ref(database, `short_url_clicks/${slug}/${Date.now()}`);
    await set(clickLogRef, {
      timestamp: Date.now(),
      referer: referer || document.referrer || 'direct',
      device: typeof navigator !== 'undefined' ? (navigator.userAgent.includes('Mobile') ? 'mobile' : 'desktop') : 'unknown',
    });
  } catch (err) {
    console.warn('Error recording link click:', err);
  }
}

// Realtime subscriber for all short URLs (Admin & public dashboard)
export function subscribeAllShortUrls(callback: (urls: ShortUrl[]) => void): () => void {
  const dbRef = ref(database, 'short_urls');

  // Load from local storage initially
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      callback(JSON.parse(raw));
    }
  } catch {}

  const unsubscribe = onValue(
    dbRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        const urls: ShortUrl[] = Object.keys(val).map((key) => ({
          ...val[key],
          slug: key,
        }));
        urls.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(urls));
        callback(urls);
      } else {
        callback([]);
      }
    },
    (err) => {
      console.warn('subscribeAllShortUrls listener error:', err);
    }
  );

  return unsubscribe;
}

// Update short URL (e.g. toggle enabled, change title/target)
export async function updateShortUrl(slug: string, updates: Partial<ShortUrl>): Promise<void> {
  const dbRef = ref(database, `short_urls/${slug}`);
  await update(dbRef, updates);
}

// Delete short URL
export async function deleteShortUrl(slug: string): Promise<void> {
  const dbRef = ref(database, `short_urls/${slug}`);
  await remove(dbRef);

  // Remove from guest cache if present
  try {
    const raw = localStorage.getItem(GUEST_SLUGS_KEY);
    if (raw) {
      const list: string[] = JSON.parse(raw);
      const filtered = list.filter((s) => s !== slug);
      localStorage.setItem(GUEST_SLUGS_KEY, JSON.stringify(filtered));
    }
  } catch {}
}

// Get Ads Configuration
export async function getShortenerAdsConfig(): Promise<ShortenerAdsConfig> {
  try {
    const dbRef = ref(database, 'settings/shortener_ads');
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      return { ...DEFAULT_ADS_CONFIG, ...data };
    }
  } catch (err) {
    console.warn('Error fetching ads config from RTDB:', err);
  }

  // Fallback to local cache
  try {
    const cached = localStorage.getItem(ADS_CONFIG_KEY);
    if (cached) return JSON.parse(cached);
  } catch {}

  return DEFAULT_ADS_CONFIG;
}

// Save Ads Configuration (Admin Panel)
export async function saveShortenerAdsConfig(config: ShortenerAdsConfig): Promise<void> {
  const dbRef = ref(database, 'settings/shortener_ads');
  const payload = {
    ...config,
    lastUpdated: Date.now(),
  };
  await set(dbRef, payload);
  try {
    localStorage.setItem(ADS_CONFIG_KEY, JSON.stringify(payload));
  } catch {}
}

// Subscribe to Ads Configuration changes live
export function subscribeAdsConfig(callback: (config: ShortenerAdsConfig) => void): () => void {
  const dbRef = ref(database, 'settings/shortener_ads');

  try {
    const cached = localStorage.getItem(ADS_CONFIG_KEY);
    if (cached) callback(JSON.parse(cached));
  } catch {}

  const unsubscribe = onValue(dbRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = { ...DEFAULT_ADS_CONFIG, ...snapshot.val() };
      localStorage.setItem(ADS_CONFIG_KEY, JSON.stringify(data));
      callback(data);
    } else {
      callback(DEFAULT_ADS_CONFIG);
    }
  });

  return unsubscribe;
}
