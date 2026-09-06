import { ref, onValue, set } from 'firebase/database';
import { database } from '../../services/firebase';
import { PwaConfig } from './pwaTypes';
import { unregisterAllServiceWorkers, clearAllCaches } from './swManager';

export const DEFAULT_PWA_CONFIG: PwaConfig = {
  swEnabled: true,
  cacheVersion: 'v1.0.0',
  cacheStrategy: 'staleWhileRevalidate',
  offlineFallbackEnabled: true,
  userBannerEnabled: true,
  lastBustTimestamp: Date.now(),
};

const STORAGE_KEY = 'codetoolkit_pwa_bust_ts';

export async function savePwaConfig(config: Partial<PwaConfig>, userEmail?: string): Promise<void> {
  const fullConfig: PwaConfig = {
    ...DEFAULT_PWA_CONFIG,
    ...config,
    lastUpdatedBy: userEmail || 'Admin',
  };
  const pwaRef = ref(database, 'settings/pwa');
  await set(pwaRef, fullConfig);
}

/**
 * Subscribes to real-time PWA config updates from Firebase RTDB.
 * Automatically enforces admin policies (e.g. disable SW or bust cache).
 */
export function subscribePwaConfig(callback: (config: PwaConfig) => void): () => void {
  const pwaRef = ref(database, 'settings/pwa');

  const unsubscribe = onValue(
    pwaRef,
    (snapshot) => {
      const data = snapshot.val();
      const currentConfig: PwaConfig = data ? { ...DEFAULT_PWA_CONFIG, ...data } : DEFAULT_PWA_CONFIG;
      callback(currentConfig);

      // Enforce remote admin actions on clients
      if (!currentConfig.swEnabled) {
        unregisterAllServiceWorkers();
      }

      // Check if admin triggered a remote cache bust
      if (typeof window !== 'undefined' && currentConfig.lastBustTimestamp) {
        try {
          const storedTs = Number(localStorage.getItem(STORAGE_KEY) || 0);
          if (storedTs && currentConfig.lastBustTimestamp > storedTs) {
            clearAllCaches().then(() => {
              try {
                localStorage.setItem(STORAGE_KEY, String(currentConfig.lastBustTimestamp));
              } catch {
                // Ignore storage error in privacy mode
              }
            });
          } else if (!storedTs) {
            localStorage.setItem(STORAGE_KEY, String(currentConfig.lastBustTimestamp));
          }
        } catch {
          // Ignore localStorage errors (e.g. Brave shields / iframe restrictions)
        }
      }
    },
    (err) => {
      console.warn('Could not read remote PWA config, using fallback:', err);
      callback(DEFAULT_PWA_CONFIG);
    }
  );

  return () => {
    unsubscribe();
  };
}
