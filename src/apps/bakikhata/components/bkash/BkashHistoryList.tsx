import React, { useState } from 'react';
import { Search, Zap, Send, Smartphone, ArrowDownRight, ArrowUpRight, RefreshCw, Clock } from 'lucide-react';
import { BkashTransactionRecord, BkashOpType } from '../../types';
import { formatTaka } from '../../utils/bakiUtils';

interface BkashHistoryListProps {
  transactions: BkashTransactionRecord[];
}

export const BkashHistoryList: React.FC<BkashHistoryListProps> = ({ transactions }) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const filtered = transactions.filter((tx) => {
    if (filterType !== 'all' && tx.type !== filterType) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchPhone = tx.targetNumber?.toLowerCase().includes(q);
      const matchCust = tx.customerName?.toLowerCase().includes(q);
      const matchNote = tx.note?.toLowerCase().includes(q);
      if (!matchPhone && !matchCust && !matchNote) return false;
    }
    return true;
  });

  const getOpBadge = (type: BkashOpType) => {
    switch (type) {
      case 'send_money':
        return { label: 'Send Money', color: 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300', icon: Send };
      case 'cash_in':
        return { label: 'Cash In', color: 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300', icon: Smartphone };
      case 'cash_out':
        return { label: 'Cash Out', color: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300', icon: ArrowDownRight };
      case 'fund_load':
        return { label: 'Fund Refill', color: 'bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300', icon: ArrowUpRight };
      default:
        return { label: 'Adjusted', color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300', icon: RefreshCw };
    }
  };

  return (
    <div className="space-y-3">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by number or customer name..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 text-[11px] font-bold">
          {[
            { id: 'all', label: 'All Transactions' },
            { id: 'send_money', label: 'Send Money' },
            { id: 'cash_in', label: 'Cash In' },
            { id: 'cash_out', label: 'Cash Out' },
            { id: 'fund_load', label: 'Fund Refill' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-2.5 py-1.5 rounded-xl whitespace-nowrap transition ${
                filterType === tab.id
                  ? 'bg-pink-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-2">
        {filtered.length > 0 ? (
          filtered.map((tx) => {
            const badge = getOpBadge(tx.type);
            const Icon = badge.icon;
            const isFundInflow = tx.type === 'cash_out' || tx.type === 'fund_load';

            return (
              <div
                key={tx.id}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3 shadow-xs hover:border-pink-300 dark:hover:border-pink-800 transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${badge.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-black text-slate-900 dark:text-white">
                        {tx.targetNumber || tx.customerName || badge.label}
                      </span>
                      {tx.simOperator && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold">
                          {tx.simOperator}
                        </span>
                      )}
                      {tx.isDue && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-extrabold">
                          Due (Added to Ledger)
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      {tx.customerName && <span>Customer: {tx.customerName} • </span>}
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {new Date(tx.timestamp).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {tx.note && <span>• {tx.note}</span>}
                    </div>
                  </div>
                </div>

                {/* Amount & Fund Impact */}
                <div className="text-right shrink-0">
                  <div
                    className={`text-sm font-black ${
                      isFundInflow
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {isFundInflow ? `+ ${formatTaka(tx.amount)}` : `- ${formatTaka(tx.amount)}`}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Fund: {formatTaka(tx.balanceAfter)}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-400">No Bkash transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
};
