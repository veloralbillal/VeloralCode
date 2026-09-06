import React from 'react';
import { Activity, Zap, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { PoolLogEntry } from '../../../services/pool/connectionPoolTypes';

interface PoolActivityLoggerProps {
  logs: PoolLogEntry[];
  activePaths: string[];
}

export const PoolActivityLogger: React.FC<PoolActivityLoggerProps> = ({ logs, activePaths }) => {
  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Live Multiplexer Stream & Active Sockets
          </h3>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-slate-400">Active Wire Channels:</span>
          {activePaths.length === 0 ? (
            <span className="text-[11px] font-mono text-slate-400 italic">No open sockets (Idle)</span>
          ) : (
            activePaths.map((p) => (
              <span
                key={p}
                className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-300"
              >
                {p}
              </span>
            ))
          )}
        </div>
      </div>

      {/* Activity Log Feed */}
      <div className="space-y-2 max-h-48 overflow-y-auto pr-1 text-xs">
        {logs.length === 0 ? (
          <div className="text-center py-4 text-slate-400 text-xs">Awaiting connection pool operations...</div>
        ) : (
          logs.map((log) => {
            const timeStr = new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            return (
              <div
                key={log.id}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      log.type === 'cache_hit'
                        ? 'bg-amber-500'
                        : log.type === 'subscribe'
                        ? 'bg-indigo-500'
                        : log.type === 'purge'
                        ? 'bg-rose-500'
                        : 'bg-emerald-500'
                    }`}
                  />
                  <span className="font-mono text-[10px] text-slate-400 shrink-0">{timeStr}</span>
                  <span className="text-slate-800 dark:text-slate-200 truncate font-medium">{log.message}</span>
                </div>

                {log.path && (
                  <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0">
                    {log.path}
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
