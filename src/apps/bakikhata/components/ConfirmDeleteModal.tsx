import React, { useState } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Customer } from '../types';
import { formatTaka } from '../utils/bakiUtils';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  customer: Customer | null;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  customer,
  onClose,
  onConfirm,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !customer) return null;

  const handleConfirm = async () => {
    try {
      setIsDeleting(true);
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-rose-100 dark:border-rose-950/50 overflow-hidden flex flex-col">
        {/* Header with warning badge */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-rose-50/70 dark:bg-rose-950/30">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-600/30 shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900 dark:text-white">
                কাস্টমার ডিলিট নিশ্চিত করুন
              </h3>
              <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                Confirm Customer Deletion
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white/80 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white font-black flex items-center justify-center shadow-sm text-sm shrink-0">
                {customer.name[0]}
              </div>
              <div className="min-w-0">
                <h4 className="font-extrabold text-slate-900 dark:text-white text-base truncate">
                  {customer.name}
                </h4>
                <p className="text-xs text-slate-500 truncate">
                  {customer.phone || 'No mobile number'}
                  {customer.address ? ` • ${customer.address}` : ''}
                </p>
              </div>
            </div>

            {customer.totalDue > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                  বর্তমান বাকি পাওনা:
                </span>
                <span className="text-sm font-black text-rose-600 dark:text-rose-400">
                  {formatTaka(customer.totalDue)}
                </span>
              </div>
            )}
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            আপনি কি নিশ্চিত যে আপনি এই কাস্টমারকে ডিলিট করতে চান? ডিলিট করলে এই কাস্টমারের যাবতীয় বাকি ও জমা লেনদেনের ইতিহাস সম্পূর্ণ মুছে যাবে।
          </p>
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition"
          >
            বাতিল (Cancel)
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex-1 py-3 px-4 rounded-xl text-sm font-black text-white bg-rose-600 hover:bg-rose-700 active:scale-98 shadow-md shadow-rose-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isDeleting ? 'ডিলিট হচ্ছে...' : 'হ্যাঁ, ডিলিট করুন'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
