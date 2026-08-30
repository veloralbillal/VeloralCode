import React, { useState } from 'react';
import {
  Key,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Infinity,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { redeemLicenseKey } from '../../services/licenseService';
import { CountdownTimer } from '../common/CountdownTimer';

interface LicenseRedeemCardProps {
  onSuccess?: () => void;
}

export const LicenseRedeemCard: React.FC<LicenseRedeemCardProps> = ({ onSuccess }) => {
  const { currentUser, userProfile, isPremium, isPlanExpired, refreshUserProfile } = useAuth();
  const { showToast } = useToast();

  const [licenseKeyInput, setLicenseKeyInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      showToast('Please login to redeem license key', 'error');
      return;
    }

    const clean = licenseKeyInput.trim().toUpperCase();
    if (!clean) {
      setErrorMsg('Please enter a license key');
      return;
    }

    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await redeemLicenseKey(clean, {
        uid: currentUser.uid,
        email: currentUser.email || '',
        numericUid: userProfile?.numericUid,
      });

      if (res.success) {
        setSuccessMsg(res.message);
        setLicenseKeyInput('');
        showToast('🎉 Premium account activated successfully!', 'success');
        await refreshUserProfile();
        if (onSuccess) onSuccess();
      } else {
        setErrorMsg(res.message);
        showToast(res.message, 'error');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to redeem license key');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Key className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              License Key & Timer
            </h3>
            <span className="text-[10px] text-slate-400">
              Activate or renew your Premium access
            </span>
          </div>
        </div>

        {isPremium && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/30">
            <Sparkles className="w-3 h-3 fill-current" />
            <span>Active Pro</span>
          </span>
        )}

        {isPlanExpired && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/30">
            <AlertCircle className="w-3 h-3" />
            <span>Expired</span>
          </span>
        )}
      </div>

      {/* Active Expiration Timer Display */}
      {isPremium && (
        <CountdownTimer
          targetTimestamp={userProfile?.planExpiresAt}
          startTimestamp={userProfile?.redeemedAt}
          isLifetime={userProfile?.isLifetime}
          onExpire={refreshUserProfile}
        />
      )}

      {/* Plan Expired Notification Alert */}
      {isPlanExpired && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs space-y-1">
          <div className="flex items-center gap-2 font-bold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Your Premium Subscription Has Expired</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Enter a new license key below to restart the validity timer and restore full access.
          </p>
        </div>
      )}

      {successMsg && (
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleRedeem} className="space-y-3 text-xs">
        <div>
          <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1.5">
            {isPremium ? 'Renew / Activate New License Key' : 'License Key (লাইসেন্স কি)'}
          </label>
          <div className="relative">
            <input
              type="text"
              value={licenseKeyInput}
              onChange={(e) => {
                setLicenseKeyInput(e.target.value.toUpperCase());
                setErrorMsg('');
              }}
              placeholder="e.g. PRO-8952-4190-8831"
              className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold tracking-wider uppercase placeholder:normal-case placeholder:tracking-normal placeholder:font-normal focus:outline-none focus:border-indigo-500"
            />
            <Key className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <p className="text-[11px] text-slate-400">
            {userProfile?.redeemedKey ? (
              <span className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                Last Key: {userProfile.redeemedKey}
              </span>
            ) : (
              'Timer begins counting down upon activation.'
            )}
          </p>

          <button
            type="submit"
            disabled={loading || !licenseKeyInput.trim()}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold transition shadow-md shadow-indigo-600/25 shrink-0"
          >
            {loading ? (
              <span>Activating...</span>
            ) : (
              <>
                <span>{isPremium ? 'Extend/Renew' : 'Redeem Key'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
