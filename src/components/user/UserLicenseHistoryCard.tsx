import React, { useState, useEffect } from 'react';
import { History, Key, Clock, Infinity, AlertCircle, Sparkles } from 'lucide-react';
import { UserLicenseHistoryItem } from '../../types';
import { getUserLicenseHistory } from '../../services/userService';
import { formatDate, formatDateTime } from '../../utils/helpers';
import { calculateRemainingTime, getDurationLabel } from '../../utils/timeUtils';

interface UserLicenseHistoryCardProps {
  userId: string;
}

export const UserLicenseHistoryCard: React.FC<UserLicenseHistoryCardProps> = ({ userId }) => {
  const [history, setHistory] = useState<UserLicenseHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    getUserLicenseHistory(userId).then((res) => {
      setHistory(res);
      setLoading(false);
    });
  }, [userId]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <History className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              License History & Logs
            </h3>
            <p className="text-[10px] text-slate-400">
              Record of all redeemed license keys and durations
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-slate-400">
          {history.length} key(s)
        </span>
      </div>

      {loading ? (
        <div className="py-6 text-center text-xs text-slate-400 animate-pulse">
          Loading license records...
        </div>
      ) : history.length === 0 ? (
        <div className="py-8 text-center space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Key className="w-5 h-5" />
          </div>
          <p className="text-xs text-slate-500">No past license activations found for this account.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[11px] font-bold">
                <th className="py-2.5 px-3">License Key</th>
                <th className="py-2.5 px-3">Duration</th>
                <th className="py-2.5 px-3">Activated Date</th>
                <th className="py-2.5 px-3">Status / Expiry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {history.map((item) => {
                const remaining = calculateRemainingTime(item.expiresAt);
                const isLifetime = item.durationDays === 0 || !item.expiresAt;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3 px-3">
                      <span className="font-mono font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                        {item.key}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                      {getDurationLabel(item.durationDays)}
                    </td>
                    <td className="py-3 px-3 text-slate-400 text-[11px]">
                      {formatDate(item.redeemedAt)}
                    </td>
                    <td className="py-3 px-3">
                      {isLifetime ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          <Infinity className="w-3 h-3" />
                          <span>Lifetime</span>
                        </span>
                      ) : remaining.isExpired ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400">
                          <AlertCircle className="w-2.5 h-2.5" />
                          <span>Expired ({formatDate(item.expiresAt || 0)})</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                          <Clock className="w-2.5 h-2.5" />
                          <span>Active ({remaining.formatted} left)</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
