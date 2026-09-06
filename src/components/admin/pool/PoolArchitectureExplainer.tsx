import React from 'react';
import { ShieldCheck, Zap, Server, Database, CheckCircle2, ArrowRight } from 'lucide-react';

export const PoolArchitectureExplainer: React.FC = () => {
  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
      <div className="flex items-center gap-2.5">
        <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400">
          <ShieldCheck className="w-5 h-5" />
        </span>
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            High-Concurrency Architecture (10,000+ Users Crash-Proof)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            How multiplexing and server-side indexing eliminate browser crashes, quota locks & latency spikes
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {/* Without Architecture */}
        <div className="p-4 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 space-y-2">
          <div className="font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Without Connection Pool & Indexes</span>
          </div>
          <ul className="space-y-1.5 text-slate-600 dark:text-slate-400 text-[11px]">
            <li className="flex items-start gap-1.5">
              <span className="text-rose-500 font-bold">•</span>
              <span><strong>10,000 Sockets:</strong> Every visitor opens independent WebSocket, hitting connection limits.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-rose-500 font-bold">•</span>
              <span><strong>Full Table Scans:</strong> Unindexed queries force Firebase to download entire databases to client.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-rose-500 font-bold">•</span>
              <span><strong>Write Collisions:</strong> High-traffic spikes cause simultaneous writes to crash browser state.</span>
            </li>
          </ul>
        </div>

        {/* With Architecture */}
        <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 space-y-2">
          <div className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>With Connection Pool & Indexes Enabled</span>
          </div>
          <ul className="space-y-1.5 text-slate-600 dark:text-slate-400 text-[11px]">
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Wire Multiplexer:</strong> 1 physical socket serves thousands of virtual component subscribers.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Server-Side .indexOn:</strong> Fast binary B-tree queries execute in O(log N) zero network penalty.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Queued Throttling:</strong> Batched execution with exponential backoff guarantees 100% zero drop.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
