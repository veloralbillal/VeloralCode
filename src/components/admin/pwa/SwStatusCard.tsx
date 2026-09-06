import React from 'react';
import { Cpu, CheckCircle2, AlertTriangle, XCircle, RefreshCw, Radio } from 'lucide-react';
import { SwStatusInfo } from '../../../utils/pwa/pwaTypes';

interface SwStatusCardProps {
  status: SwStatusInfo;
  loading: boolean;
  onRefreshStatus: () => void;
  onForceUpdate: () => void;
  onUnregisterLocal: () => void;
}

export const SwStatusCard: React.FC<SwStatusCardProps> = ({
  status,
  loading,
  onRefreshStatus,
  onForceUpdate,
  onUnregisterLocal,
}) => {
  const getStatusBadge = () => {
    if (!status.isSupported) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-500">
          <XCircle className="w-3.5 h-3.5" /> Unsupported Browser
        </span>
      );
    }
    if (status.isRegistered && status.isControlling) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
          <CheckCircle2 className="w-3.5 h-3.5" /> Active & Controlling
        </span>
      );
    }
    if (status.isRegistered) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60">
          <Radio className="w-3.5 h-3.5 animate-pulse" /> Registered ({status.state})
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
        <AlertTriangle className="w-3.5 h-3.5" /> Not Active / Inactive
      </span>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Local Service Worker Runtime</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Current client browser thread and controller status</p>
          </div>
        </div>
        <div>{getStatusBadge()}</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
          <span className="text-slate-500 font-medium">Worker Scope</span>
          <p className="font-mono font-semibold text-slate-800 dark:text-slate-200 truncate">{status.scope || '/'}</p>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
          <span className="text-slate-500 font-medium">Lifecycle State</span>
          <p className="font-mono font-semibold text-slate-800 dark:text-slate-200 capitalize">{status.state}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 pt-2">
        <button
          onClick={onRefreshStatus}
          disabled={loading}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Status</span>
        </button>

        <button
          onClick={onForceUpdate}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all active:scale-95 shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Force SW Update</span>
        </button>

        {status.isRegistered && (
          <button
            onClick={onUnregisterLocal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold transition-all active:scale-95 ml-auto"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Unregister SW</span>
          </button>
        )}
      </div>
    </div>
  );
};
