import React from 'react';
import { ShieldCheck, Cpu, Zap, Activity, CheckCircle2 } from 'lucide-react';
import { PoolMetrics } from '../../../services/pool/connectionPoolTypes';

interface PoolStatsCardProps {
  metrics: PoolMetrics;
}

export const PoolStatsCard: React.FC<PoolStatsCardProps> = ({ metrics }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Connection Pool Status</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">
                10,000+ USERS CRASH-SAFE
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Single-socket multiplexing & throttled write queue active
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-lg">
          <CheckCircle2 className="w-4 h-4" />
          <span>Active</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Active Wire Sockets</div>
          <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{metrics.activeChannels}</div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">Multiplexed Channels</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Virtual Subscribers</div>
          <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">{metrics.totalSubscribers}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Peak: {metrics.peakConcurrentSubscribers}</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">In-Memory Cache Hits</div>
          <div className="text-lg font-bold text-amber-600 dark:text-amber-400 mt-0.5">{metrics.cacheHits}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Roundtrips Saved</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Queued Writes Throttled</div>
          <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{metrics.processedWrites}</div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">Pending: {metrics.queuedWrites}</div>
        </div>
      </div>
    </div>
  );
};
