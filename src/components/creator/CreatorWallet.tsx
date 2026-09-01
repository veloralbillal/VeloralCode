import React, { useState, useEffect } from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  DollarSign,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Heart,
  Coins,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { CreatorTransaction } from '../../types';
import {
  fetchCreatorTransactions,
  requestCreatorWithdrawal,
} from '../../services/creatorService';
import { formatDate } from '../../utils/helpers';
import { formatBDT, formatUSD, formatDualCurrency, usdToBdt, bdtToUsd, USD_TO_BDT_RATE } from '../../utils/currency';

export const CreatorWallet: React.FC = () => {
  const { currentUser, userProfile, refreshUserProfile } = useAuth();
  const { showToast } = useToast();

  const [transactions, setTransactions] = useState<CreatorTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Withdrawal form modal state
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawalMethod, setWithdrawalMethod] = useState('bKash (Personal)');
  const [accountNumber, setAccountNumber] = useState('');
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const balance = Number(userProfile?.creatorBalance || 0);
  const totalEarnings = Number(userProfile?.creatorEarnings || 0);
  const balanceBDT = usdToBdt(balance);
  const totalEarningsBDT = usdToBdt(totalEarnings);

  const loadData = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const txs = await fetchCreatorTransactions(currentUser.uid);
      setTransactions(txs);
    } catch (err: any) {
      showToast('Error loading wallet transactions: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(withdrawAmount);

    if (isNaN(amt) || amt <= 0) {
      showToast('Please enter a valid withdrawal amount.', 'warning');
      return;
    }

    if (amt > balance) {
      showToast(`Insufficient balance. You have ${formatDualCurrency(balance)} available.`, 'error');
      return;
    }

    if (!accountNumber.trim()) {
      showToast('Please provide your payout account details or phone number.', 'warning');
      return;
    }

    if (!currentUser) return;

    setWithdrawLoading(true);
    try {
      await requestCreatorWithdrawal(
        currentUser.uid,
        currentUser.email || '',
        amt,
        `${withdrawalMethod}: ${accountNumber.trim()} (BDT: ${formatBDT(usdToBdt(amt))})`
      );

      showToast('Withdrawal request submitted! Administrator will process your payout.', 'success');
      setWithdrawAmount('');
      setAccountNumber('');
      setShowWithdrawModal(false);
      await refreshUserProfile();
      await loadData();
    } catch (err: any) {
      showToast('Failed to request withdrawal: ' + err.message, 'error');
    } finally {
      setWithdrawLoading(false);
    }
  };

  // Calculate tip stats from transactions
  const tipTransactions = transactions.filter((t) => t.type === 'tip' || t.description?.toLowerCase().includes('tip'));
  const totalTipsReceivedUSD = tipTransactions.reduce((acc, t) => acc + (t.amount || 0), 0);
  const totalTipsReceivedBDT = usdToBdt(totalTipsReceivedUSD);

  return (
    <div className="space-y-6">
      {/* Wallet Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Available Balance */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-100">
                Available Wallet Balance
              </span>
              <div className="p-2 rounded-xl bg-white/15 backdrop-blur-md">
                <Wallet className="w-5 h-5 text-white" />
              </div>
            </div>

            <div className="my-4">
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight flex items-baseline gap-2">
                <span>{formatBDT(balanceBDT)}</span>
                <span className="text-sm font-normal text-emerald-200">({formatUSD(balance)})</span>
              </div>
              <p className="text-xs text-emerald-100 mt-1">Available for bKash, Nagad & USDT payout</p>
            </div>

            <button
              onClick={() => setShowWithdrawModal(true)}
              className="w-full py-2.5 rounded-xl bg-white text-emerald-800 font-bold text-xs shadow-md hover:bg-emerald-50 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" /> Request Payout (টাকা উত্তোলন)
            </button>
          </div>
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
        </div>

        {/* Lifetime Earnings */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Lifetime Earned
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div className="my-4">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex items-baseline gap-2">
              <span>{formatBDT(totalEarningsBDT)}</span>
              <span className="text-xs font-normal text-slate-400">({formatUSD(totalEarnings)})</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">From tool uploads, tips & user runs</p>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-rose-600 dark:text-rose-400 font-medium flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 fill-rose-500" /> Tips Received:
            </span>
            <span className="font-bold">{formatBDT(totalTipsReceivedBDT)} ({tipTransactions.length} tips)</span>
          </div>
        </div>

        {/* Payout Information */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Payout & Rates
            </span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <Coins className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 my-3">
            <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span>Exchange Rate:</span>
              <span className="font-bold text-amber-500">1 USD = {USD_TO_BDT_RATE} BDT (টাকা)</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span>Supported:</span>
              <span className="font-semibold text-slate-900 dark:text-white">bKash, Nagad, Rocket, USDT</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span>Min. Withdrawal:</span>
              <span className="font-semibold text-emerald-600">৳120 ($1.00)</span>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Fast payout processing within 24 hours.
          </div>
        </div>
      </div>

      {/* Transaction History Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Wallet Transaction History</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Detailed ledger of tool tips received, upload rewards, and withdrawal requests.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">Loading ledger records...</div>
        ) : transactions.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No transactions yet</p>
            <p className="text-xs text-slate-400">
              Upload tools and receive tips to start earning wallet rewards!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Amount (BDT / USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {transactions.map((tx) => {
                  const isPositive = tx.amount > 0;
                  const isTip = tx.type === 'tip' || tx.description?.toLowerCase().includes('tip');
                  const txBdt = tx.amountBDT || usdToBdt(Math.abs(tx.amount));

                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {formatDate(tx.createdAt)}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isTip
                              ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                              : isPositive
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                              : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                          }`}
                        >
                          {isTip ? (
                            <Heart className="w-3 h-3 fill-current" />
                          ) : isPositive ? (
                            <ArrowUpRight className="w-3 h-3" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3" />
                          )}
                          {isTip ? 'TIP RECEIVED' : tx.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-800 dark:text-slate-200 font-medium">
                        {tx.description}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                            tx.status === 'completed'
                              ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                              : tx.status === 'pending'
                              ? 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {tx.status === 'completed' && <CheckCircle2 className="w-3 h-3" />}
                          {tx.status === 'pending' && <Clock className="w-3 h-3" />}
                          {tx.status}
                        </span>
                      </td>
                      <td
                        className={`py-3.5 px-4 text-right font-bold whitespace-nowrap ${
                          isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        <div className="flex flex-col items-end">
                          <span>{isPositive ? `+${formatBDT(txBdt)}` : `-${formatBDT(txBdt)}`}</span>
                          <span className="text-[10px] opacity-75 font-normal">
                            ({isPositive ? `+$${tx.amount.toFixed(2)}` : `-$${Math.abs(tx.amount).toFixed(2)}`})
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Request Wallet Payout</h3>
                  <p className="text-xs text-slate-400">Available: {formatBDT(balanceBDT)} ({formatUSD(balance)})</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Withdrawal Amount ($ USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max={balance}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="e.g. 5.00"
                    required
                    className="w-full pl-8 pr-28 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  {parseFloat(withdrawAmount) > 0 && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                      ≈ {formatBDT(usdToBdt(parseFloat(withdrawAmount)))}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Payment Method (পেমেন্ট মেথড)
                </label>
                <select
                  value={withdrawalMethod}
                  onChange={(e) => setWithdrawalMethod(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="bKash (Personal)">bKash (Personal) - বিকাশ</option>
                  <option value="Nagad (Personal)">Nagad (Personal) - নগদ</option>
                  <option value="Rocket (Personal)">Rocket - রকেট</option>
                  <option value="USDT (TRC20 / Binance Pay)">USDT (TRC20 / Binance Pay)</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Account / Phone Number (একাউন্ট বা ফোন নম্বর)
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="e.g. 017XXXXXXXX or Wallet Address"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={withdrawLoading}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  {withdrawLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  Submit Payout Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

