import React, { useState } from 'react';
import { ShieldCheck, Lock, CheckCircle, Sparkles, AlertTriangle, Layers, DollarSign } from 'lucide-react';
import { CreatorPayoutModel } from '../../types/distribution';
import { setCreatorPayoutModel } from '../../services/distributionService';
import { useToast } from '../../context/ToastContext';
import { UserProfile } from '../../types';
import { DistributionConfirmModal } from './DistributionConfirmModal';

interface CreatorDistributionSetupCardProps {
  userProfile: UserProfile | null;
  userId: string;
  userEmail?: string;
  onUpdated?: () => void;
}

export const CreatorDistributionSetupCard: React.FC<CreatorDistributionSetupCardProps> = ({
  userProfile,
  userId,
  userEmail,
  onUpdated,
}) => {
  const { showToast } = useToast();
  const [selectedModel, setSelectedModel] = useState<CreatorPayoutModel>(
    userProfile?.creatorPayoutModel || 'fixed'
  );
  const [saving, setSaving] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const isLocked = Boolean(userProfile?.creatorPayoutModelLocked && userProfile?.creatorPayoutModel);

  const handleExecuteLock = async () => {
    if (isLocked) return;
    const effectiveUid = userId || userProfile?.userId || '';
    const effectiveEmail = userEmail || userProfile?.email || '';

    if (!effectiveUid && !effectiveEmail) {
      showToast('Creator identity missing. Please reload the page.', 'error');
      return;
    }

    setSaving(true);
    try {
      await setCreatorPayoutModel(effectiveUid, selectedModel, effectiveEmail);
      setShowConfirmModal(false);
      showToast('Earning distribution model locked and activated permanently!', 'success');
      if (onUpdated) onUpdated();
    } catch (err: any) {
      showToast(err.message || 'Failed to lock distribution model', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
      {/* Title & Status */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              Earning Distribution Setup
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Choose how your tools earn revenue from subscribers. Once set up, your selection is permanently locked.
            </p>
          </div>
        </div>

        {isLocked && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <Lock className="w-3.5 h-3.5" /> Model Locked
          </span>
        )}
      </div>

      {/* When Locked View */}
      {isLocked ? (
        <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              Active Model: {userProfile?.creatorPayoutModel === 'fixed' ? 'Fixed Pay-per-Download (৳3 per copy)' : '60%-40% Subscription Royalty Pool'}
            </span>
          </div>
          <p className="text-xs text-emerald-700 dark:text-emerald-400">
            {userProfile?.creatorPayoutModel === 'fixed'
              ? 'Your wallet receives fixed earnings automatically on each unique paid code copy or file download.'
              : 'Your wallet receives monthly royalty shares proportional to your tool usage from the 40% subscription pool.'}
          </p>
          <div className="pt-1 text-[11px] text-slate-400">
            Locked on: {userProfile?.creatorPayoutModelSetupAt ? new Date(userProfile.creatorPayoutModelSetupAt).toLocaleDateString() : 'Active'} • Cannot be modified.
          </div>
        </div>
      ) : (
        /* Not Locked - Selection Mode */
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Option 1: 60/40 Pool */}
            <div
              onClick={() => setSelectedModel('pool')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all relative ${
                selectedModel === 'pool'
                  ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900 text-indigo-600">
                    <Layers className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Option 1: 60%-40% Pool</span>
                </div>
                {selectedModel === 'pool' && <CheckCircle className="w-4 h-4 text-indigo-600" />}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 font-medium">
                Monthly Subscription Pool Share
              </p>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                40% of platform subscription revenue is pooled for creators. You earn monthly royalties proportional to your tool downloads.
              </p>
            </div>

            {/* Option 2 (Option 4): Fixed Rate */}
            <div
              onClick={() => setSelectedModel('fixed')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all relative ${
                selectedModel === 'fixed'
                  ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900 text-emerald-600">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Option 2: Fixed Rate</span>
                </div>
                {selectedModel === 'fixed' && <CheckCircle className="w-4 h-4 text-indigo-600" />}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 font-medium">
                Fixed Rate Per Copy/Download (৳3)
              </p>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Whenever any subscriber copies your code or downloads files, ৳3 is credited instantly to your wallet.
              </p>
            </div>
          </div>

          {/* Warning notice */}
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Notice:</strong> Choose your preferred model carefully. Once confirmed, this selection will be locked permanently and cannot be changed later.
            </span>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={() => setShowConfirmModal(true)}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition flex items-center gap-2 disabled:opacity-50"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Confirm & Lock Earning Model</span>
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <DistributionConfirmModal
        isOpen={showConfirmModal}
        selectedModel={selectedModel}
        loading={saving}
        onConfirm={handleExecuteLock}
        onClose={() => setShowConfirmModal(false)}
      />
    </div>
  );
};
