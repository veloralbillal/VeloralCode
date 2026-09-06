import React, { useState } from 'react';
import { Sliders, Save, Sparkles, Flame, Check, ShieldCheck, ToggleLeft, ToggleRight } from 'lucide-react';
import { PwaConfig } from '../../../utils/pwa/pwaTypes';

interface SwRemoteControlCardProps {
  config: PwaConfig;
  saving: boolean;
  onSaveConfig: (updated: Partial<PwaConfig>) => Promise<void>;
  onBroadcastCacheBust: () => Promise<void>;
}

export const SwRemoteControlCard: React.FC<SwRemoteControlCardProps> = ({
  config,
  saving,
  onSaveConfig,
  onBroadcastCacheBust,
}) => {
  const [formData, setFormData] = useState<PwaConfig>(config);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [bustSuccess, setBustSuccess] = useState(false);

  // Sync if prop changes
  React.useEffect(() => {
    setFormData(config);
  }, [config]);

  const handleToggle = (key: keyof PwaConfig) => {
    setFormData((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    await onSaveConfig(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleBust = async () => {
    await onBroadcastCacheBust();
    setBustSuccess(true);
    setTimeout(() => setBustSuccess(false), 2500);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Global Service Worker Control (RTDB)</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Settings applied across all visiting devices and PWA installs</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Realtime Sync</span>
        </div>
      </div>

      <div className="space-y-4 text-xs">
        {/* SW Master Enable/Disable */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <div>
            <p className="font-bold text-slate-900 dark:text-white text-sm">Service Worker Master Switch</p>
            <p className="text-slate-500 text-xs">When disabled, client browsers unregister workers and bypass all caching</p>
          </div>
          <button
            onClick={() => handleToggle('swEnabled')}
            className="text-2xl transition-colors"
          >
            {formData.swEnabled ? (
              <ToggleRight className="w-9 h-9 text-indigo-600 dark:text-indigo-400" />
            ) : (
              <ToggleLeft className="w-9 h-9 text-slate-400" />
            )}
          </button>
        </div>

        {/* Cache Version & Strategy */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Target Cache Version</label>
            <input
              type="text"
              value={formData.cacheVersion}
              onChange={(e) => setFormData({ ...formData, cacheVersion: e.target.value })}
              placeholder="e.g. v1.0.1"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Caching Strategy</label>
            <select
              value={formData.cacheStrategy}
              onChange={(e) => setFormData({ ...formData, cacheStrategy: e.target.value as PwaConfig['cacheStrategy'] })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="staleWhileRevalidate">Stale-While-Revalidate (Fastest & Fresh)</option>
              <option value="networkFirst">Network First (Fresh priority, Cache fallback)</option>
              <option value="cacheFirst">Cache First (Aggressive offline speed)</option>
            </select>
          </div>
        </div>

        {/* Additional Feature Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div
            onClick={() => handleToggle('offlineFallbackEnabled')}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">Offline Fallback</p>
              <p className="text-[11px] text-slate-500">Serve cached shell when no network</p>
            </div>
            <div className={`w-2.5 h-2.5 rounded-full ${formData.offlineFallbackEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`} />
          </div>

          <div
            onClick={() => handleToggle('userBannerEnabled')}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">App Update Notification</p>
              <p className="text-[11px] text-slate-500">Show floating toast on new SW release</p>
            </div>
            <div className={`w-2.5 h-2.5 rounded-full ${formData.userBannerEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`} />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={handleBust}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 text-amber-700 dark:text-amber-300 font-semibold text-xs transition-all hover:bg-amber-100 dark:hover:bg-amber-900/40 active:scale-95 shadow-xs"
        >
          <Flame className="w-4 h-4 text-amber-500" />
          <span>{bustSuccess ? 'Caches Purged Globally!' : 'Broadcast Cache Bust to All Devices'}</span>
        </button>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all active:scale-95 shadow-xs disabled:opacity-50"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Settings Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving to RTDB...' : 'Save PWA Settings'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
