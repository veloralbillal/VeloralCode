import React from 'react';
import { X, Calendar, Phone, Clock, PlusCircle, CheckCircle, Coffee, ShoppingBag, Smartphone, FileText, Share2, Printer } from 'lucide-react';
import { Customer, BakiTransaction } from '../types';
import { formatTaka, formatDateTime } from '../utils/bakiUtils';

interface CustomerDetailModalProps {
  isOpen: boolean;
  customer: Customer | null;
  transactions: BakiTransaction[];
  onClose: () => void;
  onOpenAddDue: (customer: Customer) => void;
  onOpenPayment: (customer: Customer) => void;
}

export const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  isOpen,
  customer,
  transactions,
  onClose,
  onOpenAddDue,
  onOpenPayment,
}) => {
  if (!isOpen || !customer) return null;

  const custTransactions = transactions.filter((t) => t.customerId === customer.id);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cha_pan':
        return <Coffee className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
      case 'mudi':
        return <ShoppingBag className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
      case 'bkash':
        return <Smartphone className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white font-black flex items-center justify-center shadow-md shadow-emerald-600/20 text-base">
              {customer.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {customer.name}
                </h3>
                {customer.settlesOnTuesday && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                    মঙ্গলবার পেমেন্ট
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                {customer.phone || 'নম্বর নেই'} {customer.address ? `• ${customer.address}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrint}
              title="খাতা প্রিন্ট করুন"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Balance Bar */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-[11px] text-slate-500 block font-bold">মোট বর্তমান বাকি</span>
              <span className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400">
                {formatTaka(customer.totalDue)}
              </span>
            </div>
            <div className="border-l border-slate-200 dark:border-slate-700 pl-6">
              <span className="text-[11px] text-slate-500 block font-bold">মোট পরিশোধিত টাকা</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {formatTaka(customer.totalPaid)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenAddDue(customer)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition border border-rose-200/60 dark:border-rose-800"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>বাকি লিখুন</span>
            </button>
            <button
              onClick={() => onOpenPayment(customer)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition border border-emerald-200/60 dark:border-emerald-800"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>টাকা জমা</span>
            </button>
          </div>
        </div>

        {/* Transactions List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              লেনদেনের খতিয়ান ও টাইমস্ট্যাম্প হিস্ট্রি ({custTransactions.length})
            </h4>
          </div>

          {custTransactions.length > 0 ? (
            <div className="space-y-2.5">
              {custTransactions.map((tx) => {
                const isDue = tx.type === 'due';
                return (
                  <div
                    key={tx.id}
                    className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-start justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                          isDue
                            ? 'bg-rose-50 dark:bg-rose-950/60'
                            : 'bg-emerald-50 dark:bg-emerald-950/60'
                        }`}
                      >
                        {isDue ? getCategoryIcon(tx.category) : <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900 dark:text-white">
                            {tx.itemsSummary}
                          </span>
                          {tx.isTuesdaySettlement && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-extrabold">
                              মঙ্গলবার জমা
                            </span>
                          )}
                        </div>

                        {tx.mfsNumber && (
                          <p className="text-[11px] text-slate-500">
                            নম্বর: <span className="font-mono text-pink-600 dark:text-pink-400">{tx.mfsNumber}</span>
                          </p>
                        )}

                        {tx.note && (
                          <p className="text-[11px] text-slate-400 italic">
                            নোট: {tx.note}
                          </p>
                        )}

                        <div className="flex items-center gap-1 text-[10px] text-slate-400 pt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>{formatDateTime(tx.timestamp)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`text-sm font-black ${
                          isDue
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {isDue ? `+ ${formatTaka(tx.amount)}` : `- ${formatTaka(tx.amount)}`}
                      </span>
                      <span className="block text-[10px] text-slate-400 font-medium">
                        {isDue ? 'বাকি' : 'জমা'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400 text-xs">
              এখনও কোনো লেনদেনের রেকর্ড নেই
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
