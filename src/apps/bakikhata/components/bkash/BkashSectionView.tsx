import React, { useState } from 'react';
import { BkashFund, BkashTransactionRecord, Customer, BkashOpType } from '../../types';
import { BkashFundOverviewCard } from './BkashFundOverviewCard';
import { BkashHistoryList } from './BkashHistoryList';
import { BkashActionModal } from './BkashActionModal';
import { BkashFundRefillModal } from './BkashFundRefillModal';

interface BkashSectionViewProps {
  fund: BkashFund;
  transactions: BkashTransactionRecord[];
  customers: Customer[];
  onExecuteOperation: (payload: any, customer?: Customer) => Promise<any>;
  onUpdateFund: (amount: number, mode: 'add' | 'set', note?: string) => Promise<any>;
}

export const BkashSectionView: React.FC<BkashSectionViewProps> = ({
  fund,
  transactions,
  customers,
  onExecuteOperation,
  onUpdateFund,
}) => {
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [refillModalOpen, setRefillModalOpen] = useState(false);
  const [actionType, setActionType] = useState<BkashOpType>('send_money');
  const [refillMode, setRefillMode] = useState<'add' | 'set'>('add');

  const handleOpenAction = (type: BkashOpType = 'send_money') => {
    setActionType(type);
    setActionModalOpen(true);
  };

  const handleOpenRefill = (mode: 'add' | 'set' = 'add') => {
    setRefillMode(mode);
    setRefillModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Fund Card */}
      <BkashFundOverviewCard
        fund={fund}
        onOpenActionModal={handleOpenAction}
        onOpenRefillModal={handleOpenRefill}
      />

      {/* History and ledger list */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              বিকাশ ও এমএফএস লেনদেনের খতিয়ান
            </h3>
            <p className="text-xs text-slate-500">
              ফান্ড ব্যালেন্সের পরিবর্তনের সাথে স্বয়ংক্রিয় হিসাব
            </p>
          </div>
          <button
            onClick={() => handleOpenAction('send_money')}
            className="px-3.5 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-extrabold text-xs shadow-xs"
          >
            + নতুন লেনদেন
          </button>
        </div>

        <BkashHistoryList transactions={transactions} />
      </div>

      {/* Modals */}
      <BkashActionModal
        isOpen={actionModalOpen}
        onClose={() => setActionModalOpen(false)}
        currentFundBalance={fund.currentBalance || 0}
        customers={customers}
        initialType={actionType}
        onExecute={async (payload) => {
          const cust = customers.find((c) => c.id === payload.customerId);
          await onExecuteOperation(payload, cust);
        }}
      />

      <BkashFundRefillModal
        isOpen={refillModalOpen}
        onClose={() => setRefillModalOpen(false)}
        currentBalance={fund.currentBalance || 0}
        initialMode={refillMode}
        onSave={async (amount, mode, note) => {
          await onUpdateFund(amount, mode, note);
        }}
      />
    </div>
  );
};
