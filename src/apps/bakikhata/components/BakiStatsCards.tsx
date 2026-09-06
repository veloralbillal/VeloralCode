import React from 'react';
import { DollarSign, Calendar, Smartphone, Coffee, Users } from 'lucide-react';
import { BakiStats } from '../types';
import { formatTaka } from '../utils/bakiUtils';

interface BakiStatsCardsProps {
  stats: BakiStats;
}

export const BakiStatsCards: React.FC<BakiStatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
      {/* Total Due */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs col-span-2 sm:col-span-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            মোট বকেয়া পাওনা
          </span>
          <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <span className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400">
            {formatTaka(stats.totalDueAmount)}
          </span>
          <p className="text-[11px] text-slate-400 mt-0.5">সব কাস্টমারের বকেয়া</p>
        </div>
      </div>

      {/* Tuesday Due */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            মঙ্গলবার পরিশোধ
          </span>
          <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <span className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">
            {formatTaka(stats.tuesdayDueAmount)}
          </span>
          <p className="text-[11px] text-slate-400 mt-0.5">{stats.tuesdayCustomerCount} জন গ্রাহক</p>
        </div>
      </div>

      {/* bKash Due */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            বিকাশ / রিচার্জ
          </span>
          <div className="w-8 h-8 rounded-xl bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center">
            <Smartphone className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <span className="text-xl sm:text-2xl font-black text-pink-600 dark:text-pink-400">
            {formatTaka(stats.bkashDueAmount)}
          </span>
          <p className="text-[11px] text-slate-400 mt-0.5">MFS ও রিচার্জ বাকি</p>
        </div>
      </div>

      {/* Cha & Pan */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            চা ও পান বাকি
          </span>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Coffee className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {formatTaka(stats.chaPanDueAmount)}
          </span>
          <p className="text-[11px] text-slate-400 mt-0.5">চা, পান ও সিগারেট</p>
        </div>
      </div>

      {/* Total Customers */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            মোট খাতার কাস্টমার
          </span>
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <span className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400">
            {stats.totalCustomers}
          </span>
          <p className="text-[11px] text-slate-400 mt-0.5">নিবন্ধিত ব্যক্তি</p>
        </div>
      </div>
    </div>
  );
};
