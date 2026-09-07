import React, { useState, useEffect } from 'react';
import { X, Coffee, ShoppingBag, Smartphone, FileText, Check, Plus, Clock } from 'lucide-react';
import { Customer, BakiCategory, BkashType } from '../types';

interface AddDueModalProps {
  isOpen: boolean;
  customers: Customer[];
  preSelectedCustomer?: Customer | null;
  initialCategory?: BakiCategory;
  initialAmount?: number;
  initialSummary?: string;
  initialBkashType?: BkashType;
  onClose: () => void;
  onSaveDue: (
    customer: Customer,
    data: {
      category: BakiCategory;
      bkashType?: BkashType;
      mfsNumber?: string;
      itemsSummary: string;
      amount: number;
      timestamp: number;
      note?: string;
    }
  ) => Promise<void>;
}

export const AddDueModal: React.FC<AddDueModalProps> = ({
  isOpen,
  customers,
  preSelectedCustomer,
  initialCategory = 'cha_pan',
  initialAmount = 0,
  initialSummary = '',
  initialBkashType = 'none',
  onClose,
  onSaveDue,
}) => {
  const [selectedCustId, setSelectedCustId] = useState<string>('');
  const [category, setCategory] = useState<BakiCategory>(initialCategory);
  const [amount, setAmount] = useState<string>(initialAmount ? String(initialAmount) : '');
  const [itemsSummary, setItemsSummary] = useState<string>(initialSummary);
  const [bkashType, setBkashType] = useState<BkashType>(initialBkashType);
  const [mfsNumber, setMfsNumber] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [useCurrentTime, setUseCurrentTime] = useState<boolean>(true);
  const [customDateTime, setCustomDateTime] = useState<string>(
    new Date().toISOString().slice(0, 16)
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (preSelectedCustomer) {
      setSelectedCustId(preSelectedCustomer.id);
      if (preSelectedCustomer.phone) {
        setMfsNumber(preSelectedCustomer.phone);
      }
    } else if (customers.length > 0 && !selectedCustId) {
      setSelectedCustId(customers[0].id);
    }
  }, [preSelectedCustomer, customers, selectedCustId]);

  useEffect(() => {
    if (initialCategory) setCategory(initialCategory);
    if (initialAmount) setAmount(String(initialAmount));
    if (initialSummary) setItemsSummary(initialSummary);
    if (initialBkashType) setBkashType(initialBkashType);
  }, [initialCategory, initialAmount, initialSummary, initialBkashType]);

  if (!isOpen) return null;

  const currentCustomer = customers.find((c) => c.id === selectedCustId);

  const handleQuickAddTag = (tag: string, cost: number) => {
    setItemsSummary((prev) => (prev ? `${prev}, ${tag}` : tag));
    if (cost > 0) {
      setAmount((prev) => String((Number(prev) || 0) + cost));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCustomer) return;
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) return;

    const timestamp = useCurrentTime ? Date.now() : new Date(customDateTime).getTime();

    setSaving(true);
    try {
      await onSaveDue(currentCustomer, {
        category,
        bkashType: category === 'bkash' ? bkashType : undefined,
        mfsNumber: category === 'bkash' ? mfsNumber : undefined,
        itemsSummary: itemsSummary.trim() || 'General Credit',
        amount: numAmount,
        timestamp,
        note: note.trim(),
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Record Credit to Ledger
            </h3>
            <p className="text-[11px] text-slate-500">Grocery, Tea & Betel, or Bkash MFS</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Customer select */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Select Customer *
            </label>
            <select
              value={selectedCustId}
              onChange={(e) => {
                setSelectedCustId(e.target.value);
                const c = customers.find((x) => x.id === e.target.value);
                if (c?.phone) setMfsNumber(c.phone);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 font-medium"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.phone ? `(${c.phone})` : ''} — Current Due: ৳{c.totalDue}
                </option>
              ))}
            </select>
          </div>

          {/* Category tabs */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Credit Category
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => setCategory('cha_pan')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition ${
                  category === 'cha_pan'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Coffee className="w-4 h-4 mb-1" />
                <span className="text-[11px]">Tea & Betel</span>
              </button>

              <button
                type="button"
                onClick={() => setCategory('mudi')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition ${
                  category === 'mudi'
                    ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-500 text-amber-700 dark:text-amber-300 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <ShoppingBag className="w-4 h-4 mb-1" />
                <span className="text-[11px]">Grocery</span>
              </button>

              <button
                type="button"
                onClick={() => setCategory('bkash')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition ${
                  category === 'bkash'
                    ? 'bg-pink-50 dark:bg-pink-950/60 border-pink-500 text-pink-700 dark:text-pink-300 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Smartphone className="w-4 h-4 mb-1" />
                <span className="text-[11px]">Bkash / Recharge</span>
              </button>

              <button
                type="button"
                onClick={() => setCategory('other')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition ${
                  category === 'other'
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <FileText className="w-4 h-4 mb-1" />
                <span className="text-[11px]">Other</span>
              </button>
            </div>
          </div>

          {/* Special bKash section */}
          {category === 'bkash' && (
            <div className="p-3.5 rounded-2xl bg-pink-500/10 border border-pink-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-pink-900 dark:text-pink-200 text-xs">
                  Bkash MFS Type:
                </span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                {[
                  { id: 'recharge', label: 'Recharge' },
                  { id: 'cash_out', label: 'Cash Out' },
                  { id: 'cash_in', label: 'Cash In' },
                  { id: 'send_money', label: 'Send Money' },
                  { id: 'payment', label: 'Payment' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setBkashType(t.id as BkashType);
                      setItemsSummary(`Bkash ${t.label}`);
                    }}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-bold border transition ${
                      bkashType === t.id
                        ? 'bg-pink-600 text-white border-pink-600 shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-pink-200 dark:border-pink-900/40'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Bkash / Mobile Number
                </label>
                <input
                  type="tel"
                  value={mfsNumber}
                  onChange={(e) => setMfsNumber(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* Quick tags according to category */}
          {category === 'cha_pan' && (
            <div>
              <span className="text-[11px] font-bold text-slate-500 mb-1.5 block">
                Tea & Betel Shortcuts (Click to Add):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'Milk Tea', cost: 10 },
                  { label: 'Black Tea', cost: 6 },
                  { label: 'Lemon Tea', cost: 7 },
                  { label: 'Sweet Paan', cost: 10 },
                  { label: 'Zarda Paan', cost: 10 },
                  { label: 'Snacks/Smokes', cost: 15 },
                  { label: 'Biscuits', cost: 10 },
                ].map((tag) => (
                  <button
                    key={tag.label}
                    type="button"
                    onClick={() => handleQuickAddTag(`${tag.label} (৳${tag.cost})`, tag.cost)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-700 font-semibold text-[11px]"
                  >
                    + {tag.label} (৳{tag.cost})
                  </button>
                ))}
              </div>
            </div>
          )}

          {category === 'mudi' && (
            <div>
              <span className="text-[11px] font-bold text-slate-500 mb-1.5 block">
                Common Grocery Shortcuts:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Rice',
                  'Soybean Oil',
                  'Sugar 1kg',
                  'Lentils 1kg',
                  'Eggs 4pcs',
                  'Salt 1 pack',
                  'Flour 2kg',
                  'Soap',
                ].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleQuickAddTag(item, 0)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-950/60 text-slate-700 dark:text-slate-300 hover:text-amber-700 dark:hover:text-amber-300 border border-slate-200 dark:border-slate-700 font-semibold text-[11px]"
                  >
                    + {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Amount & Items details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Credit Amount (৳) *
              </label>
              <input
                type="number"
                required
                min="1"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 50"
                className="w-full px-3.5 py-2.5 text-base font-extrabold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-rose-600 dark:text-rose-400 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Items / Description
              </label>
              <input
                type="text"
                value={itemsSummary}
                onChange={(e) => setItemsSummary(e.target.value)}
                placeholder="e.g. 2 cups tea, 1 sweet paan"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Timestamp selector */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  Timestamp (Exact transaction time)
                </span>
              </div>
              <label className="flex items-center gap-1.5 cursor-pointer text-emerald-600 dark:text-emerald-400 font-bold">
                <input
                  type="checkbox"
                  checked={useCurrentTime}
                  onChange={(e) => setUseCurrentTime(e.target.checked)}
                  className="rounded accent-emerald-600"
                />
                <span>Current Time</span>
              </label>
            </div>

            {!useCurrentTime && (
              <div>
                <input
                  type="datetime-local"
                  value={customDateTime}
                  onChange={(e) => setCustomDateTime(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Additional Note (Optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Taken in the afternoon"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          {/* Submit */}
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
              {saving ? 'Saving...' : 'Add Credit Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
