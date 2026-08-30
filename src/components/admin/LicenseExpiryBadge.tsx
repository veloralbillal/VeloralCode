import React, { useState, useEffect } from 'react';
import { Clock, Infinity, AlertCircle, CheckCircle2 } from 'lucide-react';
import { LicenseKey } from '../../types';
import { calculateRemainingTime, getDurationLabel } from '../../utils/timeUtils';
import { formatDate, formatDateTime } from '../../utils/helpers';

interface LicenseExpiryBadgeProps {
  license: LicenseKey;
}

export const LicenseExpiryBadge: React.FC<LicenseExpiryBadgeProps> = ({ license }) => {
  const [time, setTime] = useState(() => calculateRemainingTime(license.expiresAt));

  useEffect(() => {
    if (license.status !== 'used' || !license.expiresAt) return;

    const interval = setInterval(() => {
      setTime(calculateRemainingTime(license.expiresAt));
    }, 1000);

    return () => clearInterval(interval);
  }, [license.status, license.expiresAt]);

  const durationDays = license.durationDays !== undefined ? license.durationDays : 30;

  // 1. Not used yet: Show duration configured
  if (license.status === 'active') {
    return (
      <div className="space-y-0.5">
        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          <Clock className="w-2.5 h-2.5 text-indigo-500" />
          <span>{getDurationLabel(durationDays)}</span>
        </div>
        <span className="text-[10px] text-slate-400 block italic">
          Timer starts on activation
        </span>
      </div>
    );
  }

  // 2. Revoked
  if (license.status === 'revoked') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-500 border border-rose-500/20">
        Revoked
      </span>
    );
  }

  // 3. Used - Lifetime
  if (durationDays === 0 || !license.expiresAt) {
    return (
      <div className="space-y-0.5">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <Infinity className="w-3 h-3" />
          <span>Lifetime Unlimited</span>
        </span>
      </div>
    );
  }

  // 4. Used - Expired
  if (time.isExpired) {
    return (
      <div className="space-y-0.5">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-500/20">
          <AlertCircle className="w-2.5 h-2.5" />
          <span>Expired</span>
        </span>
        <span className="text-[10px] text-slate-400 block font-mono">
          Ended {formatDate(license.expiresAt || 0)}
        </span>
      </div>
    );
  }

  // 5. Used - Active Countdown Running
  return (
    <div className="space-y-0.5">
      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
        <span>{time.formatted} left</span>
      </div>
      <span className="text-[10px] text-slate-400 block">
        Until {formatDate(license.expiresAt || 0)}
      </span>
    </div>
  );
};
