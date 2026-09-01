import { ref, get, set, onValue, Unsubscribe } from 'firebase/database';
import { database } from './firebase';
import { SiteConfig } from '../types';

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  siteName: 'CodeToolkit',
  siteTagline:
    'A high-performance code library, snippet manager, and developer toolkit built on Firebase Authentication & Realtime Database. Ready for static GitHub Pages hosting.',
  version: 'v2.0',
  heroTitle: 'Live Web Tools, Code Snippets & Output Hub',
  heroDescription:
    'Explore live interactive web apps, tools, widgets, and scripts uploaded directly by administrators. View live outputs, test tools in real-time, and run components instantly.',
  heroBadge: 'Firebase Realtime Database Powered',
  footerCopyright: 'Built for developer productivity.',
  telegramUsername: 'BillalHossen',
  whatsappNumber: '8801700000000',
  contactMessageTemplate:
    'Hello Admin, I want to purchase / renew a Premium Pro License Key for my account (My UID: {uid}) - Email: {email}. Please share the payment methods and details.',
};

const SITE_CONFIG_REF = 'siteConfig';

/**
 * Fetch current site configuration from Firebase RTDB
 */
export async function getSiteConfig(): Promise<SiteConfig> {
  try {
    const configRef = ref(database, SITE_CONFIG_REF);
    const snapshot = await get(configRef);
    if (snapshot.exists()) {
      return { ...DEFAULT_SITE_CONFIG, ...snapshot.val() };
    }
    return DEFAULT_SITE_CONFIG;
  } catch (error) {
    console.error('Error fetching site config:', error);
    return DEFAULT_SITE_CONFIG;
  }
}

/**
 * Real-time listener for site configuration
 */
export function subscribeToSiteConfig(
  onUpdate: (config: SiteConfig) => void,
  onError?: (error: any) => void
): Unsubscribe {
  const configRef = ref(database, SITE_CONFIG_REF);
  return onValue(
    configRef,
    (snapshot) => {
      if (snapshot.exists()) {
        onUpdate({ ...DEFAULT_SITE_CONFIG, ...snapshot.val() });
      } else {
        onUpdate(DEFAULT_SITE_CONFIG);
      }
    },
    (err) => {
      console.error('Error in siteConfig subscription:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Update site configuration in Firebase RTDB
 */
export async function updateSiteConfig(
  newConfig: Partial<SiteConfig>,
  adminEmail?: string
): Promise<void> {
  const configRef = ref(database, SITE_CONFIG_REF);
  const current = await getSiteConfig();
  const updated: SiteConfig = {
    ...current,
    ...newConfig,
    updatedAt: Date.now(),
    updatedBy: adminEmail || 'Admin',
  };
  await set(configRef, updated);
}

/**
 * Reset site configuration back to default values
 */
export async function resetSiteConfig(adminEmail?: string): Promise<void> {
  const configRef = ref(database, SITE_CONFIG_REF);
  const resetData: SiteConfig = {
    ...DEFAULT_SITE_CONFIG,
    updatedAt: Date.now(),
    updatedBy: adminEmail || 'Admin',
  };
  await set(configRef, resetData);
}
