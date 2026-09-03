import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { formatActionLabel } from './eventUtils';

interface EventPriceBoxProps {
  price: number;
  downPrice: number;
  currency: string;
  actionLabel?: string;
  onAction: () => void;
}

export const EventPriceBox: React.FC<EventPriceBoxProps> = ({
  price,
  downPrice,
  currency,
  actionLabel,
  onAction,
}) => {
  const displayLabel = formatActionLabel(actionLabel);

  return (
    <div className="p-3.5 sm:p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
      <div className="space-y-0.5">
        <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
          Regular Fee: <span className="line-through">{currency}{price.toLocaleString()}</span>
        </span>

        <div className="flex items-baseline gap-2">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Down Price:
          </span>
          <div className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400">
            {currency}{downPrice.toLocaleString()}
          </div>
        </div>
      </div>

      <button
        onClick={onAction}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 active:scale-95 text-white text-sm sm:text-base font-bold shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
      >
        <ShoppingBag className="w-4 h-4 shrink-0" />
        <span>{displayLabel}</span>
        <ArrowRight className="w-4 h-4 shrink-0" />
      </button>
    </div>
  );
};
