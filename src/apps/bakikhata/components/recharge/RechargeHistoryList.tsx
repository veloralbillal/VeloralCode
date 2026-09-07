import React from 'react';
import { RechargeTransaction } from '../../types';
import { formatTaka } from '../../utils/bakiUtils';
import { Zap, Smartphone } from 'lucide-react';

interface RechargeHistoryListProps {
  transactions: RechargeTransaction[];
}

export const RechargeHistoryList: React.FC<RechargeHistoryListProps> = ({ transactions }) => {
  if (transactions.length === 0) {
    return (
      <div className="py-12 text-center text-slate-400 text-xs">
        কোনো মোবাইল রিচার্জের তথ্য নেই। উপরে "+ নতুন রিচার্জ" বাটনে ক্লিক করুন।
      </div>
    );
  }

  const getOperatorBadge = (op: string) => {
    switch (op) {
      case 'gp':
        return <span className="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 font-black text-[10px]">GP</span>;
      case 'bl':
        return <span className="px-2 py-0.5 rounded-lg bg-orange-100 text-orange-800 font-black text-[10px]">BL</span>;
      case 'robi':
        return <span className="px-2 py-0.5 rounded-lg bg-red-100 text-red-800 font-black text-[10px]">ROBI</span>;
      case 'airtel':
        return <span className="px-2 py-0.5 rounded-lg bg-rose-100 text-rose-800 font-black text-[10px]">AIRTEL</span>;
      case 'teletalk':
        return <span className="px-2 py-0.5 rounded-lg bg-blue-100 text-blue-800 font-black text-[10px]">TELETALK</span>;
      default:
        return <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-800 font-black text-[10px]">{op}</span>;
    }
  };

  return (
    <div className="space-y-2.5">
      {transactions.map((tx) => (
        <div
          key={tx.id}
          className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between gap-3 transition hover:border-amber-500/40"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {getOperatorBadge(tx.operator)}
                <span className="text-xs font-black text-slate-900 dark:text-white font-mono">
                  {tx.mobileNumber}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 uppercase">
                  {tx.rechargeType}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                {tx.customerName ? `গ্রাহক: ${tx.customerName}` : tx.isDue ? 'বাকি খাতায় যুক্ত' : 'নগদ রিচার্জ'} {tx.note ? `• ${tx.note}` : ''}
              </p>
              <span className="text-[10px] text-slate-400">
                {new Date(tx.timestamp).toLocaleString('bn-BD', {
                  hour: 'numeric',
                  minute: '2-digit',
                  day: 'numeric',
                  month: 'short',
                })}
              </span>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="text-sm font-black text-slate-900 dark:text-white">
              {formatTaka(tx.amount)}
            </div>
            <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              লাভ +{formatTaka(tx.profitAmount)} ({tx.commissionRate}%)
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
