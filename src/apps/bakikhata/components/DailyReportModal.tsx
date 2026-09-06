import React from 'react';
import { X, TrendingUp, TrendingDown, DollarSign, Calendar, Clock } from 'lucide-react';
import { BakiTransaction } from '../types';
import { formatTaka, formatDateTime } from '../utils/bakiUtils';

interface DailyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: BakiTransaction[];
}

export const DailyReportModal: React.FC<DailyReportModalProps> = ({
  isOpen,
  onClose,
  transactions,
}) => {
  if (!isOpen) return null;

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const todayTime = startOfToday.getTime();

  const todayTransactions = transactions.filter((t) => t.timestamp >= todayTime);

  const todayDue = todayTransactions
    .filter((t) => t.type === 'due')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const todayPaid = todayTransactions
    .filter((t) => t.type === 'payment')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                আজকের দিনের খতিয়ান ও রিপোর্ট
              </h3>
              <p className="text-[11px] text-slate-500">
                {new Date().toLocaleDateString('bn-BD', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Summary Stats Cards */}
        <div className="p-6 grid grid-cols-2 gap-3 shrink-0">
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60">
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-bold mb-1">
              <TrendingDown className="w-4 h-4" />
              <span>আজ নগদ জমা</span>
            </div>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              {formatTaka(todayPaid)}
            </div>
            <span className="text-[10px] text-emerald-700/70 dark:text-emerald-400/70">
              {todayTransactions.filter((t) => t.type === 'payment').length} টি জমা
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-800/60">
            <div className="flex items-center gap-1.5 text-xs text-rose-700 dark:text-rose-400 font-bold mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>আজ নতুন বাকি</span>
            </div>
            <div className="text-xl font-black text-rose-600 dark:text-rose-400">
              {formatTaka(todayDue)}
            </div>
            <span className="text-[10px] text-rose-700/70 dark:text-rose-400/70">
              {todayTransactions.filter((t) => t.type === 'due').length} টি বাকি
            </span>
          </div>
        </div>

        {/* Transaction list */}
        <div className="px-6 pb-6 overflow-y-auto flex-1 space-y-2.5">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
            আজকের লেনদেনের তালিকা ({todayTransactions.length})
          </h4>
          {todayTransactions.length > 0 ? (
            todayTransactions.map((tx) => (
              <div
                key={tx.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-xs text-slate-900 dark:text-white block">
                    {tx.customerName}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {tx.itemsSummary} {tx.isTuesdaySettlement ? '• মঙ্গলবার পেমেন্ট' : ''}
                  </span>
                </div>
                <div className="text-right">
                  <span
                    className={`text-xs font-extrabold block ${
                      tx.type === 'due' ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {tx.type === 'due' ? `+ ${formatTaka(tx.amount)}` : `- ${formatTaka(tx.amount)}`}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 justify-end">
                    <Clock className="w-3 h-3" />
                    {new Date(tx.timestamp).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-8 text-xs text-slate-400">
              আজকে এখনও কোনো লেনদেন রেকর্ড করা হয়নি
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
