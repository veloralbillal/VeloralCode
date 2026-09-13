import React, { useState, useMemo } from 'react';
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
  Package,
  Search,
  Filter,
  Sparkles,
  ChevronRight,
  Tag,
  Zap,
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

  // Filter and search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpenseCat, setSelectedExpenseCat] = useState<string>('all');
  const [selectedSaleCat, setSelectedSaleCat] = useState<string>('all');

  // Filter out optimistically deleted items
  const baseExpenses = useMemo(() => {
    return expenses.filter((e) => !optimisticDeletedExpenseIds.has(e.id));
  }, [expenses, optimisticDeletedExpenseIds]);

  const baseSales = useMemo(() => {
    return sales.filter((s) => !optimisticDeletedSaleIds.has(s.id));
  }, [sales, optimisticDeletedSaleIds]);

  const displayedExpenses = useMemo(() => {
    return baseExpenses.filter((e) => {
      const matchSearch =
        !searchQuery.trim() ||
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.note && e.note.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchCategory = selectedExpenseCat === 'all' || e.category === selectedExpenseCat;
      return matchSearch && matchCategory;
    });
  }, [baseExpenses, searchQuery, selectedExpenseCat]);

  const displayedSales = useMemo(() => {
    return baseSales.filter((s) => {
      const matchSearch =
        !searchQuery.trim() ||
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.note && s.note.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchCategory = selectedSaleCat === 'all' || s.category === selectedSaleCat;
      return matchSearch && matchCategory;
    });
  }, [baseSales, searchQuery, selectedSaleCat]);

  // Calculations
  const totalPaidCollection = customers.reduce((sum, c) => sum + (Number(c.totalPaid) || 0), 0);
  const totalDueAmount = customers.reduce((sum, c) => sum + (Number(c.totalDue) || 0), 0);

  // Sales calculations (কত সেলস হলো)
  const totalDirectSales = baseSales.reduce((sum, s) => sum + (Number(s.amount) || 0), 0);
  // Total Gross Sales = Recorded Direct Cash Sales + Customer Due Sales (বাকি বিক্রি)
  const totalGrossSales = totalDirectSales + totalDueAmount;

  // Expense calculations (খরচ কত)
  const totalExpenses = baseExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  // Cash In Hand = Direct Sales + Customer Paid Collections + Recharge Profits - Total Expenses
  const netCashBalance = (totalDirectSales + totalPaidCollection + totalRechargeProfit) - totalExpenses;

  // Net Business Profit = Gross Sales + Recharge Profits - Total Expenses
  const netProfit = (totalGrossSales + totalRechargeProfit) - totalExpenses;

  // Today's Stats
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const todayTimestamp = startOfToday.getTime();

  const todaySales = baseSales
    .filter((s) => s.timestamp >= todayTimestamp)
    .reduce((sum, s) => sum + (Number(s.amount) || 0), 0);

  const todayExpenses = baseExpenses
    .filter((e) => e.timestamp >= todayTimestamp)
    .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  // আজকের মাল কেনা (Goods/Stock Purchase)
  const todayPurchases = baseExpenses
    .filter((e) => e.timestamp >= todayTimestamp && e.category === 'goods_purchase')
    .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  // আজকের অন্যান্য সাধারণ খরচ (Other Expenses excluding goods purchase)
  const todayOtherExpenses = baseExpenses
    .filter((e) => e.timestamp >= todayTimestamp && e.category !== 'goods_purchase')
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
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border border-emerald-500/20">
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3.5 sm:p-4 bg-emerald-500/20 rounded-2xl backdrop-blur-md shadow-inner border border-emerald-400/30 shrink-0">
            <Store className="w-8 h-8 sm:w-9 sm:h-9 text-emerald-300" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold mb-1 border border-emerald-400/20">
              <Sparkles className="w-3 h-3" />
              <span>স্মার্ট ফিন্যান্সিয়াল হিসাব</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">আয় ও খরচ হিসাব (Income & Expenses)</h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-0.5">
              দোকানে কত খরচ হলো, কত সেলস হলো এবং মোট নিট লাভের রিয়েল-টাইম হিসাব
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5 w-full lg:w-auto relative z-10">
          {/* Today's Sales (আজকের বিক্রি) */}
          <div className="bg-slate-900/60 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-emerald-500/30">
            <div className="text-[11px] text-emerald-300 uppercase font-bold flex items-center gap-1">
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
              <span>আজকের বিক্রি</span>
            </div>
            <div className="text-base sm:text-lg font-black text-white">{formatTaka(todaySales)}</div>
          </div>

          {/* Today's Goods Purchase (আজকের মাল কেনা) */}
          <div className="bg-slate-900/60 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-amber-500/30">
            <div className="text-[11px] text-amber-300 uppercase font-bold flex items-center gap-1">
              <Package className="w-3.5 h-3.5 text-amber-400" />
              <span>আজকের মাল কেনা</span>
            </div>
            <div className="text-base sm:text-lg font-black text-amber-300">{formatTaka(todayPurchases)}</div>
          </div>

          {/* Today's Total Expenses (আজকের মোট খরচ) */}
          <div className="bg-slate-900/60 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-rose-500/30">
            <div className="text-[11px] text-rose-300 uppercase font-bold flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
              <span>আজকের খরচ</span>
            </div>
            <div className="text-base sm:text-lg font-black text-rose-300">{formatTaka(todayExpenses)}</div>
          </div>

          {/* Net Cash Balance */}
          <div className="bg-slate-900/60 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-cyan-500/30">
            <div className="text-[11px] text-cyan-300 uppercase font-bold flex items-center gap-1">
              <Calculator className="w-3.5 h-3.5 text-cyan-400" />
              <span>ক্যাশ ব্যালেন্স</span>
            </div>
            <div className="text-base sm:text-lg font-black text-white">{formatTaka(netCashBalance)}</div>
          </div>
        </div>
      </div>

      {/* Tabs Switcher: Summary, Expenses (খরচ কত), Sales (কত সেলস হলো) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab('summary')}
            className={`py-2.5 px-4 font-bold text-xs sm:text-sm rounded-xl transition flex items-center gap-2 shrink-0 ${
              activeTab === 'summary'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>আয় ও লাভ ড্যাশবোর্ড</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('expenses_list');
              setFormMode('expense');
            }}
            className={`py-2.5 px-4 font-bold text-xs sm:text-sm rounded-xl transition flex items-center gap-2 shrink-0 ${
              activeTab === 'expenses_list'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>খরচ কত (Expenses)</span>
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
              activeTab === 'expenses_list' ? 'bg-rose-700/80 text-white' : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
            }`}>
              {baseExpenses.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('sales_list');
              setFormMode('sale');
            }}
            className={`py-2.5 px-4 font-bold text-xs sm:text-sm rounded-xl transition flex items-center gap-2 shrink-0 ${
              activeTab === 'sales_list'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>কত সেলস হলো (Sales)</span>
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
              activeTab === 'sales_list' ? 'bg-emerald-700/80 text-white' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
            }`}>
              {baseSales.length}
            </span>
          </button>
        </div>

        {/* Action quick toggle */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            onClick={() => {
              setActiveTab('expenses_list');
              setFormMode('expense');
            }}
            className="px-3 py-1.5 text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 rounded-xl border border-rose-200/80 dark:border-rose-900/60 transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ নতুন খরচ</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('sales_list');
              setFormMode('sale');
            }}
            className="px-3 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-xl border border-emerald-200/80 dark:border-emerald-900/60 transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ নতুন বিক্রি</span>
          </button>
        </div>
      </div>

      {activeTab === 'summary' ? (
        <div className="space-y-6">
          {/* Summary Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Total Sales (কত সেলস হলো) */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-emerald-950/40 dark:to-teal-950/20 border border-emerald-200/90 dark:border-emerald-900/60 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400">
                <span className="text-xs font-bold uppercase tracking-wider">মোট সেলস (Total Sales)</span>
                <div className="p-2.5 bg-emerald-500/15 dark:bg-emerald-900/60 rounded-xl text-emerald-700 dark:text-emerald-300">
                  <ShoppingBag className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-emerald-950 dark:text-emerald-50">
                {formatTaka(totalGrossSales)}
              </div>
              <div className="text-[11px] text-emerald-800 dark:text-emerald-300/90 pt-1 border-t border-emerald-200/60 dark:border-emerald-900/40 space-y-0.5">
                <div className="flex justify-between">
                  <span>নগদ বিক্রি:</span>
                  <span className="font-bold">{formatTaka(totalDirectSales)}</span>
                </div>
                <div className="flex justify-between">
                  <span>বাকি বিক্রি:</span>
                  <span className="font-bold">{formatTaka(totalDueAmount)}</span>
                </div>
              </div>
            </div>

            {/* Card 2: Total Expenses (খরচ কত) */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-rose-50 to-orange-50/50 dark:from-rose-950/40 dark:to-orange-950/20 border border-rose-200/90 dark:border-rose-900/60 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between text-rose-700 dark:text-rose-400">
                <span className="text-xs font-bold uppercase tracking-wider">মোট খরচ (Total Expenses)</span>
                <div className="p-2.5 bg-rose-500/15 dark:bg-rose-900/60 rounded-xl text-rose-700 dark:text-rose-300">
                  <TrendingDown className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-rose-950 dark:text-rose-50">
                {formatTaka(totalExpenses)}
              </div>
              <div className="text-[11px] text-rose-800 dark:text-rose-300/90 pt-1 border-t border-rose-200/60 dark:border-rose-900/40 space-y-0.5">
                <div className="flex justify-between">
                  <span>রেকর্ডকৃত খরচ:</span>
                  <span className="font-bold">{baseExpenses.length} টি</span>
                </div>
                <div className="flex justify-between">
                  <span>আজকের খরচ:</span>
                  <span className="font-bold">{formatTaka(todayExpenses)}</span>
                </div>
              </div>
            </div>

            {/* Card 3: Net Profit (নিট লাভ) */}
            <div
              className={`p-5 rounded-3xl border shadow-xs space-y-2.5 ${
                netProfit >= 0
                  ? 'bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-blue-950/40 dark:to-indigo-950/20 border-blue-200/90 dark:border-blue-900/60 text-blue-950 dark:text-blue-50'
                  : 'bg-gradient-to-br from-amber-50 to-rose-50/50 dark:from-amber-950/40 dark:to-rose-950/20 border-amber-200/90 dark:border-amber-900/60 text-amber-950 dark:text-amber-50'
              }`}
            >
              <div className="flex items-center justify-between opacity-90">
                <span className="text-xs font-bold uppercase tracking-wider">দোকানের নিট লাভ (Profit)</span>
                <div className="p-2.5 bg-blue-500/15 dark:bg-blue-900/60 rounded-xl text-blue-700 dark:text-blue-300">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black">{formatTaka(netProfit)}</div>
              <div className="text-[11px] opacity-90 pt-1 border-t border-blue-200/60 dark:border-blue-900/40">
                {netProfit >= 0 ? 'বিক্রি + লাভ থেকে খরচ বাদ দিয়ে উদ্বৃত্ত' : 'সতর্কতা: খরচ বিক্রির চেয়ে বেশি'}
              </div>
            </div>

            {/* Card 4: Net Cash Balance */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-cyan-50 to-teal-50/50 dark:from-cyan-950/40 dark:to-teal-950/20 border border-cyan-200/90 dark:border-cyan-900/60 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between text-cyan-700 dark:text-cyan-400">
                <span className="text-xs font-bold uppercase tracking-wider">হাতে ক্যাশ ব্যালেন্স</span>
                <div className="p-2.5 bg-cyan-500/15 dark:bg-cyan-900/60 rounded-xl text-cyan-700 dark:text-cyan-300">
                  <Wallet className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-cyan-950 dark:text-cyan-50">
                {formatTaka(netCashBalance)}
              </div>
              <div className="text-[11px] text-cyan-800 dark:text-cyan-300/90 pt-1 border-t border-cyan-200/60 dark:border-cyan-900/40">
                নগদ বিক্রি + আদায় + রিচার্জ - খরচ
              </div>
            </div>
          </div>

          {/* Daily Highlights: আজকের আর্থিক খাতা (খরচ, মাল কেনা ও বিক্রি) */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-7 shadow-md space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white/10 rounded-xl">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold">আজকের হিসাব (Today's Financial Summary)</h3>
                  <p className="text-xs text-slate-400">আজকের দিনে কত খরচ হলো, কত টাকার মাল কেনা হলো ও কত বিক্রি হলো</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-3 py-1 bg-white/10 rounded-xl text-emerald-300">
                আজকের তারিখ: {new Date().toLocaleDateString('bn-BD')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
              {/* 1. আজকের বিক্রি */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition">
                <div className="flex items-center justify-between text-emerald-400 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider">আজকের বিক্রি</span>
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div className="text-2xl font-black text-emerald-300">{formatTaka(todaySales)}</div>
                <p className="text-[11px] text-slate-400 mt-1">আজকের দিনে মোট ক্যাশ বিক্রি</p>
              </div>

              {/* 2. আজকের মাল কেনা */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/50 transition">
                <div className="flex items-center justify-between text-amber-400 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider">দোকানের মাল কেনা</span>
                  <Package className="w-4 h-4" />
                </div>
                <div className="text-2xl font-black text-amber-300">{formatTaka(todayPurchases)}</div>
                <p className="text-[11px] text-slate-400 mt-1">আজকে নতুন মালামাল ক্রয়ের ব্যয়</p>
              </div>

              {/* 3. আজকের মোট খরচ */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-rose-500/50 transition">
                <div className="flex items-center justify-between text-rose-400 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider">আজকের মোট খরচ</span>
                  <TrendingDown className="w-4 h-4" />
                </div>
                <div className="text-2xl font-black text-rose-300">{formatTaka(todayExpenses)}</div>
                <p className="text-[11px] text-slate-400 mt-1">
                  মাল কেনা ({formatTaka(todayPurchases)}) + অন্যান্য খরচ ({formatTaka(todayOtherExpenses)})
                </p>
              </div>
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Input Form (5 cols on lg) */}
          <div className="lg:col-span-5">
            <form
              onSubmit={handleFormSubmit}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-5 sticky top-6"
            >
              {/* Toggle Form Mode: খরচ vs বিক্রি */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  হিসাবের ধরণ নির্বাচন করুন
                </label>
                <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
                  <button
                    type="button"
                    onClick={() => {
                      setFormMode('expense');
                      setActiveTab('expenses_list');
                    }}
                    className={`py-2.5 px-3 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 ${
                      formMode === 'expense'
                        ? 'bg-rose-600 text-white shadow-md ring-2 ring-rose-500/20'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Receipt className="w-4 h-4" />
                    <span>খরচ (Expense)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFormMode('sale');
                      setActiveTab('sales_list');
                    }}
                    className={`py-2.5 px-3 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 ${
                      formMode === 'sale'
                        ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-500/20'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>বিক্রি (Sales)</span>
                  </button>
                </div>
              </div>

              {/* Header inside form */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    formMode === 'expense'
                      ? 'bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400'
                      : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {formMode === 'expense' ? <Receipt className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {formMode === 'expense' ? 'নতুন খরচের এন্ট্রি' : 'নতুন বিক্রির এন্ট্রি'}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {formMode === 'expense' ? 'দোকানের খরচের বিবরণ ও পরিমাণ দিন' : 'নগদ বা পাইকারি বিক্রির হিসাব দিন'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Title / Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {formMode === 'expense' ? 'খরচের বিবরণ / খাত *' : 'বিক্রির বিবরণ / পণ্য *'}
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
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    required
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    পরিমাণ (টাকা) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">৳</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl text-sm font-bold bg-slate-50 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                      required
                    />
                  </div>
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    ক্যাটাগরি
                  </label>
                  {formMode === 'expense' ? (
                    <select
                      value={expenseCategory}
                      onChange={(e) => setExpenseCategory(e.target.value as ExpenseCategory)}
                      className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:border-transparent transition cursor-pointer"
                    >
                      <option value="goods_purchase">📦 মাল কেনা (Goods Purchase)</option>
                      <option value="rent">🏢 দোকান ভাড়া (Shop Rent)</option>
                      <option value="electricity">⚡ বিদ্যুৎ বিল (Electricity)</option>
                      <option value="salary">👥 বেতন (Salary)</option>
                      <option value="transport">🚚 যাতায়াত / ভ্যান (Transport)</option>
                      <option value="other">📑 অন্যান্য খরচ (Other)</option>
                    </select>
                  ) : (
                    <select
                      value={saleCategory}
                      onChange={(e) => setSaleCategory(e.target.value as SaleCategory)}
                      className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition cursor-pointer"
                    >
                      <option value="cash_sale">💵 নগদ বিক্রি (Daily Cash Sale)</option>
                      <option value="grocery">🛒 মুদি মালামাল বিক্রি (Grocery Sale)</option>
                      <option value="tea_snack">☕ চা ও নাস্তা বিক্রি (Tea & Snack)</option>
                      <option value="retail">🛍️ সাধারণ রিটেইল বিক্রি (Retail)</option>
                      <option value="other">✨ অন্যান্য বিক্রি (Other)</option>
                    </select>
                  )}
                </div>

                {/* Note */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    নোট (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    placeholder="অতিরিক্ত বিবরণ বা রেফারেন্স..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 rounded-2xl text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-98 ${
                  formMode === 'expense'
                    ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                }`}
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>
                      {formMode === 'expense' ? 'খরচ এন্ট্রি সেভ করুন' : 'বিক্রি / সেলস সেভ করুন'}
                    </span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: History List (7 cols on lg) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
            {activeTab === 'expenses_list' ? (
              <>
                {/* Header with quick stats */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Receipt className="w-5 h-5 text-rose-600" />
                      <span>খরচের খাতা (খরচ কত)</span>
                    </h3>
                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-3 flex-wrap">
                      <span>মোট: <strong className="text-rose-600 dark:text-rose-400">{formatTaka(totalExpenses)}</strong></span>
                      <span>•</span>
                      <span>আজকের খরচ: <strong className="text-rose-600 dark:text-rose-400">{formatTaka(todayExpenses)}</strong></span>
                      <span>•</span>
                      <span>আজকের মাল কেনা: <strong className="text-amber-600 dark:text-amber-400">{formatTaka(todayPurchases)}</strong></span>
                    </div>
                  </div>
                  <span className="self-start sm:self-center text-xs px-3 py-1 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 rounded-xl font-bold border border-rose-200/60 dark:border-rose-900/60">
                    ফিল্টারকৃত: {displayedExpenses.length} / মোট {baseExpenses.length}
                  </span>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="খরচ খুঁজুন (নাম বা নোট)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-rose-500"
                    />
                  </div>

                  <select
                    value={selectedExpenseCat}
                    onChange={(e) => setSelectedExpenseCat(e.target.value)}
                    className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-1 focus:ring-rose-500 cursor-pointer shrink-0"
                  >
                    <option value="all">সব ক্যাটাগরি</option>
                    <option value="goods_purchase">মাল কেনা</option>
                    <option value="rent">দোকান ভাড়া</option>
                    <option value="electricity">বিদ্যুৎ বিল</option>
                    <option value="salary">বেতন</option>
                    <option value="transport">যাতায়াত</option>
                    <option value="other">অন্যান্য</option>
                  </select>
                </div>

                {displayedExpenses.length === 0 ? (
                  <div className="text-center py-14 space-y-3 bg-slate-50/50 dark:bg-slate-800/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                    <Receipt className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {searchQuery || selectedExpenseCat !== 'all'
                        ? 'ফিল্টারের সাথে মিলে এমন কোনো খরচের রেকর্ড পাওয়া যায়নি।'
                        : 'কোনো খরচের হিসাব নেই। নতুন খরচ যোগ করতে বামপাশের ফর্ম পূরণ করুন।'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
                    {displayedExpenses.map((exp) => {
                      const badge = getExpenseCategoryBadge(exp.category);
                      const isDeleting = deletingExpenseId === exp.id;
                      return (
                        <div
                          key={exp.id}
                          className="flex items-center justify-between p-3.5 bg-slate-50/90 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 hover:border-rose-400/60 hover:bg-white dark:hover:bg-slate-800/80 transition group shadow-2xs"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-bold text-slate-900 dark:text-white">
                                {exp.title}
                              </span>
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${badge.color}`}>
                                {badge.label}
                              </span>
                            </div>
                            <div className="text-xs text-slate-500 flex items-center gap-2.5 flex-wrap">
                              <span>{new Date(exp.timestamp).toLocaleDateString('bn-BD')}</span>
                              {exp.note && <span>• {exp.note}</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-sm sm:text-base font-black text-rose-600 dark:text-rose-400 whitespace-nowrap">
                              -{formatTaka(exp.amount)}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => handleDeleteExpense(exp.id, e)}
                              disabled={isDeleting}
                              className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-slate-400 hover:text-rose-600 active:text-rose-700 bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/50 rounded-xl border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                              title="খরচ ডিলিট করুন"
                              aria-label="Delete Expense"
                            >
                              {isDeleting ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-600" />
                              ) : (
                                <Trash2 className="w-3.5 h-3.5" />
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
                {/* Sales List Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-emerald-600" />
                      <span>বিক্রির খাতা (কত সেলস হলো)</span>
                    </h3>
                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-3 flex-wrap">
                      <span>রেকর্ডকৃত নগদ বিক্রি: <strong className="text-emerald-600 dark:text-emerald-400">{formatTaka(totalDirectSales)}</strong></span>
                      <span>•</span>
                      <span>আজকের বিক্রি: <strong className="text-emerald-600 dark:text-emerald-400">{formatTaka(todaySales)}</strong></span>
                    </div>
                  </div>
                  <span className="self-start sm:self-center text-xs px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-xl font-bold border border-emerald-200/60 dark:border-emerald-900/60">
                    ফিল্টারকৃত: {displayedSales.length} / মোট {baseSales.length}
                  </span>
                </div>

                {/* Filter and Search Bar for Sales */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="বিক্রি খুঁজুন (নাম বা নোট)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <select
                    value={selectedSaleCat}
                    onChange={(e) => setSelectedSaleCat(e.target.value)}
                    className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 cursor-pointer shrink-0"
                  >
                    <option value="all">সব ক্যাটাগরি</option>
                    <option value="cash_sale">নগদ বিক্রি</option>
                    <option value="grocery">মুদি বিক্রি</option>
                    <option value="tea_snack">চা ও নাস্তা</option>
                    <option value="retail">সাধারণ রিটেইল</option>
                    <option value="other">অন্যান্য বিক্রি</option>
                  </select>
                </div>

                {displayedSales.length === 0 ? (
                  <div className="text-center py-14 space-y-3 bg-slate-50/50 dark:bg-slate-800/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                    <ShoppingBag className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {searchQuery || selectedSaleCat !== 'all'
                        ? 'ফিল্টারের সাথে মিলে এমন কোনো বিক্রির রেকর্ড পাওয়া যায়নি।'
                        : 'কোনো বিক্রির হিসাব নেই। দৈনিক নগদ বিক্রি যোগ করতে বামপাশের ফর্ম পূরণ করুন।'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
                    {displayedSales.map((sl) => {
                      const badge = getSaleCategoryBadge(sl.category);
                      const isDeleting = deletingSaleId === sl.id;
                      return (
                        <div
                          key={sl.id}
                          className="flex items-center justify-between p-3.5 bg-slate-50/90 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 hover:border-emerald-400/60 hover:bg-white dark:hover:bg-slate-800/80 transition group shadow-2xs"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-bold text-slate-900 dark:text-white">
                                {sl.title}
                              </span>
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${badge.color}`}>
                                {badge.label}
                              </span>
                            </div>
                            <div className="text-xs text-slate-500 flex items-center gap-2.5 flex-wrap">
                              <span>{new Date(sl.timestamp).toLocaleDateString('bn-BD')}</span>
                              {sl.note && <span>• {sl.note}</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                              +{formatTaka(sl.amount)}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => handleDeleteSale(sl.id, e)}
                              disabled={isDeleting}
                              className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-slate-400 hover:text-rose-600 active:text-rose-700 bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/50 rounded-xl border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                              title="বিক্রি ডিলিট করুন"
                              aria-label="Delete Sale"
                            >
                              {isDeleting ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-600" />
                              ) : (
                                <Trash2 className="w-3.5 h-3.5" />
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
