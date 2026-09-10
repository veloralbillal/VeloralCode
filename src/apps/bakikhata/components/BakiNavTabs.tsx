import React from 'react';
import { Home, Users, BookOpen, Smartphone, Zap, Wallet } from 'lucide-react';
import { formatTaka } from '../utils/bakiUtils';

interface BakiNavTabsProps {
  activeTab: 'home' | 'customers' | 'khata' | 'bkash' | 'recharge' | 'income_expense';
  onTabChange: (tab: 'home' | 'customers' | 'khata' | 'bkash' | 'recharge' | 'income_expense') => void;
  totalCustomers: number;
  bkashFundBalance: number;
  totalRechargeProfit?: number;
}

export const BakiNavTabs: React.FC<BakiNavTabsProps> = ({
  activeTab,
  onTabChange,
  totalCustomers,
  bkashFundBalance,
  totalRechargeProfit = 0,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-200/80 dark:bg-slate-800/80 rounded-2xl w-full">
      <button
        onClick={() => onTabChange('home')}
        className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black transition ${
          activeTab === 'home'
            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <Home className="w-4 h-4" />
        <span>Home</span>
      </button>

      <button
        onClick={() => onTabChange('customers')}
        className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black transition ${
          activeTab === 'customers'
            ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <Users className="w-4 h-4" />
        <span>Customers</span>
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            activeTab === 'customers'
              ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
              : 'bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
          }`}
        >
          {totalCustomers}
        </span>
      </button>

      <button
        onClick={() => onTabChange('khata')}
        className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black transition ${
          activeTab === 'khata'
            ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <BookOpen className="w-4 h-4" />
        <span>Baki Khata</span>
      </button>

      <button
        onClick={() => onTabChange('bkash')}
        className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black transition ${
          activeTab === 'bkash'
            ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30'
            : 'text-slate-600 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400'
        }`}
      >
        <Smartphone className="w-4 h-4" />
        <span>Bkash Counter</span>
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
            activeTab === 'bkash'
              ? 'bg-white text-pink-700'
              : 'bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300'
          }`}
        >
          {formatTaka(bkashFundBalance)}
        </span>
      </button>

      <button
        onClick={() => onTabChange('recharge')}
        className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black transition ${
          activeTab === 'recharge'
            ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
            : 'text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400'
        }`}
      >
        <Zap className="w-4 h-4 text-amber-300" />
        <span>Recharge</span>
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
            activeTab === 'recharge'
              ? 'bg-white text-amber-700'
              : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
          }`}
        >
          {formatTaka(totalRechargeProfit)}
        </span>
      </button>

      <button
        onClick={() => onTabChange('income_expense')}
        className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black transition ${
          activeTab === 'income_expense'
            ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
            : 'text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400'
        }`}
      >
        <Wallet className="w-4 h-4 text-teal-200" />
        <span>আয় ও খরচ</span>
      </button>
    </div>
  );
};
