import React, { useState } from 'react';
import { RechargeTransaction, Customer, RechargeOperator } from '../../types';
import { RechargeModal } from './RechargeModal';
import { RechargeHistoryList } from './RechargeHistoryList';
import { formatTaka } from '../../utils/bakiUtils';
import { Zap, TrendingUp, Smartphone, Award } from 'lucide-react';

interface RechargeSectionViewProps {
  transactions: RechargeTransaction[];
  customers: Customer[];
  onExecuteRecharge: (payload: any) => Promise<any>;
}

export const RechargeSectionView: React.FC<RechargeSectionViewProps> = ({
  transactions,
  customers,
  onExecuteRecharge,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const totalRechargeAmount = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalProfit = transactions.reduce((sum, t) => sum + (t.profitAmount || 0), 0);
  const totalCount = transactions.length;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-600 to-amber-700 text-white shadow-lg shadow-amber-600/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-100 uppercase tracking-wider">
              Total Recharge Volume
            </span>
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-amber-200" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl font-black">{formatTaka(totalRechargeAmount)}</h2>
            <p className="text-xs text-amber-100 mt-1">{totalCount} successful recharges</p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-600/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-100 uppercase tracking-wider">
              Total Commission Profit
            </span>
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-200" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl font-black">{formatTaka(totalProfit)}</h2>
            <p className="text-xs text-emerald-100 mt-1">Automated commission calculation</p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Operator Support
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-[10px]">GP (3.2%)</span>
            <span className="px-2 py-1 rounded-lg bg-orange-100 text-orange-800 font-bold text-[10px]">BL (3.5%)</span>
            <span className="px-2 py-1 rounded-lg bg-red-100 text-red-800 font-bold text-[10px]">Robi (3.4%)</span>
            <span className="px-2 py-1 rounded-lg bg-blue-100 text-blue-800 font-bold text-[10px]">Teletalk (4.0%)</span>
          </div>
        </div>
      </div>

      {/* History and Actions */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Mobile Recharge History & Profit
            </h3>
            <p className="text-xs text-slate-500">Recharge records and profit margins across all operators</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs shadow-md shadow-amber-600/30 flex items-center gap-1.5"
          >
            <Zap className="w-4 h-4" />
            <span>+ New Recharge</span>
          </button>
        </div>

        <RechargeHistoryList transactions={transactions} />
      </div>

      <RechargeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        customers={customers}
        onExecuteRecharge={onExecuteRecharge}
      />
    </div>
  );
};
