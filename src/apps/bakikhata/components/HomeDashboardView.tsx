import React from 'react';
import {
  Home,
  BookOpen,
  Smartphone,
  Zap,
  PlusCircle,
  ArrowDownRight,
  Users,
  TrendingUp,
  FileText,
  Calendar,
  Sparkles,
  ChevronRight,
  DollarSign,
  Wallet,
} from 'lucide-react';
import { Customer, BakiTransaction, BakiStats, BkashFund } from '../types';
import { formatTaka, formatDateTime } from '../utils/bakiUtils';

interface HomeDashboardViewProps {
  stats: BakiStats;
  bkashFundBalance: number;
  totalRechargeProfit: number;
  customers: Customer[];
  transactions: BakiTransaction[];
  onNavigateTab: (tab: 'khata' | 'bkash' | 'recharge') => void;
  onOpenAddCustomer: () => void;
  onOpenAddDue: () => void;
  onOpenPayment: () => void;
  onOpenDailyReport: () => void;
  onViewCustomerDetails: (customer: Customer) => void;
  onOpenIncomeExpense: () => void;
}

export const HomeDashboardView: React.FC<HomeDashboardViewProps> = ({
  stats,
  bkashFundBalance,
  totalRechargeProfit,
  customers,
  transactions,
  onNavigateTab,
  onOpenAddCustomer,
  onOpenAddDue,
  onOpenPayment,
  onOpenDailyReport,
  onViewCustomerDetails,
  onOpenIncomeExpense,
}) => {
  const recentTransactions = transactions.slice(0, 6);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>ডিজিটাল দোকান ও বাকির খাতা ম্যানেজমেন্ট</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              আসসালামু আলাইকুম, স্বাগতম! 🙏
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-xl">
              আপনার দোকানের সমস্ত বাকি খাতা, বিকাশ ক্যাশ-ইন/আউট এবং মোবাইল রিচার্জের হিসাব রাখুন সম্পূর্ণ নিরাপদ ও নির্ভুলভাবে।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onOpenAddDue}
              className="px-4 py-2.5 rounded-2xl bg-white text-emerald-800 hover:bg-emerald-50 font-black text-xs shadow-lg transition flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-emerald-600" />
              <span>বাকি লিখুন</span>
            </button>
            <button
              onClick={onOpenPayment}
              className="px-4 py-2.5 rounded-2xl bg-emerald-700/80 hover:bg-emerald-700 text-white font-black text-xs shadow-lg border border-white/20 transition flex items-center gap-2 cursor-pointer"
            >
              <ArrowDownRight className="w-4 h-4" />
              <span>টাকা জমা নিন</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">মোট বকেয়া (Total Due)</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400">
            {formatTaka(stats.totalDueAmount)}
          </div>
          <p className="text-[11px] text-slate-400 font-medium">{stats.totalCustomers} জন কাস্টমার</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">মোট আদায় (Total Paid)</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {formatTaka(stats.totalPaidAmount)}
          </div>
          <p className="text-[11px] text-slate-400 font-medium">সর্বমোট ক্যাশ কালেকশন</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">বিকাশ ফান্ড ব্যালেন্স</span>
            <div className="w-8 h-8 rounded-xl bg-pink-50 dark:bg-pink-950/50 text-pink-600 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-pink-600 dark:text-pink-400">
            {formatTaka(bkashFundBalance)}
          </div>
          <p className="text-[11px] text-slate-400 font-medium">লাইভ কাউন্টার ব্যালেন্স</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">রিচার্জ কমিশন লাভ</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">
            {formatTaka(totalRechargeProfit)}
          </div>
          <p className="text-[11px] text-slate-400 font-medium">মোট রিচার্জ প্রফিট</p>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => onNavigateTab('khata')}
          className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500 shadow-xs transition cursor-pointer group flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">বাকির খাতা (Khata)</h3>
              <p className="text-xs text-slate-500">{stats.totalCustomers} জন কাস্টমার তালিকা</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition" />
        </div>

        <div
          onClick={() => onNavigateTab('bkash')}
          className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 hover:border-pink-500 shadow-xs transition cursor-pointer group flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center group-hover:scale-110 transition">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">বিকাশ কাউন্টার (Bkash)</h3>
              <p className="text-xs text-slate-500">ক্যাশ ইন, আউট ও সেন্ড মানি</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition" />
        </div>

        <div
          onClick={() => onNavigateTab('recharge')}
          className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 hover:border-amber-500 shadow-xs transition cursor-pointer group flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">মোবাইল রিচার্জ (Recharge)</h3>
              <p className="text-xs text-slate-500">গ্রাহক রিচার্জ ও কমিশন হিসাব</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition" />
        </div>
      </div>

      {/* Income & Expense Banner Card */}
      <div
        onClick={onOpenIncomeExpense}
        className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 dark:from-emerald-950/40 dark:to-indigo-950/40 p-6 rounded-3xl border border-emerald-500/30 hover:border-emerald-500 shadow-xs transition cursor-pointer group flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center group-hover:scale-110 transition shadow-md">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">আয় ও খরচ হিসাব (Income & Expenses)</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">দোকানে কত খরচ হলো আর কত আয়/লাভ হলো একনজরে দেখুন</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-block px-3 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold">হিসাব দেখুন</span>
          <ChevronRight className="w-5 h-5 text-emerald-600 group-hover:translate-x-1 transition" />
        </div>
      </div>

      {/* Recent Transactions & Quick Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>সাম্প্রতিক লেনদেন (Recent Transactions)</span>
            </h3>
            <button
              onClick={() => onNavigateTab('khata')}
              className="text-xs font-bold text-emerald-600 hover:underline"
            >
              সব দেখুন
            </button>
          </div>

          <div className="space-y-2.5">
            {recentTransactions.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">কোনো লেনদেন পাওয়া যায়নি।</p>
            ) : (
              recentTransactions.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
                >
                  <div className="space-y-0.5 min-w-0">
                    <p className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                      {t.customerName}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {t.itemsSummary || t.category} • {formatDateTime(t.timestamp)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`text-xs font-black px-2.5 py-1 rounded-xl inline-block ${
                        t.type === 'due'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                      }`}
                    >
                      {t.type === 'due' ? '+' : '-'}{formatTaka(t.amount)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Tools & Reports */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <h3 className="font-black text-slate-900 dark:text-white text-base flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>দোকান টুলস ও রিপোর্ট</span>
          </h3>

          <div className="space-y-2.5">
            <button
              onClick={onOpenDailyReport}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 transition text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">দৈনিক হিসাব রিপোর্ট</h4>
                  <p className="text-[11px] text-slate-500">আজকের ক্যাশ ও বাকি সারসংক্ষেপ</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={onOpenAddCustomer}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 transition text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">নতুন কাস্টমার যুক্ত করুন</h4>
                  <p className="text-[11px] text-slate-500">খাতায় নাম ও নম্বর রেজিস্টার করুন</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
