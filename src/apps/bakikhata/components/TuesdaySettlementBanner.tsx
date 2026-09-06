import React from 'react';
import { Calendar, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { formatTaka, getNextTuesdayInfo } from '../utils/bakiUtils';

interface TuesdaySettlementBannerProps {
  tuesdayDueAmount: number;
  tuesdayCustomerCount: number;
  isFilterActive: boolean;
  onToggleFilter: () => void;
}

export const TuesdaySettlementBanner: React.FC<TuesdaySettlementBannerProps> = ({
  tuesdayDueAmount,
  tuesdayCustomerCount,
  isFilterActive,
  onToggleFilter,
}) => {
  const { dateStr, daysLeft, isTodayTuesday } = getNextTuesdayInfo();

  return (
    <div
      className={`rounded-2xl p-4 sm:p-5 border transition shadow-xs ${
        isTodayTuesday
          ? 'bg-amber-500/10 border-amber-500/40 text-amber-950 dark:text-amber-100'
          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-100'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
              isTodayTuesday
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30 animate-pulse'
                : 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
            }`}
          >
            <Calendar className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-black">
                {isTodayTuesday ? '🔔 আজ মঙ্গলবার — সাপ্তাহিক বাকি পরিশোধের দিন!' : '🗓️ মঙ্গলবার পেমেন্ট ট্র্যাকার'}
              </h2>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-white/70 dark:bg-slate-800/80">
                {isTodayTuesday ? 'আজকের দিন' : `${daysLeft} দিন বাকি`}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              {isTodayTuesday
                ? `আজকের মধ্যে ${tuesdayCustomerCount} জন গ্রাহকের কাছে মোট ${formatTaka(tuesdayDueAmount)} বকেয়া পাওনা রয়েছে।`
                : `আগামী মঙ্গলবার (${dateStr})-এ ${tuesdayCustomerCount} জন কাস্টমারের ${formatTaka(tuesdayDueAmount)} পরিশোধের কথা রয়েছে।`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            onClick={onToggleFilter}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
              isFilterActive
                ? 'bg-emerald-700 text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {isFilterActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5 text-amber-500" />}
            <span>{isFilterActive ? 'সব কাস্টমার দেখুন' : 'শুধু মঙ্গলবারের কাস্টমার'}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
