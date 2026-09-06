import React from 'react';
import { Database, Trash2, HardDrive, AlertCircle } from 'lucide-react';
import { CacheBucketInfo } from '../../../utils/pwa/pwaTypes';

interface SwLocalCacheCardProps {
  buckets: CacheBucketInfo[];
  storageUsage: { usedMB: string; totalMB: string };
  loading: boolean;
  onClearAll: () => Promise<void>;
  onDeleteBucket: (name: string) => Promise<void>;
}

export const SwLocalCacheCard: React.FC<SwLocalCacheCardProps> = ({
  buckets,
  storageUsage,
  loading,
  onClearAll,
  onDeleteBucket,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Client Cache Storage</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Inspected cache keys, precached assets, and disk usage</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-xs font-mono">
          <HardDrive className="w-3.5 h-3.5 text-indigo-500" />
          <span>{storageUsage.usedMB} MB / {storageUsage.totalMB} MB</span>
        </div>
      </div>

      {buckets.length === 0 ? (
        <div className="flex items-center gap-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs text-slate-500">
          <AlertCircle className="w-4 h-4 text-slate-400 shrink-0" />
          <span>No active CacheStorage buckets detected in this session.</span>
        </div>
      ) : (
        <div className="space-y-2">
          {buckets.map((bucket) => (
            <div
              key={bucket.name}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs"
            >
              <div className="min-w-0 pr-3">
                <p className="font-mono font-bold text-slate-800 dark:text-slate-200 truncate">{bucket.name}</p>
                <p className="text-[11px] text-slate-500">{bucket.itemCount} cached entries</p>
              </div>
              <button
                onClick={() => onDeleteBucket(bucket.name)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                title="Delete this cache"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="pt-2">
        <button
          onClick={onClearAll}
          disabled={loading || buckets.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold transition-all active:scale-95 disabled:opacity-40"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Purge All Local Caches</span>
        </button>
      </div>
    </div>
  );
};
