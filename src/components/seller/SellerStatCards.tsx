import React from 'react';
import {
  Coins,
  Key,
  CheckCircle2,
  FolderKey,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';

interface SellerStatCardsProps {
  currentCoins: number;
  totalKeys: number;
  activeKeys: number;
  usedKeys: number;
  onNavigate: (route: string) => void;
}

export const SellerStatCards: React.FC<SellerStatCardsProps> = ({
  currentCoins,
  totalKeys,
  activeKeys,
  usedKeys,
  onNavigate,
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Points Balance */}
      <div
        onClick={() => onNavigate('#/seller/wallet')}
        className="cursor-pointer group bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 shadow-xs hover:border-amber-500/50 dark:hover:border-amber-500/50 transition relative overflow-hidden"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Point Balance</span>
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60">
            <Coins className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 space-y-1">
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {currentCoins.toLocaleString()}
          </div>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
            <span>Points / Coins</span>
            <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </p>
        </div>
      </div>

      {/* Active Ready Keys */}
      <div
        onClick={() => onNavigate('#/seller/active-keys')}
        className="cursor-pointer group bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 shadow-xs hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition relative overflow-hidden"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Active Keys</span>
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 space-y-1">
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {activeKeys}
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
            <span>Ready to sell</span>
            <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </p>
        </div>
      </div>

      {/* Redeemed / Used Keys */}
      <div
        onClick={() => onNavigate('#/seller/reports')}
        className="cursor-pointer group bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 shadow-xs hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition relative overflow-hidden"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Sold / Redeemed</span>
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
            <Key className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 space-y-1">
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {usedKeys}
          </div>
          <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1">
            <span>Activated by clients</span>
            <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </p>
        </div>
      </div>

      {/* Total Generated */}
      <div
        onClick={() => onNavigate('#/seller/keys')}
        className="cursor-pointer group bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 shadow-xs hover:border-violet-500/50 dark:hover:border-violet-500/50 transition relative overflow-hidden"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Keys</span>
          <div className="p-2.5 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 border border-violet-200/60 dark:border-violet-800/60">
            <FolderKey className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 space-y-1">
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {totalKeys}
          </div>
          <p className="text-[11px] text-violet-600 dark:text-violet-400 font-bold flex items-center gap-1">
            <span>All generated</span>
            <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </p>
        </div>
      </div>
    </div>
  );
};
