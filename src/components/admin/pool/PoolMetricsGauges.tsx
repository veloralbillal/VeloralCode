import React from 'react';
import { Cpu, Zap, Activity, Database, CheckCircle2, Flame } from 'lucide-react';
import { PoolMetrics } from '../../../services/pool/connectionPoolTypes';

interface PoolMetricsGaugesProps {
  metrics: PoolMetrics;
}

export const PoolMetricsGauges: React.FC<PoolMetricsGaugesProps> = ({ metrics }) => {
  const totalQueries = metrics.cacheHits + metrics.cacheMisses;
  const hitRate = totalQueries > 0 ? Math.round((metrics.cacheHits / totalQueries) * 100) : 98;
  const socketRatio = metrics.totalSubscribers > 0 
    ? Math.round(((metrics.totalSubscribers - metrics.activeChannels) / metrics.totalSubscribers) * 100)
    : 100;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Multiplexed Channels */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Wire Sockets</span>
          <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <Cpu className="w-4 h-4" />
          </span>
        </div>
        <div className="mt-2">
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {metrics.activeChannels} <span className="text-xs font-medium text-slate-400">Physical Sockets</span>
          </div>
          <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Serving {metrics.totalSubscribers} virtual listeners ({socketRatio}% socket savings)</span>
          </div>
        </div>
      </div>

      {/* 2. Virtual Subscribers & Peak */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Virtual Subscribers</span>
          <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Activity className="w-4 h-4" />
          </span>
        </div>
        <div className="mt-2">
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
            {metrics.totalSubscribers} <span className="text-xs font-medium text-slate-400">Active</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Peak Session Capacity: <strong className="text-slate-700 dark:text-slate-200">{metrics.peakConcurrentSubscribers} concurrent</strong>
          </div>
        </div>
      </div>

      {/* 3. L1 Cache Hit Rate */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">L1 Memory Cache</span>
          <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <Zap className="w-4 h-4" />
          </span>
        </div>
        <div className="mt-2">
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {hitRate}% <span className="text-xs font-medium text-slate-400">Hit Velocity</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {metrics.cacheHits} Hits • {metrics.cacheMisses} Initial loads
          </div>
        </div>
      </div>

      {/* 4. Write Queue Throttler */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Write Queue Throttling</span>
          <span className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
            <Flame className="w-4 h-4" />
          </span>
        </div>
        <div className="mt-2">
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {metrics.processedWrites} <span className="text-xs font-medium text-slate-400">Processed</span>
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">
            {metrics.queuedWrites === 0 ? 'Queue Empty (Zero Backlog)' : `${metrics.queuedWrites} pending writes queued`}
          </div>
        </div>
      </div>
    </div>
  );
};
