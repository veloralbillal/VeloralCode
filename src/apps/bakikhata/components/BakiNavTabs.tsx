import React from 'react';
import { BookOpen, Smartphone } from 'lucide-react';
import { formatTaka } from '../utils/bakiUtils';

interface BakiNavTabsProps {
  activeTab: 'khata' | 'bkash';
  onTabChange: (tab: 'khata' | 'bkash') => void;
  totalCustomers: number;
  bkashFundBalance: number;
}

export const BakiNavTabs: React.FC<BakiNavTabsProps> = ({
  activeTab,
  onTabChange,
  totalCustomers,
  bkashFundBalance,
}) => {
  return (
    <div className="flex items-center gap-2 p-1.5 bg-slate-200/80 dark:bg-slate-800/80 rounded-2xl w-full sm:w-auto max-w-md">
      <button
        onClick={() => onTabChange('khata')}
        className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition ${
          activeTab === 'khata'
            ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <BookOpen className="w-4 h-4" />
        <span>বাকির খাতা</span>
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            activeTab === 'khata'
              ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
              : 'bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
          }`}
        >
          {totalCustomers} জন
        </span>
      </button>

      <button
        onClick={() => onTabChange('bkash')}
        className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition ${
          activeTab === 'bkash'
            ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30'
            : 'text-slate-600 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400'
        }`}
      >
        <Smartphone className="w-4 h-4" />
        <span>বিকাশ ও রিচার্জ</span>
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
            activeTab === 'bkash'
              ? 'bg-white text-pink-700'
              : 'bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300'
          }`}
        >
          ফান্ড {formatTaka(bkashFundBalance)}
        </span>
      </button>
    </div>
  );
};
