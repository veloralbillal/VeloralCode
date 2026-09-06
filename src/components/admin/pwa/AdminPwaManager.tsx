import React, { useState, useEffect, useCallback } from 'react';
import { Smartphone, Zap, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { SwStatusInfo, CacheBucketInfo, PwaConfig } from '../../../utils/pwa/pwaTypes';
import {
  getSwStatus,
  getCacheBuckets,
  getStorageQuota,
  clearAllCaches,
  unregisterAllServiceWorkers,
  triggerSwUpdate,
} from '../../../utils/pwa/swManager';
import {
  DEFAULT_PWA_CONFIG,
  subscribePwaConfig,
  savePwaConfig,
} from '../../../utils/pwa/pwaRemoteConfig';
import { SwStatusCard } from './SwStatusCard';
import { SwRemoteControlCard } from './SwRemoteControlCard';
import { SwLocalCacheCard } from './SwLocalCacheCard';

export const AdminPwaManager: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [pwaConfig, setPwaConfig] = useState<PwaConfig>(DEFAULT_PWA_CONFIG);
  const [swStatus, setSwStatus] = useState<SwStatusInfo>({
    isSupported: true,
    isRegistered: false,
    state: 'none',
    scope: '',
    scriptURL: '',
    isControlling: false,
  });
  const [cacheBuckets, setCacheBuckets] = useState<CacheBucketInfo[]>([]);
  const [storageUsage, setStorageUsage] = useState({ usedMB: '0.00', totalMB: 'Unknown' });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    try {
      const [status, buckets, quota] = await Promise.all([
        getSwStatus(),
        getCacheBuckets(),
        getStorageQuota(),
      ]);
      setSwStatus(status);
      setCacheBuckets(buckets);
      setStorageUsage(quota);
    } catch {
      // Ignored
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAll();
    const unsub = subscribePwaConfig((config) => {
      setPwaConfig(config);
    });
    return () => {
      unsub();
    };
  }, [refreshAll]);

  const handleSaveConfig = async (updated: Partial<PwaConfig>) => {
    setSaving(true);
    try {
      await savePwaConfig(updated, currentUser?.email || 'Admin');
      showToast('PWA configuration saved to Firebase RTDB', 'success');
      await refreshAll();
    } catch (err) {
      showToast('Failed to save PWA configuration', 'error');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleBroadcastCacheBust = async () => {
    try {
      const newTs = Date.now();
      await savePwaConfig({ ...pwaConfig, lastBustTimestamp: newTs }, currentUser?.email || 'Admin');
      await clearAllCaches();
      await refreshAll();
      showToast('Global cache bust signal dispatched to all clients!', 'success');
    } catch (err) {
      showToast('Failed to broadcast cache bust', 'error');
    }
  };

  const handleForceUpdate = async () => {
    await triggerSwUpdate();
    await refreshAll();
    showToast('Checked for Service Worker updates', 'info');
  };

  const handleUnregisterLocal = async () => {
    await unregisterAllServiceWorkers();
    await refreshAll();
    showToast('Unregistered local Service Worker', 'info');
  };

  const handleClearAllCaches = async () => {
    const res = await clearAllCaches();
    await refreshAll();
    showToast(`Cleared ${res.clearedCount} local cache stores`, 'success');
  };

  const handleDeleteBucket = async (name: string) => {
    if (typeof window !== 'undefined' && 'caches' in window) {
      await caches.delete(name);
      await refreshAll();
      showToast(`Deleted cache: ${name}`, 'info');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Hero Overview */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white border border-indigo-800/40 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-400/20 shrink-0">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">PWA & Service Worker Control Center</h2>
              <p className="text-xs text-indigo-200/80">Manage real-time browser caching, offline sync, and app installability</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold font-mono">
              SW {pwaConfig.swEnabled ? 'ENABLED' : 'DISABLED'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-0.5">
            <span className="text-[11px] text-indigo-200">Cache Strategy</span>
            <p className="text-xs font-bold font-mono text-white truncate">{pwaConfig.cacheStrategy}</p>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-0.5">
            <span className="text-[11px] text-indigo-200">Target Version</span>
            <p className="text-xs font-bold font-mono text-white truncate">{pwaConfig.cacheVersion}</p>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-0.5">
            <span className="text-[11px] text-indigo-200">Offline Fallback</span>
            <p className="text-xs font-bold font-mono text-white">
              {pwaConfig.offlineFallbackEnabled ? 'Active' : 'Off'}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-0.5">
            <span className="text-[11px] text-indigo-200">Precache Buckets</span>
            <p className="text-xs font-bold font-mono text-white">{cacheBuckets.length} Active</p>
          </div>
        </div>
      </div>

      {/* Control Cards */}
      <div className="space-y-6">
        <SwRemoteControlCard
          config={pwaConfig}
          saving={saving}
          onSaveConfig={handleSaveConfig}
          onBroadcastCacheBust={handleBroadcastCacheBust}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SwStatusCard
            status={swStatus}
            loading={loading}
            onRefreshStatus={refreshAll}
            onForceUpdate={handleForceUpdate}
            onUnregisterLocal={handleUnregisterLocal}
          />

          <SwLocalCacheCard
            buckets={cacheBuckets}
            storageUsage={storageUsage}
            loading={loading}
            onClearAll={handleClearAllCaches}
            onDeleteBucket={handleDeleteBucket}
          />
        </div>
      </div>
    </div>
  );
};
