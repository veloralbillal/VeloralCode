import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  Wallet,
  DollarSign,
  Receipt,
  AlertCircle,
  Calculator,
  Loader2,
  ShoppingBag,
  Store,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
} from 'lucide-react';
import {
  ShopExpense,
  ExpenseCategory,
  ShopSale,
  SaleCategory,
  Customer,
  RechargeTransaction,
} from '../types';
import { formatTaka } from '../utils/bakiUtils';

interface IncomeExpenseSectionViewProps {
  expenses: ShopExpense[];
  sales: ShopSale[];
  customers: Customer[];
  rechargeTransactions: RechargeTransaction[];
  bkashFundBalance: number;
  totalRechargeProfit: number;
  onAddExpense: (expense: Omit<ShopExpense, 'id' | 'timestamp'>) => Promise<void>;
  onDeleteExpense: (id: string) => Promise<void>;
  onAddSale: (sale: Omit<ShopSale, 'id' | 'timestamp'>) => Promise<void>;
  onDeleteSale: (id: string) => Promise<void>;
}

export const IncomeExpenseSectionView: React.FC<IncomeExpenseSectionViewProps> = ({
  expenses,
  sales,
  customers,
  rechargeTransactions,
  bkashFundBalance,
  totalRechargeProfit,
  onAddExpense,
  onDeleteExpense,
  onAddSale,
  onDeleteSale,
}) => {
  // Navigation tabs: summary, expenses_list (খরচ কত), sales_list (কত সেলস হলো)
  const [activeTab, setActiveTab] = useState<'summary' | 'expenses_list' | 'sales_list'>('summary');

  // Form mode: 'expense' (খরচ) or 'sale' (বিক্রি / সেলস)
  const [formMode, setFormMode] = useState<'expense' | 'sale'>('expense');

  // Form state
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState<ExpenseCategory>('goods_purchase');
  const [saleCategory, setSaleCategory] = useState<SaleCategory>('cash_sale');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Deletion tracking
  const [deletingExpenseId, setDeletingExpenseId] = useState<string | null>(null);
  const [deletingSaleId, setDeletingSaleId] = useState<string | null>(null);
  const [optimisticDeletedExpenseIds, setOptimisticDeletedExpenseIds] = useState<Set<string>>(new Set());
  const [optimisticDeletedSaleIds, setOptimisticDeletedSaleIds] = useState<Set<string>>(new Set());

  // Filter out optimistically deleted items
  const displayedExpenses = expenses.filter((e) => !optimisticDeletedExpenseIds.has(e.id));
  const displayedSales = sales.filter((s) => !optimisticDeletedSaleIds.has(s.id));

  // Calculations
  const totalPaidCollection = customers.reduce((sum, c) => sum + (Number(c.totalPaid) || 0), 0);
  const totalDueAmount = customers.reduce((sum, c) => sum + (Number(c.totalDue) || 0), 0);

  // Sales calculations (কত সেলস হলো)
  const totalDirectSales = displayedSales.reduce((sum, s) => sum + (Number(s.amount) || 0), 0);
  // Total Gross Sales = Recorded Direct Cash Sales + Customer Due Sales (বাকি বিক্রি)
  const totalGrossSales = totalDirectSales + totalDueAmount;

  // Expense calculations (খরচ কত)
  const totalExpenses = displayedExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  // Cash In Hand = Direct Sales + Customer Paid Collections + Recharge Profits - Total Expenses
  const netCashBalance = (totalDirectSales + totalPaidCollection + totalRechargeProfit) - totalExpenses;

  // Net Business Profit = Gross Sales + Recharge Profits - Total Expenses
  const netProfit = (totalGrossSales + totalRechargeProfit) - totalExpenses;

  // Today's Stats
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const todayTimestamp = startOfToday.getTime();

  const todaySales = displayedSales
    .filter((s) => s.timestamp >= todayTimestamp)
    .reduce((sum, s) => sum + (Number(s.amount) || 0), 0);

  const todayExpenses = displayedExpenses
    .filter((e) => e.timestamp >= todayTimestamp)
    .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  // Handlers
  const handleDeleteExpense = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (deletingExpenseId) return;

    setDeletingExpenseId(id);
    setOptimisticDeletedExpenseIds((prev) => new Set([...prev, id]));

    try {
      await onDeleteExpense(id);
    } catch {
      setOptimisticDeletedExpenseIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } finally {
      setDeletingExpenseId(null);
    }
  };

  const handleDeleteSale = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (deletingSaleId) return;

    setDeletingSaleId(id);
    setOptimisticDeletedSaleIds((prev) => new Set([...prev, id]));

    try {
      await onDeleteSale(id);
    } catch {
      setOptimisticDeletedSaleIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } finally {
      setDeletingSaleId(null);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmt = Number(amount);
    if (!title.trim() || isNaN(numAmt) || numAmt <= 0) return;

    setIsSubmitting(true);
    try {
      if (formMode === 'expense') {
        await onAddExpense({
          title: title.trim(),
          amount: numAmt,
          category: expenseCategory,
          note: note.trim() || undefined,
        });
      } else {
        await onAddSale({
          title: title.trim(),
          amount: numAmt,
          category: saleCategory,
          note: note.trim() || undefined,
        });
      }
      setTitle('');
      setAmount('');
      setNote('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getExpenseCategoryBadge = (cat: ExpenseCategory) => {
    switch (cat) {
      case 'rent':
        return { label: 'দোকান ভাড়া', color: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300' };
      case 'electricity':
        return { label: 'বিদ্যুৎ বিল', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' };
      case 'goods_purchase':
        return { label: 'মাল কেনা', color: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300' };
      case 'salary':
        return { label: 'বেতন', color: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300' };
      case 'transport':
        return { label: 'যাতায়াত/ভ্যান', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300' };
      default:
        return { label: 'অন্যান্য খরচ', color: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300' };
    }
  };

  const getSaleCategoryBadge = (cat: SaleCategory) => {
    switch (cat) {
      case 'cash_sale':
        return { label: 'নগদ বিক্রি', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' };
      case 'grocery':
        return { label: 'মুদি বিক্রি', color: 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300' };
      case 'tea_snack':
        return { label: 'চা ও নাস্তা', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' };
      case 'retail':
        return { label: 'সাধারণ রিটেইল', color: 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300' };
      default:
        return { label: 'অন্যান্য বিক্রি', color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300' };
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-white/15 rounded-2xl backdrop-blur-md shadow-inner shrink-0">
            <Store className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black">আয় ও খরচ হিসাব (Income & Expenses)</h1>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1">
              দোকানে কত খরচ হলো, কত সেলস হলো এবং মোট নিট লাভের পূর্ণাঙ্গ খাতা
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Today Quick Glance */}
          <div className="flex-1 sm:flex-initial bg-black/20 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10">
            <div className="text-[10px] text-emerald-200 uppercase font-bold flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>আজকের বিক্রি</span>
            </div>
            <div className="text-base font-black text-white">{formatTaka(todaySales)}</div>
          </div>

          {/* Net Cash Balance */}
          <div className="flex-1 sm:flex-initial bg-black/20 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10">
            <div className="text-[10px] text-emerald-200 uppercase font-bold flex items-center gap-1">
              <Calculator className="w-3.5 h-3.5" />
              <span>নিট ক্যাশ ব্যালেন্স</span>
            </div>
            <div className="text-base font-black text-white">{formatTaka(netCashBalance)}</div>
          </div>
        </div>
      </div>

      {/* Tabs Switcher: Summary, Expenses (খরচ কত), Sales (কত সেলস হলো) */}
      <div className="flex flex-wrap border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-xs overflow-x-auto p-1.5 gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('summary')}
          className={`py-3 px-5 font-bold text-xs sm:text-sm rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === 'summary'
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>আয় ও লাভ সারসংক্ষেপ</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('expenses_list');
            setFormMode('expense');
          }}
          className={`py-3 px-5 font-bold text-xs sm:text-sm rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === 'expenses_list'
              ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>খরচ কত (Expenses) ({displayedExpenses.length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('sales_list');
            setFormMode('sale');
          }}
          className={`py-3 px-5 font-bold text-xs sm:text-sm rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === 'sales_list'
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>কত সেলস হলো (Sales) ({displayedSales.length})</span>
        </button>
      </div>

      {activeTab === 'summary' ? (
        <div className="space-y-6">
          {/* Summary Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Total Sales (কত সেলস হলো) */}
            <div className="p-5 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400">
                <span className="text-xs font-bold uppercase tracking-wider">মোট সেলস (Total Sales)</span>
                <div className="p-2 bg-emerald-200/60 dark:bg-emerald-900/60 rounded-xl">
                  <ShoppingBag className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-emerald-900 dark:text-emerald-100">
                {formatTaka(totalGrossSales)}
              </div>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                নগদ সেলস: {formatTaka(totalDirectSales)} + বাকি সেলস: {formatTaka(totalDueAmount)}
              </p>
            </div>

            {/* Card 2: Total Expenses (খরচ কত) */}
            <div className="p-5 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-rose-700 dark:text-rose-400">
                <span className="text-xs font-bold uppercase tracking-wider">মোট খরচ (Total Expenses)</span>
                <div className="p-2 bg-rose-200/60 dark:bg-rose-900/60 rounded-xl">
                  <TrendingDown className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-rose-900 dark:text-rose-100">
                {formatTaka(totalExpenses)}
              </div>
              <p className="text-[11px] text-rose-700 dark:text-rose-300">
                {displayedExpenses.length} টি খরচের এন্ট্রি রেকর্ড করা আছে
              </p>
            </div>

            {/* Card 3: Net Profit (নিট লাভ) */}
            <div
              className={`p-5 rounded-3xl border shadow-xs space-y-2 ${
                netProfit >= 0
                  ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/60 text-blue-900 dark:text-blue-100'
                  : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-100'
              }`}
            >
              <div className="flex items-center justify-between opacity-80">
                <span className="text-xs font-bold uppercase tracking-wider">দোকানের নিট লাভ (Profit)</span>
                <div className="p-2 bg-white/30 dark:bg-black/20 rounded-xl">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black">{formatTaka(netProfit)}</div>
              <p className="text-[11px] opacity-80">
                {netProfit >= 0 ? 'মোট বিক্রি থেকে মোট খরচ বাদ দিয়ে লাভ' : 'খরচ মোট বিক্রির চেয়ে বেশি'}
              </p>
            </div>

            {/* Card 4: Net Cash Balance */}
            <div className="p-5 rounded-3xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/60 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-teal-700 dark:text-teal-400">
                <span className="text-xs font-bold uppercase tracking-wider">হাতে ক্যাশ ব্যালেন্স</span>
                <div className="p-2 bg-teal-200/60 dark:bg-teal-900/60 rounded-xl">
                  <Wallet className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-teal-900 dark:text-teal-100">
                {formatTaka(netCashBalance)}
              </div>
              <p className="text-[11px] text-teal-700 dark:text-teal-300">
                নগদ বিক্রি + আদায় + রিচার্জ লাভ - খরচ
              </p>
            </div>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => {
                setActiveTab('expenses_list');
                setFormMode('expense');
              }}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-rose-200/80 dark:border-rose-900/40 hover:border-rose-400 transition cursor-pointer flex items-center justify-between group shadow-2xs"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center font-bold">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">খরচের হিসাব (খরচ কত)</h4>
                  <p className="text-xs text-slate-500">নতুন খরচ যোগ করুন বা খরচের তালিকা দেখুন</p>
                </div>
              </div>
              <span className="text-xs font-bold text-rose-600 group-hover:translate-x-1 transition flex items-center gap-1">
                <span>যান</span>
                <ArrowDownRight className="w-4 h-4" />
              </span>
            </div>

            <div
              onClick={() => {
                setActiveTab('sales_list');
                setFormMode('sale');
              }}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-900/40 hover:border-emerald-400 transition cursor-pointer flex items-center justify-between group shadow-2xs"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">বিক্রির হিসাব (কত সেলস হলো)</h4>
                  <p className="text-xs text-slate-500">নগদ বিক্রি যোগ করুন বা বিক্রির খাতা দেখুন</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition flex items-center gap-1">
                <span>যান</span>
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Breakdown Details Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-emerald-600" />
              <span>দোকানের আর্থিক বিবরণী (Detailed Financial Breakdown)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div className="text-xs text-slate-500 font-medium">রেকর্ডকৃত নগদ বিক্রি (Cash Sales)</div>
                <div className="text-xl font-black text-emerald-600 mt-1">{formatTaka(totalDirectSales)}</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div className="text-xs text-slate-500 font-medium">কাস্টমারদের মোট বাকি (Due Amount)</div>
                <div className="text-xl font-black text-rose-600 mt-1">{formatTaka(totalDueAmount)}</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div className="text-xs text-slate-500 font-medium">কাস্টমারদের পরিশোধকৃত আদায় (Paid)</div>
                <div className="text-xl font-black text-teal-600 mt-1">{formatTaka(totalPaidCollection)}</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div className="text-xs text-slate-500 font-medium">মোবাইল রিচার্জ প্রফিট</div>
                <div className="text-xl font-black text-amber-600 mt-1">{formatTaka(totalRechargeProfit)}</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Form & History Section for Expenses (খরচ কত) or Sales (কত সেলস হলো) */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Form with fast Toggle */}
          <div className="lg:col-span-1">
            <form
              onSubmit={handleFormSubmit}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 sticky top-6"
            >
              {/* Toggle Form Mode: খরচ vs বিক্রি */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  হিসাবের ধরণ নির্বাচন করুন
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => {
                      setFormMode('expense');
                      setActiveTab('expenses_list');
                    }}
                    className={`py-2 px-3 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
                      formMode === 'expense'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                    }`}
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>খরচ (Expense)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFormMode('sale');
                      setActiveTab('sales_list');
                    }}
                    className={`py-2 px-3 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
                      formMode === 'sale'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>বিক্রি (Sales)</span>
                  </button>
                </div>
              </div>

              <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  {formMode === 'expense' ? (
                    <>
                      <div className="w-6 h-6 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
                        <Plus className="w-4 h-4" />
                      </div>
                      <span>নতুন খরচ যোগ করুন (খরচ কত)</span>
                    </>
                  ) : (
                    <>
                      <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                        <Plus className="w-4 h-4" />
                      </div>
                      <span>নতুন বিক্রি যোগ করুন (কত সেলস হলো)</span>
                    </>
                  )}
                </h3>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                    {formMode === 'expense' ? 'খরচের বিবরণ / খাত' : 'বিক্রির বিবরণ / পণ্য'}
                  </label>
                  <input
                    type="text"
                    placeholder={
                      formMode === 'expense'
                        ? 'যেমন: বিদ্যুৎ বিল, দোকান ভাড়া, মাল কেনা...'
                        : 'যেমন: আজকের ক্যাশ বিক্রি, চাল-ডাল বিক্রি...'
                    }
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-emerald-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                    পরিমাণ (টাকা)
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-emerald-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                    ক্যাটাগরি
                  </label>
                  {formMode === 'expense' ? (
                    <select
                      value={expenseCategory}
                      onChange={(e) => setExpenseCategory(e.target.value as ExpenseCategory)}
                      className="w-full px-4 py-3 rounded-2xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-emerald-600"
                    >
                      <option value="goods_purchase">মাল কেনা (Goods Purchase)</option>
                      <option value="rent">দোকান ভাড়া (Shop Rent)</option>
                      <option value="electricity">বিদ্যুৎ বিল (Electricity)</option>
                      <option value="salary">বেতন (Salary)</option>
                      <option value="transport">যাতায়াত / ভ্যান (Transport)</option>
                      <option value="other">অন্যান্য খরচ (Other)</option>
                    </select>
                  ) : (
                    <select
                      value={saleCategory}
                      onChange={(e) => setSaleCategory(e.target.value as SaleCategory)}
                      className="w-full px-4 py-3 rounded-2xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-emerald-600"
                    >
                      <option value="cash_sale">নগদ বিক্রি (Daily Cash Sale)</option>
                      <option value="grocery">মুদি মালামাল বিক্রি (Grocery Sale)</option>
                      <option value="tea_snack">চা ও নাস্তা বিক্রি (Tea & Snack)</option>
                      <option value="retail">সাধারণ রিটেইল বিক্রি (Retail)</option>
                      <option value="other">অন্যান্য বিক্রি (Other)</option>
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                    নোট (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    placeholder="অতিরিক্ত বিবরণ..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-emerald-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3.5 rounded-2xl text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer ${
                  formMode === 'expense'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    <span>
                      {formMode === 'expense' ? 'খরচ এন্ট্রি সেভ করুন' : 'বিক্রি / সেলস সেভ করুন'}
                    </span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: History List */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            {activeTab === 'expenses_list' ? (
              <>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Receipt className="w-5 h-5 text-rose-600" />
                      <span>খরচের খাতা (খরচ কত)</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      দোকানের মোট খরচ: <span className="font-bold text-rose-600">{formatTaka(totalExpenses)}</span>
                    </p>
                  </div>
                  <span className="text-xs px-3 py-1 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 rounded-xl font-bold">
                    মোট: {displayedExpenses.length} টি
                  </span>
                </div>

                {displayedExpenses.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <Receipt className="w-12 h-12 text-slate-300 mx-auto" />
                    <p className="text-xs text-slate-500">
                      কোনো খরচের হিসাব নেই। নতুন খরচ যোগ করতে বামপাশের ফর্ম পূরণ করুন।
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {displayedExpenses.map((exp) => {
                      const badge = getExpenseCategoryBadge(exp.category);
                      const isDeleting = deletingExpenseId === exp.id;
                      return (
                        <div
                          key={exp.id}
                          className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-rose-500/40 transition"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-bold text-slate-900 dark:text-white">
                                {exp.title}
                              </span>
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${badge.color}`}>
                                {badge.label}
                              </span>
                            </div>
                            <div className="text-xs text-slate-500 flex items-center gap-3 flex-wrap">
                              <span>{new Date(exp.timestamp).toLocaleDateString('bn-BD')}</span>
                              {exp.note && <span>• {exp.note}</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-base font-black text-rose-600 dark:text-rose-400 whitespace-nowrap">
                              -{formatTaka(exp.amount)}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => handleDeleteExpense(exp.id, e)}
                              disabled={isDeleting}
                              className="p-2.5 min-w-[40px] min-h-[40px] flex items-center justify-center text-rose-600 hover:text-rose-700 active:text-rose-800 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 rounded-xl border border-rose-200/80 dark:border-rose-900/60 transition cursor-pointer shadow-2xs"
                              title="খরচ ডিলিট করুন"
                              aria-label="Delete Expense"
                            >
                              {isDeleting ? (
                                <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                              ) : (
                                <Trash2 className="w-4 h-4 text-rose-600" />
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-emerald-600" />
                      <span>বিক্রির খাতা (কত সেলস হলো)</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      রেকর্ডকৃত নগদ বিক্রি: <span className="font-bold text-emerald-600">{formatTaka(totalDirectSales)}</span>
                    </p>
                  </div>
                  <span className="text-xs px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-xl font-bold">
                    মোট: {displayedSales.length} টি
                  </span>
                </div>

                {displayedSales.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                    <p className="text-xs text-slate-500">
                      কোনো বিক্রির হিসাব নেই। দৈনিক নগদ বিক্রি যোগ করতে বামপাশের ফর্ম পূরণ করুন।
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {displayedSales.map((sl) => {
                      const badge = getSaleCategoryBadge(sl.category);
                      const isDeleting = deletingSaleId === sl.id;
                      return (
                        <div
                          key={sl.id}
                          className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500/40 transition"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-bold text-slate-900 dark:text-white">
                                {sl.title}
                              </span>
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${badge.color}`}>
                                {badge.label}
                              </span>
                            </div>
                            <div className="text-xs text-slate-500 flex items-center gap-3 flex-wrap">
                              <span>{new Date(sl.timestamp).toLocaleDateString('bn-BD')}</span>
                              {sl.note && <span>• {sl.note}</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-base font-black text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                              +{formatTaka(sl.amount)}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => handleDeleteSale(sl.id, e)}
                              disabled={isDeleting}
                              className="p-2.5 min-w-[40px] min-h-[40px] flex items-center justify-center text-rose-600 hover:text-rose-700 active:text-rose-800 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 rounded-xl border border-rose-200/80 dark:border-rose-900/60 transition cursor-pointer shadow-2xs"
                              title="বিক্রি ডিলিট করুন"
                              aria-label="Delete Sale"
                            >
                              {isDeleting ? (
                                <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                              ) : (
                                <Trash2 className="w-4 h-4 text-rose-600" />
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
