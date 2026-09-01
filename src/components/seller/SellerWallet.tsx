import React, { useState, useEffect } from 'react';
import {
  Wallet,
  Coins,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  HelpCircle,
  Clock,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fetchSellerTransactions } from '../../services/sellerService';
import { SellerCoinTransaction } from '../../types';
import { formatDate } from '../../utils/helpers';

export const SellerWallet: React.FC = () => {
  const { userProfile, refreshUserProfile } = useAuth();
  const [transactions, setTransactions] = useState<SellerCoinTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userProfile?.userId) {
      loadTransactions();
    }
  }, [userProfile?.userId]);

  const loadTransactions = async () => {
    if (!userProfile?.userId) return;
    setLoading(true);
    try {
      const data = await fetchSellerTransactions(userProfile.userId);
      setTransactions(data);
      await refreshUserProfile();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const currentCoins = userProfile?.coinsBalance !== undefined ? userProfile.coinsBalance : 0;
  const totalEarned = userProfile?.totalCoinsEarned !== undefined ? userProfile.totalCoinsEarned : currentCoins;
  const totalSpent = userProfile?.totalCoinsSpent !== undefined ? userProfile.totalCoinsSpent : 0;

  return (
    <div className="space-y-6">
      {/* Wallet Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Available Balance */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-white shadow-lg shadow-amber-500/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-amber-100 tracking-wider">
              Available Point Balance
            </span>
            <Coins className="w-5 h-5 text-amber-200" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black">{currentCoins}</span>
            <span className="text-sm font-semibold text-amber-100">Points / Coins</span>
          </div>
          <p className="text-xs text-amber-100">Ready to use for generating license keys</p>
        </div>

        {/* Total Points Added */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-emerald-500">
            <span className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
              Total Points Credited
            </span>
            <ArrowDownRight className="w-5 h-5" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{totalEarned}</span>
            <span className="text-xs font-semibold text-slate-400">Total Coins</span>
          </div>
          <p className="text-xs text-slate-400">Lifetime wallet recharges by Admin</p>
        </div>

        {/* Total Points Spent */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-indigo-500">
            <span className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
              Total Points Burned
            </span>
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{totalSpent}</span>
            <span className="text-xs font-semibold text-slate-400">Coins Spent</span>
          </div>
          <p className="text-xs text-slate-400">Burned during license key generation</p>
        </div>
      </div>

      {/* How To Recharge Info Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row items-start gap-4">
        <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60 shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Need more points/coins to generate keys?
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Points are managed and credited directly by the System Administrator. To top up your reseller wallet balance, contact your account administrator with your UID{' '}
            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
              #{userProfile?.numericUid || userProfile?.userId?.substring(0, 8)}
            </span>
            . Once confirmed, points will be credited instantly to this wallet.
          </p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Points Transaction History</h3>
          </div>
          <button
            onClick={loadTransactions}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Balance After</th>
                <th className="py-3 px-4">Transaction Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-400">
                    <Clock className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="font-semibold">No point transactions yet</p>
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3 px-4 text-slate-400 text-[11px]">{formatDate(tx.createdAt)}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          tx.type === 'credit'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200'
                            : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200'
                        }`}
                      >
                        {tx.type === 'credit' ? (
                          <ArrowDownRight className="w-3 h-3" />
                        ) : (
                          <ArrowUpRight className="w-3 h-3" />
                        )}
                        {tx.type === 'credit' ? 'Recharge (Credited)' : 'Key Generation (Burned)'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-sm">
                      <span className={tx.type === 'credit' ? 'text-emerald-600' : 'text-rose-600'}>
                        {tx.type === 'credit' ? '+' : '-'}
                        {tx.amount} Pts
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                      {tx.balanceAfter} Pts
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 max-w-sm">{tx.description}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
