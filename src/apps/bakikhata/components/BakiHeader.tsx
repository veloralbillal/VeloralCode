import React from 'react';
import { BookOpen, Plus, UserPlus, ArrowLeft, Search, Menu } from 'lucide-react';

interface BakiHeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenAddCustomer: () => void;
  onOpenAddDue: () => void;
  onOpenSidebar: () => void;
  onBackToApp?: () => void;
}

export const BakiHeader: React.FC<BakiHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onOpenAddCustomer,
  onOpenAddDue,
  onOpenSidebar,
  onBackToApp,
}) => {
  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand & Title */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sidebar Menu Button */}
          <button
            onClick={onOpenSidebar}
            className="p-2 rounded-xl text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition shrink-0"
            title="মেনু / সাইডবার খুলুন"
            aria-label="Open Sidebar Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {onBackToApp && (
            <button
              onClick={onBackToApp}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0"
              title="ফিরে যান"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                বাকির খাতা
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                মুদি ও বিকাশ
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              চা, পান, মুদির সওদা ও বিকাশ লেনদেনের বকেয়া হিসাব
            </p>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="গ্রাহকের নাম বা মোবাইল নম্বর..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            onClick={onOpenAddCustomer}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            <UserPlus className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">নতুন কাস্টমার</span>
            <span className="sm:hidden">কাস্টমার</span>
          </button>

          <button
            onClick={onOpenAddDue}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন বাকি লিখুন</span>
          </button>
        </div>
      </div>
    </header>
  );
};
