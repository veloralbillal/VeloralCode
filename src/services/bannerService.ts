import { ref, get, set, push, update, remove, onValue, Unsubscribe } from 'firebase/database';
import { database } from './firebase';
import { BannerItem } from '../types/banner';

const BANNERS_REF = 'banners';

export const INITIAL_BANNERS: BannerItem[] = [
  {
    id: 'starter-banner-1',
    title: 'Explore Live Interactive Web Tools',
    subtitle: 'High-performance components, utilities, and live scripts curated for developers.',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1400&q=80',
    linkUrl: '#/codes',
    buttonText: 'Explore Snippets',
    badge: 'NEW COLLECTION',
    isActive: true,
    order: 1,
    createdAt: Date.now() - 86400000,
  },
  {
    id: 'starter-banner-2',
    title: 'Developer Workshop & Code Contest',
    subtitle: 'Participate in exclusive hackathons and masterclasses. Win creator badges & cash prizes!',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1400&q=80',
    linkUrl: '#/events',
    buttonText: 'View Events',
    badge: 'UPCOMING EVENT',
    isActive: true,
    order: 2,
    createdAt: Date.now() - 43200000,
  },
  {
    id: 'starter-banner-3',
    title: 'Become a Verified Code Creator',
    subtitle: 'Submit custom tools, earn recurring milestone royalties, and withdraw directly to your account.',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1400&q=80',
    linkUrl: '#/creator',
    buttonText: 'Creator Hub',
    badge: 'CREATOR PROGRAM',
    isActive: true,
    order: 3,
    createdAt: Date.now() - 21600000,
  },
];

/**
 * Fetch all banners from RTDB
 */
export async function fetchBanners(): Promise<BannerItem[]> {
  try {
    const bannersRef = ref(database, BANNERS_REF);
    const snap = await get(bannersRef);
    if (!snap.exists()) {
      return INITIAL_BANNERS;
    }
    const val = snap.val();
    return Object.keys(val)
      .map((k) => ({ id: k, ...val[k] }))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  } catch (err) {
    console.error('Error fetching banners:', err);
    return INITIAL_BANNERS;
  }
}

/**
 * Subscribe to all banners for admin management
 */
export function subscribeToAllBanners(
  onUpdate: (banners: BannerItem[]) => void,
  onError?: (err: any) => void
): Unsubscribe {
  const bannersRef = ref(database, BANNERS_REF);
  return onValue(
    bannersRef,
    (snap) => {
      if (snap.exists()) {
        const val = snap.val();
        const list: BannerItem[] = Object.keys(val)
          .map((k) => ({ id: k, ...val[k] }))
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        onUpdate(list);
      } else {
        onUpdate(INITIAL_BANNERS);
      }
    },
    (err) => {
      console.error('Error in banners subscription:', err);
      if (onError) onError(err);
      onUpdate(INITIAL_BANNERS);
    }
  );
}

/**
 * Subscribe to active banners for user homepage carousel
 */
export function subscribeToActiveBanners(
  onUpdate: (banners: BannerItem[]) => void,
  onError?: (err: any) => void
): Unsubscribe {
  return subscribeToAllBanners(
    (all) => {
      const active = all.filter((b) => b.isActive !== false);
      onUpdate(active.length > 0 ? active : INITIAL_BANNERS);
    },
    onError
  );
}

/**
 * Create a new banner (Admin)
 */
export async function createBanner(data: Omit<BannerItem, 'id' | 'createdAt'>): Promise<BannerItem> {
  const bannersRef = ref(database, BANNERS_REF);
  const newRef = push(bannersRef);

  const banner: BannerItem = {
    id: newRef.key || Date.now().toString(),
    ...data,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  await set(newRef, banner);
  return banner;
}

/**
 * Update existing banner (Admin)
 */
export async function updateBanner(id: string, data: Partial<BannerItem>): Promise<void> {
  const bannerRef = ref(database, `${BANNERS_REF}/${id}`);
  await update(bannerRef, {
    ...data,
    updatedAt: Date.now(),
  });
}

/**
 * Delete a banner (Admin)
 */
export async function deleteBanner(id: string): Promise<void> {
  const bannerRef = ref(database, `${BANNERS_REF}/${id}`);
  await remove(bannerRef);
}

/**
 * Seed initial sample banners if needed
 */
export async function seedInitialBanners(): Promise<void> {
  const bannersRef = ref(database, BANNERS_REF);
  const snap = await get(bannersRef);
  if (!snap.exists()) {
    for (const b of INITIAL_BANNERS) {
      const newRef = ref(database, `${BANNERS_REF}/${b.id}`);
      await set(newRef, b);
    }
  }
}
