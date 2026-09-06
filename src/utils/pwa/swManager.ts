import { SwStatusInfo, CacheBucketInfo } from './pwaTypes';

/**
 * Service Worker Manager for inspection, control, and cache operations.
 */
export async function getSwStatus(): Promise<SwStatusInfo> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return {
      isSupported: false,
      isRegistered: false,
      state: 'none',
      scope: '',
      scriptURL: '',
      isControlling: false,
    };
  }

  try {
    const reg = await navigator.serviceWorker.getRegistration();
    if (!reg) {
      return {
        isSupported: true,
        isRegistered: false,
        state: 'none',
        scope: '',
        scriptURL: '',
        isControlling: false,
      };
    }

    const worker = reg.active || reg.waiting || reg.installing;
    return {
      isSupported: true,
      isRegistered: true,
      state: worker ? (worker.state as SwStatusInfo['state']) : 'active',
      scope: reg.scope,
      scriptURL: worker ? worker.scriptURL : '',
      isControlling: !!navigator.serviceWorker.controller,
    };
  } catch {
    return {
      isSupported: true,
      isRegistered: false,
      state: 'none',
      scope: '',
      scriptURL: '',
      isControlling: false,
    };
  }
}

export async function unregisterAllServiceWorkers(): Promise<boolean> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return false;
  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const reg of registrations) {
      await reg.unregister();
    }
    return true;
  } catch (err) {
    console.error('Failed to unregister service workers:', err);
    return false;
  }
}

export async function clearAllCaches(): Promise<{ clearedCount: number; keys: string[] }> {
  if (typeof window === 'undefined' || !('caches' in window)) {
    return { clearedCount: 0, keys: [] };
  }
  try {
    const keys = await caches.keys();
    for (const key of keys) {
      await caches.delete(key);
    }
    return { clearedCount: keys.length, keys };
  } catch (err) {
    console.error('Failed to clear caches:', err);
    return { clearedCount: 0, keys: [] };
  }
}

export async function getCacheBuckets(): Promise<CacheBucketInfo[]> {
  if (typeof window === 'undefined' || !('caches' in window)) return [];
  try {
    const keys = await caches.keys();
    const result: CacheBucketInfo[] = [];
    for (const key of keys) {
      try {
        const cache = await caches.open(key);
        const reqs = await cache.keys();
        result.push({ name: key, itemCount: reqs.length });
      } catch {
        result.push({ name: key, itemCount: 0 });
      }
    }
    return result;
  } catch {
    return [];
  }
}

export async function getStorageQuota(): Promise<{ usedMB: string; totalMB: string }> {
  if (typeof navigator !== 'undefined' && 'storage' in navigator && 'estimate' in navigator.storage) {
    try {
      const estimate = await navigator.storage.estimate();
      const used = ((estimate.usage || 0) / (1024 * 1024)).toFixed(2);
      const total = ((estimate.quota || 0) / (1024 * 1024)).toFixed(0);
      return { usedMB: used, totalMB: total };
    } catch {
      // Fallback
    }
  }
  return { usedMB: '0.00', totalMB: 'Unknown' };
}

export async function triggerSwUpdate(): Promise<void> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
  const reg = await navigator.serviceWorker.getRegistration();
  if (reg) {
    await reg.update();
    if (reg.waiting) {
      reg.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  }
}
