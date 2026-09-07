import React from 'react';
import { Lock, AlertTriangle, Layers, Sparkles, X } from 'lucide-react';
import { CreatorPayoutModel } from '../../types/distribution';

interface DistributionConfirmModalProps {
  isOpen: boolean;
  selectedModel: CreatorPayoutModel;
  loading: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const DistributionConfirmModal: React.FC<DistributionConfirmModalProps> = ({
  isOpen,
  selectedModel,
  loading,
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Confirm Lock & Activation
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Confirm & Lock Earning Distribution Model
            </p>
          </div>
        </div>

        {/* Selected Model Card */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
          <div className="flex items-center gap-2">
            {selectedModel === 'pool' ? (
              <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900 text-indigo-600">
                <Layers className="w-4 h-4" />
              </div>
            ) : (
              <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900 text-emerald-600">
                <Sparkles className="w-4 h-4" />
              </div>
            )}
            <span className="font-bold text-sm text-slate-900 dark:text-white">
              {selectedModel === 'pool' ? 'Option 1: 60%-40% Subscription Royalty Pool' : 'Option 2: Fixed Rate (৳3 per copy/download)'}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {selectedModel === 'pool'
              ? '40% of monthly platform subscription revenue is pooled into the Creator Royalty Pool and distributed based on your tool usage ratio.'
              : 'Whenever any paid subscriber copies or downloads your code, ৳3 is credited immediately to your creator wallet.'}
          </p>
        </div>

        {/* Warning Banner */}
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Important Note:</strong> Once confirmed, this payout model will be permanently set for your account and cannot be modified later.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition disabled:opacity-50"
          >
            Cancel (Cancel)
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Lock className="w-3.5 h-3.5" />
            )}
            <span>Yes, Confirm & Lock Model</span>
          </button>
        </div>
      </div>
    </div>
  );
};
