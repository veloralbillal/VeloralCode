import React, { useState } from 'react';
import { Plus, Trash2, TrendingUp, TrendingDown, Wallet, DollarSign, Receipt, AlertCircle, Calculator, Loader2 } from 'lucide-react';
import { ShopExpense, ExpenseCategory, Customer, RechargeTransaction } from '../types';
import { formatTaka } from '../utils/bakiUtils';

interface IncomeExpenseSectionViewProps {
  expenses: ShopExpense[];
  customers: Customer[];
  rechargeTransactions: RechargeTransaction[];
  bkashFundBalance: number;
  totalRechargeProfit: number;
  onAddExpense: (expense: Omit<ShopExpense, 'id' | 'timestamp'>) => Promise<void>;
  onDeleteExpense: (id: string) => Promise<void>;
}

export const IncomeExpenseSectionView: React.FC<IncomeExpenseSectionViewProps> = ({
  expenses,
  customers,
  rechargeTransactions,
  bkashFundBalance,
  totalRechargeProfit,
  onAddExpense,
  onDeleteExpense,
}) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('goods_purchase');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'expenses_list'>('summary');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [optimisticDeletedIds, setOptimisticDeletedIds] = useState<Set<string>>(new Set());

  // Filter out any optimistically deleted expenses
  const displayedExpenses = expenses.filter((e) => !optimisticDeletedIds.has(e.id));

  // Calculate total income and collections
  const totalPaidCollection = customers.reduce((sum, c) => sum + (Number(c.totalPaid) || 0), 0);
  const totalDueAmount = customers.reduce((sum, c) => sum + (Number(c.totalDue) || 0), 0);

  // Total Income = Total Paid Collections + Recharge Profits
  const totalEstimatedIncome = totalPaidCollection + totalRechargeProfit;

  // Total Expenses (using displayed expenses)
  const totalExpenses = displayedExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  // Net Profit / Net Balance = Total Income - Total Expenses
  const netIncome = totalEstimatedIncome - totalExpenses;

  const handleDeleteExpense = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (deletingId) return;

    setDeletingId(id);
    setOptimisticDeletedIds((prev) => new Set([...prev, id]));

    try {
      await onDeleteExpense(id);
    } catch (err) {
      // Revert if failed
      setOptimisticDeletedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmt = Number(amount);
    if (!title.trim() || isNaN(numAmt) || numAmt <= 0) return;

    setIsSubmitting(true);
    try {
      await onAddExpense({
        title: title.trim(),
        amount: numAmt,
        category,
        note: note.trim() || undefined,
      });
      setTitle('');
      setAmount('');
      setNote('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryBadge = (cat: ExpenseCategory) => {
    switch (cat) {
      case 'rent':
        return { label: 'দোকান ভাড়া', color: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300' };
      case 'electricity':
        return { label: 'বিদ্যুৎ বিল', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' };
      case 'goods_purchase':
        return { label: 'মাল কেনা', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' };
      case 'salary':
        return { label: 'বেতন', color: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300' };
      case 'transport':
        return { label: 'যাতায়াত/ভ্যান', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300' };
      default:
        return { label: 'অন্যান্য', color: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300' };
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-white/15 rounded-2xl backdrop-blur-md shadow-inner">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black">আয় ও খরচ হিসাব (Income & Expenses)</h1>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1">দোকানের মোট লাভ, ক্যাশ কালেকশন ও খরচের পূর্ণাঙ্গ খাতা</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-black/20 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10">
          <Calculator className="w-5 h-5 text-emerald-300" />
          <div className="text-left">
            <div className="text-[10px] text-emerald-200 uppercase font-bold">নিট ক্যাশ ব্যালেন্স</div>
            <div className="text-base font-black text-white">{formatTaka(netIncome)}</div>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 px-2 bg-white dark:bg-slate-900 rounded-2xl shadow-xs">
        <button
          onClick={() => setActiveTab('summary')}
          className={`py-3.5 px-6 font-bold text-sm border-b-2 transition flex items-center gap-2 ${
            activeTab === 'summary'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>আয় ও লাভ সারসংক্ষেপ</span>
        </button>
        <button
          onClick={() => setActiveTab('expenses_list')}
          className={`py-3.5 px-6 font-bold text-sm border-b-2 transition flex items-center gap-2 ${
            activeTab === 'expenses_list'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>খরচের খাতা ({expenses.length})</span>
        </button>
      </div>

      {activeTab === 'summary' ? (
        <div className="space-y-6">
          {/* Summary Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Total Income */}
            <div className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400">
                <span className="text-xs font-bold uppercase tracking-wider">মোট আয় ও কালেকশন</span>
                <div className="p-2.5 bg-emerald-200/60 dark:bg-emerald-900/60 rounded-2xl">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-emerald-900 dark:text-emerald-100">
                {formatTaka(totalEstimatedIncome)}
              </div>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                কাস্টমার পরিশোধ: {formatTaka(totalPaidCollection)} + রিচার্জ প্রফিট: {formatTaka(totalRechargeProfit)}
              </p>
            </div>

            {/* Total Expenses */}
            <div className="p-6 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-rose-700 dark:text-rose-400">
                <span className="text-xs font-bold uppercase tracking-wider">মোট খরচ (Total Expense)</span>
                <div className="p-2.5 bg-rose-200/60 dark:bg-rose-900/60 rounded-2xl">
                  <TrendingDown className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-rose-900 dark:text-rose-100">
                {formatTaka(totalExpenses)}
              </div>
              <p className="text-xs text-rose-700 dark:text-rose-300">
                {expenses.length} টি খরচের এন্ট্রি রেকর্ড করা হয়েছে
              </p>
            </div>

            {/* Net Profit / Net Balance */}
            <div className={`p-6 rounded-3xl border shadow-xs space-y-3 ${
              netIncome >= 0 
                ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/60 text-blue-900 dark:text-blue-100' 
                : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-100'
            }`}>
              <div className="flex items-center justify-between opacity-80">
                <span className="text-xs font-bold uppercase tracking-wider">নিট লাভ / ব্যালেন্স</span>
                <div className="p-2.5 bg-white/20 dark:bg-black/20 rounded-2xl">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black">
                {formatTaka(netIncome)}
              </div>
              <p className="text-xs opacity-80">
                {netIncome >= 0 ? 'আয় থেকে খরচ বাদ দিয়ে নিট লাভ' : 'খরচ আয়ের চেয়ে বেশি'}
              </p>
            </div>
          </div>

          {/* Breakdown Details Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-emerald-600" />
              <span>দোকানের আর্থিক বিবরণী (Financial Breakdown)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div className="text-xs text-slate-500">কাস্টমারদের মোট বাকি (Due)</div>
                <div className="text-xl font-black text-rose-600 mt-1">{formatTaka(totalDueAmount)}</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div className="text-xs text-slate-500">কাস্টমারদের মোট পরিশোধ (Paid)</div>
                <div className="text-xl font-black text-emerald-600 mt-1">{formatTaka(totalPaidCollection)}</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div className="text-xs text-slate-500">মোবাইল রিচার্জ প্রফিট</div>
                <div className="text-xl font-black text-amber-600 mt-1">{formatTaka(totalRechargeProfit)}</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div className="text-xs text-slate-500">বিকাশ/নগদ ফান্ড ব্যালেন্স</div>
                <div className="text-xl font-black text-sky-600 mt-1">{formatTaka(bkashFundBalance)}</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Expense Form (Left Column) */}
          <div className="lg:col-span-1">
            <form onSubmit={handleExpenseSubmit} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 sticky top-6">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                <span>নতুন খরচ যোগ করুন</span>
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">খরচের বিবরণ / খাত</label>
                  <input
                    type="text"
                    placeholder="যেমন: বিদ্যুৎ বিল, দোকান ভাড়া..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-emerald-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">পরিমাণ (টাকা)</label>
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
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">ক্যাটাগরি</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                    className="w-full px-4 py-3 rounded-2xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-emerald-600"
                  >
                    <option value="goods_purchase">মাল কেনা (Goods Purchase)</option>
                    <option value="rent">দোকান ভাড়া (Shop Rent)</option>
                    <option value="electricity">বিদ্যুৎ বিল (Electricity)</option>
                    <option value="salary">বেতন (Salary)</option>
                    <option value="transport">যাতায়াত / ভ্যান (Transport)</option>
                    <option value="other">অন্যান্য (Other)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">নোট (ঐচ্ছিক)</label>
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
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span>খরচ এন্ট্রি সেভ করুন</span>
              </button>
            </form>
          </div>

          {/* Expenses History List (Right Column) */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span>পূর্বের খরচের তালিকা</span>
              <span className="text-xs px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold">
                মোট: {displayedExpenses.length} টি
              </span>
            </h3>

            {displayedExpenses.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <Receipt className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-500">কোনো খরচের হিসাব নেই। নতুন খরচ যোগ করতে বামপাশের ফর্ম পূরণ করুন।</p>
              </div>
            ) : (
              <div className="space-y-3">
                {displayedExpenses.map((exp) => {
                  const badge = getCategoryBadge(exp.category);
                  const isDeleting = deletingId === exp.id;
                  return (
                    <div
                      key={exp.id}
                      className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500/40 transition"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">{exp.title}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${badge.color}`}>
                            {badge.label}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-3">
                          <span>{new Date(exp.timestamp).toLocaleDateString()}</span>
                          {exp.note && <span>• {exp.note}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
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
          </div>
        </div>
      )}
    </div>
  );
};
