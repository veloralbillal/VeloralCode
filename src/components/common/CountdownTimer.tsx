import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, CheckCircle2, Infinity } from 'lucide-react';
import { calculateRemainingTime, RemainingTime } from '../../utils/timeUtils';
import { formatDateTime } from '../../utils/helpers';

interface CountdownTimerProps {
  targetTimestamp?: number | null;
  startTimestamp?: number | null;
  isLifetime?: boolean;
  onExpire?: () => void;
  compact?: boolean;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetTimestamp,
  startTimestamp,
  isLifetime,
  onExpire,
  compact = false,
}) => {
  const [time, setTime] = useState<RemainingTime>(() =>
    calculateRemainingTime(targetTimestamp)
  );

  useEffect(() => {
    if (isLifetime || !targetTimestamp) return;

    // Initial check
    const initial = calculateRemainingTime(targetTimestamp);
    setTime(initial);
    if (initial.isExpired && onExpire) {
      onExpire();
    }

    const interval = setInterval(() => {
      const updated = calculateRemainingTime(targetTimestamp);
      setTime(updated);
      if (updated.isExpired) {
        clearInterval(interval);
        if (onExpire) onExpire();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTimestamp, isLifetime, onExpire]);

  if (isLifetime || !targetTimestamp) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
        <Infinity className="w-4 h-4" />
        <span>Lifetime Access</span>
      </div>
    );
  }

  if (time.isExpired) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold">
        <AlertTriangle className="w-4 h-4" />
        <span>License Expired ({formatDateTime(targetTimestamp)})</span>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-mono font-bold">
        <Clock className="w-3 h-3 animate-spin duration-3000" />
        <span>{time.formatted} remaining</span>
      </div>
    );
  }

  // Calculate percentage progress if startTimestamp available
  let progressPercent = 100;
  if (startTimestamp && targetTimestamp && targetTimestamp > startTimestamp) {
    const total = targetTimestamp - startTimestamp;
    const elapsed = Date.now() - startTimestamp;
    progressPercent = Math.max(0, Math.min(100, Math.round(((total - elapsed) / total) * 100)));
  }

  return (
    <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-md space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-slate-300">Active License Countdown</span>
        </div>
        <span className="text-[11px] text-slate-400">
          Expires: {formatDateTime(targetTimestamp)}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
          <span className="text-lg sm:text-xl font-mono font-black text-amber-400 block">
            {time.days.toString().padStart(2, '0')}
          </span>
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Days</span>
        </div>
        <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
          <span className="text-lg sm:text-xl font-mono font-black text-amber-400 block">
            {time.hours.toString().padStart(2, '0')}
          </span>
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Hours</span>
        </div>
        <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
          <span className="text-lg sm:text-xl font-mono font-black text-amber-400 block">
            {time.minutes.toString().padStart(2, '0')}
          </span>
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Mins</span>
        </div>
        <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
          <span className="text-lg sm:text-xl font-mono font-black text-emerald-400 block">
            {time.seconds.toString().padStart(2, '0')}
          </span>
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Secs</span>
        </div>
      </div>

      {/* Progress Bar */}
      {startTimestamp && (
        <div className="space-y-1">
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                progressPercent > 20 ? 'bg-amber-400' : 'bg-rose-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>Activated: {formatDateTime(startTimestamp)}</span>
            <span>{progressPercent}% time left</span>
          </div>
        </div>
      )}
    </div>
  );
};
