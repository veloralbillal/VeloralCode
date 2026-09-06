import React, { useState } from 'react';
import { X, Plus, RefreshCw, Smartphone, Check } from 'lucide-react';
import { formatTaka } from '../../utils/bakiUtils';

interface BkashFundRefillModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
  initialMode?: 'add' | 'set';
  onSave: (amount: number, mode: 'add' | 'set', note?: string) => Promise<void>;
}

export const BkashFundRefillModal: React.FC<BkashFundRefillModalProps> = ({
  isOpen,
  onClose,
  currentBalance,
  initialMode = 'add',
  onSave,
}) => {
  const [mode, setMode] = useState<'add' | 'set'>(initialMode);
  const [amountStr, setAmountStr] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const numAmount = parseFloat(amountStr) || 0;
  const newBalancePreview = mode === 'set' ? numAmount : currentBalance + numAmount;

  const quickAmounts = mode === 'add' ? [2000, 5000, 10000, 20000, 50000] : [10000, 25000, 50000, 100000];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (numAmount <= 0 && mode === 'add') return;
    setSubmitting(true);
    try {
      await onSave(numAmount, mode, note.trim() || undefined);
      onClose();
      setAmountStr('');
      setNote('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {mode === 'add' ? 'বিকাশ ফান্ডে টাকা যোগ করুন' : 'ফান্ড ব্যালেন্স সমন্বয় করুন'}
              </h3>
              <p className="text-[11px] text-slate-500">বর্তমান ব্যালেন্স: {formatTaka(currentBalance)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-6 pt-4">
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            <button
              type="button"
              onClick={() => setMode('add')}
              className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                mode === 'add'
                  ? 'bg-white dark:bg-slate-700 text-pink-600 dark:text-pink-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ফান্ড লোড (+টাকা যোগ)</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('set')}
              className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                mode === 'set'
                  ? 'bg-white dark:bg-slate-700 text-pink-600 dark:text-pink-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>সরাসরি ব্যালেন্স সেট</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {mode === 'add' ? 'কত টাকা ফান্ডে লোড করবেন? (৳)' : 'নতুন মোট ফান্ড ব্যালেন্স কত? (৳)'}
            </label>
            <input
              type="number"
              min="1"
              required
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              placeholder="টাকার পরিমাণ লিখুন..."
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-lg font-black focus:ring-2 focus:ring-pink-500"
              autoFocus
            />
          </div>

          {/* Quick Amounts */}
          <div className="flex flex-wrap gap-2">
            {quickAmounts.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setAmountStr(amt.toString())}
                className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-pink-50 dark:hover:bg-pink-950/40 text-slate-700 dark:text-slate-300 hover:text-pink-600 dark:hover:text-pink-400 text-xs font-bold transition"
              >
                + ৳{amt.toLocaleString('bn-BD')}
              </button>
            ))}
          </div>

          {/* Preview impact */}
          <div className="p-3.5 rounded-2xl bg-pink-50 dark:bg-pink-950/30 border border-pink-100 dark:border-pink-900/40 flex items-center justify-between text-xs">
            <span className="text-pink-800 dark:text-pink-300 font-medium">নতুন ফান্ড ব্যালেন্স হবে:</span>
            <span className="text-base font-black text-pink-700 dark:text-pink-400">
              {formatTaka(newBalancePreview)}
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              উৎস বা নোট (ঐচ্ছিক)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="যেমন: ব্যাংক থেকে বা ডিস্ট্রিবিউটর ক্যাশ লোড..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || (mode === 'add' && numAmount <= 0)}
            className="w-full py-3 rounded-2xl bg-pink-600 hover:bg-pink-500 text-white font-black text-xs shadow-lg shadow-pink-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>{submitting ? 'সংরক্ষণ হচ্ছে...' : 'ফান্ড নিশ্চিত করুন'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
