import React, { useState } from 'react';
import { X, CheckCircle, Calendar, Clock, DollarSign } from 'lucide-react';
import { Customer, PaymentMethod } from '../types';
import { formatTaka } from '../utils/bakiUtils';

interface CollectPaymentModalProps {
  isOpen: boolean;
  customer: Customer | null;
  onClose: () => void;
  onSavePayment: (
    customer: Customer,
    data: {
      amount: number;
      paymentMethod: PaymentMethod;
      isTuesdaySettlement: boolean;
      timestamp: number;
      note?: string;
    }
  ) => Promise<void>;
}

export const CollectPaymentModal: React.FC<CollectPaymentModalProps> = ({
  isOpen,
  customer,
  onClose,
  onSavePayment,
}) => {
  if (!isOpen || !customer) return null;

  const [amount, setAmount] = useState<string>(String(customer.totalDue || ''));
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [isTuesdaySettlement, setIsTuesdaySettlement] = useState<boolean>(customer.settlesOnTuesday);
  const [note, setNote] = useState<string>('Due settlement');
  const [saving, setSaving] = useState(false);

  const handleFullPayment = () => {
    setAmount(String(customer.totalDue));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) return;

    setSaving(true);
    try {
      await onSavePayment(customer, {
        amount: numAmount,
        paymentMethod,
        isTuesdaySettlement,
        timestamp: Date.now(),
        note: note.trim() || (isTuesdaySettlement ? 'Tuesday weekly settlement' : 'Cash payment'),
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const remainingDue = Math.max(0, customer.totalDue - (Number(amount) || 0));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Collect Payment & Settle Due
              </h3>
              <p className="text-[11px] text-slate-500">
                {customer.name} {customer.phone ? `(${customer.phone})` : ''}
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Due info card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-500 block">Current Total Due:</span>
              <span className="text-lg font-black text-rose-600 dark:text-rose-400">
                {formatTaka(customer.totalDue)}
              </span>
            </div>
            <button
              type="button"
              onClick={handleFullPayment}
              className="px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold hover:bg-emerald-200 transition text-[11px]"
            >
              Pay Full Due Amount
            </button>
          </div>

          {/* Amount input */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Payment Amount (৳) *
            </label>
            <input
              type="number"
              required
              min="1"
              max={customer.totalDue * 2} // allow slight advance if wanted
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount in Taka..."
              className="w-full px-3.5 py-2.5 text-lg font-extrabold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-emerald-600 dark:text-emerald-400 focus:ring-2 focus:ring-emerald-500"
            />
            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1 px-1">
              <span>Remaining Due After Payment:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {formatTaka(remainingDue)}
              </span>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Payment Method
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'cash', label: 'Cash' },
                { id: 'bkash', label: 'Bkash' },
                { id: 'nagad', label: 'Nagad' },
                { id: 'other', label: 'Other' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                  className={`py-2 px-1 rounded-xl text-center font-bold border transition ${
                    paymentMethod === m.id
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tuesday Settlement Flag */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <div>
                <span className="font-bold text-amber-900 dark:text-amber-200 block">
                  Marked as Tuesday Weekly Settlement
                </span>
                <span className="text-[10px] text-amber-700/80 dark:text-amber-400/80">
                  Included in Tuesday collection report
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isTuesdaySettlement}
              onChange={(e) => setIsTuesdaySettlement(e.target.checked)}
              className="w-5 h-5 accent-amber-600 rounded-md cursor-pointer"
            />
          </div>

          {/* Note */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Notes / Remarks
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g., Full weekly settlement paid"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !Number(amount)}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-600/20 disabled:opacity-50"
            >
              {saving ? 'Collecting...' : 'Confirm Payment Collection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
