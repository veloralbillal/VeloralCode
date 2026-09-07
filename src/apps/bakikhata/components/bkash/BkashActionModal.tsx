import React, { useState } from 'react';
import { X, Zap, Send, ArrowDownRight, Smartphone, AlertCircle, Check } from 'lucide-react';
import { Customer, BkashOpType } from '../../types';
import { formatTaka } from '../../utils/bakiUtils';

interface BkashActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFundBalance: number;
  customers: Customer[];
  initialType?: BkashOpType;
  onExecute: (payload: {
    type: BkashOpType;
    amount: number;
    targetNumber: string;
    simOperator?: string;
    customerId?: string;
    isDue: boolean;
    note?: string;
  }) => Promise<void>;
}

export const BkashActionModal: React.FC<BkashActionModalProps> = ({
  isOpen,
  onClose,
  currentFundBalance,
  customers,
  initialType = 'send_money',
  onExecute,
}) => {
  const [opType, setOpType] = useState<BkashOpType>(initialType);
  const [phone, setPhone] = useState<string>('');
  const [operator, setOperator] = useState<string>('Grameenphone');
  const [amountStr, setAmountStr] = useState<string>('');
  const [isDue, setIsDue] = useState<boolean>(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const numAmount = parseFloat(amountStr) || 0;
  const isFundDeduction = opType === 'send_money' || opType === 'cash_in';
  const newFundBalance = isFundDeduction
    ? currentFundBalance - numAmount
    : currentFundBalance + numAmount;

  const isLowFund = isFundDeduction && newFundBalance < 0;

  const quickAmounts = [500, 1000, 2000, 5000];

  const handleCustomerSelect = (custId: string) => {
    setSelectedCustomerId(custId);
    const found = customers.find((c) => c.id === custId);
    if (found?.phone && !phone) {
      setPhone(found.phone);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (numAmount <= 0) return;
    if (isDue && !selectedCustomerId) {
      alert('বাকি সিলেক্ট করলে অবশ্যই কাস্টমার নির্বাচন করতে হবে');
      return;
    }

    setSubmitting(true);
    try {
      await onExecute({
        type: opType,
        amount: numAmount,
        targetNumber: phone.trim(),
        customerId: isDue ? selectedCustomerId : undefined,
        isDue,
        note: note.trim() || undefined,
      });
      onClose();
      setAmountStr('');
      setPhone('');
      setNote('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                বিকাশ ও মোবাইল ব্যাংকিং লেনদেন
              </h3>
              <p className="text-[11px] text-slate-500">ফান্ড ব্যালেন্স: {formatTaka(currentFundBalance)}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Operation Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              লেনদেনের ধরন নির্বাচন করুন
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
              {[
                { id: 'send_money', label: 'সেন্ড মানি', icon: Send },
                { id: 'cash_in', label: 'ক্যাশ ইন', icon: Smartphone },
                { id: 'cash_out', label: 'ক্যাশ আউট', icon: ArrowDownRight },
              ].map((item) => {
                const Icon = item.icon;
                const active = opType === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setOpType(item.id as BkashOpType)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition ${
                      active
                        ? 'bg-pink-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="text-[11px]">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Target Phone & Operator */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                গ্রাহক / প্রাপক মোবাইল নম্বর
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="017xxxxxxxx"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold"
              />
            </div>


          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              টাকার পরিমাণ (৳)
            </label>
            <input
              type="number"
              min="1"
              required
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-lg font-black"
            />
            {/* Quick buttons */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAmountStr(amt.toString())}
                  className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-pink-100 dark:hover:bg-pink-950/60 text-xs font-bold"
                >
                  ৳{amt}
                </button>
              ))}
            </div>
          </div>

          {/* Fund Impact Notification */}
          <div
            className={`p-3 rounded-2xl border flex items-center justify-between text-xs ${
              isLowFund
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 text-rose-700 dark:text-rose-400'
                : 'bg-pink-50 dark:bg-pink-950/30 border-pink-100 text-pink-900 dark:text-pink-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {isLowFund && <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>
                {isFundDeduction ? `ফান্ড থেকে ${formatTaka(numAmount)} কমবে` : `ফান্ডে ${formatTaka(numAmount)} যোগ হবে`}
              </span>
            </div>
            <span className="font-extrabold">
              পরবর্তী ফান্ড: {formatTaka(Math.max(0, newFundBalance))}
            </span>
          </div>

          {/* Payment & Due Connection */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                টাকা পরিশোধের অবস্থা
              </span>
              <div className="flex items-center gap-2 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="dueStatus"
                    checked={!isDue}
                    onChange={() => setIsDue(false)}
                    className="text-pink-600 focus:ring-pink-500"
                  />
                  <span>নগদ পরিশোধ</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-amber-600 dark:text-amber-400 font-bold">
                  <input
                    type="radio"
                    name="dueStatus"
                    checked={isDue}
                    onChange={() => setIsDue(true)}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <span>বাকি থাকবে</span>
                </label>
              </div>
            </div>

            {/* If Due is selected, connect with Customer */}
            {isDue && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-2">
                <label className="block text-[11px] font-bold text-amber-700 dark:text-amber-400">
                  কোন কাস্টমারের বাকির খাতায় যোগ হবে?
                </label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => handleCustomerSelect(e.target.value)}
                  required={isDue}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 text-xs font-bold"
                >
                  <option value="">-- কাস্টমার নির্বাচন করুন --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (বর্তমান বাকি: {formatTaka(c.totalDue)})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-500">
                  * লেনদেন সম্পন্ন হওয়ার সাথে সাথে স্বয়ংক্রিয়ভাবে কাস্টমারের বাকির খাতায় যোগ হয়ে যাবে।
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting || numAmount <= 0}
            className="w-full py-3 rounded-2xl bg-pink-600 hover:bg-pink-500 text-white font-black text-xs shadow-lg shadow-pink-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>{submitting ? 'প্রসেসিং হচ্ছে...' : 'লেনদেন নিশ্চিত করুন'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
