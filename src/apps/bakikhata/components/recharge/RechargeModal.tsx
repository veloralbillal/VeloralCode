import React, { useState } from 'react';
import { X, Zap, Smartphone, Check, User } from 'lucide-react';
import { RechargeOperator, Customer } from '../../types';
import { formatTaka } from '../../utils/bakiUtils';

interface RechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  onExecuteRecharge: (payload: {
    operator: RechargeOperator;
    mobileNumber: string;
    rechargeType: 'prepaid' | 'postpaid' | 'skitto';
    amount: number;
    commissionRate: number;
    profitAmount: number;
    isDue: boolean;
    customerId?: string;
    customerName?: string;
    note?: string;
  }) => Promise<any>;
}

export const RechargeModal: React.FC<RechargeModalProps> = ({
  isOpen,
  onClose,
  customers,
  onExecuteRecharge,
}) => {
  const [operator, setOperator] = useState<RechargeOperator>('gp');
  const [mobileNumber, setMobileNumber] = useState('');
  const [rechargeType, setRechargeType] = useState<'prepaid' | 'postpaid' | 'skitto'>('prepaid');
  const [amount, setAmount] = useState<number>(100);
  const [commissionRate, setCommissionRate] = useState<number>(3.5);
  const [isDue, setIsDue] = useState<boolean>(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleNumberChange = (num: string) => {
    setMobileNumber(num);
    if (num.startsWith('017') || num.startsWith('013')) setOperator('gp');
    else if (num.startsWith('019') || num.startsWith('014')) setOperator('bl');
    else if (num.startsWith('018')) setOperator('robi');
    else if (num.startsWith('016')) setOperator('airtel');
    else if (num.startsWith('015')) setOperator('teletalk');
  };

  const profitAmount = (amount * commissionRate) / 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileNumber || mobileNumber.length < 11) {
      alert('সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন');
      return;
    }
    if (!amount || amount <= 0) {
      alert('সঠিক রিচার্জ পরিমাণ দিন');
      return;
    }

    setLoading(true);
    try {
      const cust = customers.find((c) => c.id === selectedCustomerId);
      await onExecuteRecharge({
        operator,
        mobileNumber,
        rechargeType,
        amount: Number(amount),
        commissionRate: Number(commissionRate),
        profitAmount,
        isDue,
        customerId: cust ? cust.id : undefined,
        customerName: cust ? cust.name : isDue ? 'বাকি গ্রাহক' : 'নগদ রিচার্জ',
        note,
      });
      setLoading(false);
      onClose();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-5 bg-gradient-to-r from-amber-600 to-amber-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="text-base font-black">মোবাইল রিচার্জ করুন</h3>
              <p className="text-[11px] text-amber-100">অপারেটর ও কমিশন হিসাব</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Operator Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">অপারেটর</label>
            <div className="grid grid-cols-5 gap-1.5">
              {(
                [
                  { id: 'gp', name: 'GP', color: 'bg-emerald-600' },
                  { id: 'bl', name: 'BL', color: 'bg-orange-600' },
                  { id: 'robi', name: 'Robi', color: 'bg-red-600' },
                  { id: 'airtel', name: 'Airtel', color: 'bg-rose-600' },
                  { id: 'teletalk', name: 'Teletalk', color: 'bg-blue-600' },
                ] as const
              ).map((op) => (
                <button
                  key={op.id}
                  type="button"
                  onClick={() => setOperator(op.id)}
                  className={`py-2 rounded-xl text-xs font-black uppercase transition border ${
                    operator === op.id
                      ? `${op.color} text-white border-transparent shadow-md`
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {op.name}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Number */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              মোবাইল নম্বর (১১ ডিজিট)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Smartphone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                maxLength={11}
                value={mobileNumber}
                onChange={(e) => handleNumberChange(e.target.value)}
                placeholder="017xxxxxxxx"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
          </div>

          {/* Recharge Type */}
          <div className="grid grid-cols-3 gap-2">
            {(['prepaid', 'postpaid', 'skitto'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setRechargeType(type)}
                className={`py-2 rounded-xl text-xs font-bold uppercase transition border ${
                  rechargeType === type
                    ? 'bg-amber-600 text-white border-transparent'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Amount and Commission */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                টাকার পরিমাণ (৳)
              </label>
              <input
                type="number"
                min="10"
                max="5000"
                value={amount || ''}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-black text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                কমিশন হার (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={commissionRate || ''}
                onChange={(e) => setCommissionRate(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-black text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
          </div>

          {/* Profit preview box */}
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-center justify-between text-xs">
            <span className="font-bold text-amber-800 dark:text-amber-300">রিচার্জ থেকে আনুমানিক লাভ:</span>
            <span className="font-black text-sm text-amber-700 dark:text-amber-400">
              +{formatTaka(profitAmount)}
            </span>
          </div>

          {/* Payment Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">লেনদেনের ধরন</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsDue(false);
                  setSelectedCustomerId('');
                }}
                className={`py-2 rounded-xl text-xs font-bold transition border ${
                  !isDue
                    ? 'bg-emerald-600 text-white border-transparent'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                }`}
              >
                নগদ পেমেন্ট
              </button>
              <button
                type="button"
                onClick={() => setIsDue(true)}
                className={`py-2 rounded-xl text-xs font-bold transition border ${
                  isDue
                    ? 'bg-rose-600 text-white border-transparent'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                }`}
              >
                বাকি খাতা (Due)
              </button>
            </div>
          </div>

          {isDue && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                গ্রাহক নির্বাচন করুন (ঐচ্ছিক)
              </label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
              >
                <option value="">-- সাধারণ বাকি গ্রাহক --</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Note */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">নোট (ঐচ্ছিক)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="যেমন: ইমার্জেন্সি রিচার্জ"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-black text-sm shadow-lg shadow-amber-600/30 transition flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              <span>{loading ? 'প্রসেসিং...' : `রিচার্জ সম্পন্ন করুন (${formatTaka(amount)})`}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
