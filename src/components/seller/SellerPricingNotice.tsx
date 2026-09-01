import React from 'react';
import { Sparkles, Coins, Zap } from 'lucide-react';
import { SellerPricingConfig } from '../../types';

interface SellerPricingNoticeProps {
  pricing: SellerPricingConfig | null;
  onNavigate: (route: string) => void;
}

export const SellerPricingNotice: React.FC<SellerPricingNoticeProps> = ({
  pricing,
  onNavigate,
}) => {
  const tiers = [
    { label: '1 Month', days: 30, cost: pricing?.cost1Month || 10 },
    { label: '3 Months', days: 90, cost: pricing?.cost3Month || 25 },
    { label: '6 Months', days: 180, cost: pricing?.cost6Month || 45 },
    { label: '1 Year', days: 365, cost: pricing?.cost1Year || 80 },
    { label: 'Lifetime', days: 0, cost: pricing?.costLifetime || 150 },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Official Key Point Rates
          </h3>
        </div>
        <button
          onClick={() => onNavigate('#/seller/generate')}
          className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
        >
          <Zap className="w-3.5 h-3.5 fill-amber-500" />
          <span>Generate Now</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {tiers.map((t) => (
          <div
            key={t.label}
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-2 hover:border-amber-500/40 transition"
          >
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              {t.label}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-slate-900 dark:text-white">
                {t.cost}
              </span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                Coins
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
