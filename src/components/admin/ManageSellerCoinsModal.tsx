import React, { useState } from 'react';
import { X, Coins, Plus, Minus, FileText } from 'lucide-react';
import { UserProfile } from '../../types';
import { adjustSellerCoins } from '../../services/sellerService';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

interface ManageSellerCoinsModalProps {
  seller: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ManageSellerCoinsModal: React.FC<ManageSellerCoinsModalProps> = ({
  seller,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { showToast } = useToast();
  const { currentUser } = useAuth();

  const [type, setType] = useState<'credit' | 'debit'>('credit');
  const [amount, setAmount] = useState<number>(50);
  const [reason, setReason] = useState<string>('Recharge by admin');
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen || !seller) return null;

  const currentBalance = seller.coinsBalance || 0;
  const simulatedBalance =
    type === 'credit' ? currentBalance + (amount || 0) : Math.max(0, currentBalance - (amount || 0));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      showToast('Please enter a valid coin amount', 'error');
      return;
    }

    if (type === 'debit' && amount > currentBalance) {
      showToast(`Cannot deduct ${amount} coins. Seller only has ${currentBalance} coins.`, 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await adjustSellerCoins({
        sellerUid: seller.userId,
        sellerEmail: seller.email,
        type,
        amount: Number(amount),
        reason,
        adminEmail: currentUser?.email || 'Admin',
      });

      showToast(
        `Successfully ${type === 'credit' ? 'added' : 'deducted'} ${amount} points! New balance: ${res.newBalance} pts.`,
        'success'
      );
      onSuccess();
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Failed to update coins', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Manage Seller Points/Coins
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Add recharge or deduct points for <span className="font-bold text-indigo-500">{seller.name}</span>
            </p>
          </div>
        </div>

        {/* Current Balance Card */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
              Current Points Balance
            </p>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400">
              {currentBalance} <span className="text-xs font-normal">Coins</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-500">After Transaction</p>
            <p className="text-base font-bold text-slate-800 dark:text-slate-200">
              {simulatedBalance} Coins
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Action Type Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setType('credit')}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition ${
                type === 'credit'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Credit (Add Points)</span>
            </button>
            <button
              type="button"
              onClick={() => setType('debit')}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition ${
                type === 'debit'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Minus className="w-4 h-4" />
              <span>Debit (Deduct)</span>
            </button>
          </div>

          {/* Amount */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Points / Coins Amount
            </label>
            <div className="relative">
              <Coins className="w-4 h-4 text-amber-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                min="1"
                required
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                placeholder="e.g. 100"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-bold text-slate-900 dark:text-slate-100"
              />
            </div>
            {/* Quick amount chips */}
            <div className="flex items-center gap-1.5 pt-1">
              {[25, 50, 100, 250, 500].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val)}
                  className="px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:text-amber-600 transition"
                >
                  +{val}
                </button>
              ))}
            </div>
          </div>

          {/* Reason / Note */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Audit Reason / Transaction Note
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. bKash payment received #9832"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-white text-xs font-bold shadow-md transition disabled:opacity-50 ${
                type === 'credit'
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
                  : 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/30'
              }`}
            >
              <Coins className="w-4 h-4" />
              <span>{loading ? 'Processing...' : type === 'credit' ? 'Credit Points' : 'Deduct Points'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
