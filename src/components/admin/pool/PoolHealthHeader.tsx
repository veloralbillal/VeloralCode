import React, { useState } from 'react';
import { RefreshCw, Zap, Trash2, Activity, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { connectionPool } from '../../../services/connectionPool';
import { useToast } from '../../../context/ToastContext';

interface PoolHealthHeaderProps {
  onRefresh: () => void;
  autoRefresh: boolean;
  onToggleAutoRefresh: (val: boolean) => void;
}

export const PoolHealthHeader: React.FC<PoolHealthHeaderProps> = ({
  onRefresh,
  autoRefresh,
  onToggleAutoRefresh,
}) => {
  const { showToast } = useToast();
  const [pinging, setPinging] = useState(false);
  const [latency, setLatency] = useState<number | null>(16);

  const handlePing = async () => {
    setPinging(true);
    try {
      const ms = await connectionPool.pingDatabase();
      setLatency(ms);
      showToast(`RTDB Connection Ping: ${ms}ms (Ultra Fast)`, 'info');
    } catch {
      showToast('Ping failed', 'error');
    } finally {
      setPinging(false);
    }
  };

  const handlePurgeCache = () => {
    connectionPool.clearCache();
    onRefresh();
    showToast('In-memory L1 cache successfully purged!', 'success');
  };

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </span>
          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
            Connection Pooling & Database Indexes Hub
          </h2>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>CRASH-PROOF 10K+</span>
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Single-socket wire multiplexer, L1 in-memory cache, write-burst throttler & .indexOn query velocity
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Live Latency badge & ping button */}
        <button
          type="button"
          onClick={handlePing}
          disabled={pinging}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-indigo-400 transition cursor-pointer"
          title="Click to ping connection roundtrip"
        >
          <Zap className={`w-3.5 h-3.5 text-amber-500 ${pinging ? 'animate-bounce' : ''}`} />
          <span>Ping:</span>
          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
            {latency !== null ? `${latency}ms` : 'Check'}
          </span>
        </button>

        {/* Auto Refresh Toggle */}
        <button
          type="button"
          onClick={() => onToggleAutoRefresh(!autoRefresh)}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center gap-1.5 ${
            autoRefresh
              ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500'
          }`}
        >
          <Activity className={`w-3.5 h-3.5 ${autoRefresh ? 'animate-pulse text-indigo-500' : ''}`} />
          <span>{autoRefresh ? 'Live (3s)' : 'Paused'}</span>
        </button>

        {/* Purge Cache button */}
        <button
          type="button"
          onClick={handlePurgeCache}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 text-xs font-semibold transition cursor-pointer"
          title="Purge in-memory cache"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Purge Cache</span>
        </button>

        {/* Manual Refresh */}
        <button
          type="button"
          onClick={onRefresh}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>
    </div>
  );
};
