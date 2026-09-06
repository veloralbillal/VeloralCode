import React, { useState } from 'react';
import { X, UserPlus, Calendar, Phone, MapPin } from 'lucide-react';
import { Customer } from '../types';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCustomer: (customerData: Omit<Customer, 'id' | 'createdAt' | 'lastActivityAt' | 'totalDue' | 'totalPaid'> & { initialDue?: number }) => Promise<void>;
}

export const AddCustomerModal: React.FC<AddCustomerModalProps> = ({
  isOpen,
  onClose,
  onSaveCustomer,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [settlesOnTuesday, setSettlesOnTuesday] = useState(true);
  const [initialDue, setInitialDue] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    try {
      await onSaveCustomer({
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        settlesOnTuesday,
        preferredSettlementDay: settlesOnTuesday ? 'মঙ্গলবার' : 'অন্য দিন',
        notes: notes.trim(),
        initialDue: Number(initialDue) || 0,
      });
      onClose();
      // Reset
      setName('');
      setPhone('');
      setAddress('');
      setInitialDue('');
      setNotes('');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                নতুন গ্রাহক যুক্ত করুন
              </h3>
              <p className="text-[11px] text-slate-500">খাতার জন্য কাস্টমারের তথ্য দিন</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              গ্রাহকের নাম *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="যেমন: রফিক ভাই (টেইলার্স)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" />
                <span>মোবাইল নম্বর</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01711..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                পূর্বের বকেয়া (যদি থাকে)
              </label>
              <input
                type="number"
                value={initialDue}
                onChange={(e) => setInitialDue(e.target.value)}
                placeholder="৳ ০.০০"
                min="0"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>ঠিকানা বা দোকান/কর্মক্ষেত্র</span>
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="যেমন: লেকের পাড় গ্যারেজ / স্কুলের সামনে"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Tuesday settlement toggle */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <div>
                <span className="font-bold text-amber-900 dark:text-amber-200 block">
                  মঙ্গলবার পরিশোধ করে?
                </span>
                <span className="text-[10px] text-amber-700/80 dark:text-amber-400/80">
                  গ্রাহক প্রতি মঙ্গলবার সাপ্তাহিক হিসাব পরিশোধ করবেন
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settlesOnTuesday}
              onChange={(e) => setSettlesOnTuesday(e.target.checked)}
              className="w-5 h-5 accent-amber-600 rounded-md cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-600/20 disabled:opacity-50"
            >
              {saving ? 'সংরক্ষণ হচ্ছে...' : 'গ্রাহক যোগ করুন'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
