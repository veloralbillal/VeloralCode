import React, { useState, useEffect } from 'react';
import { Activity, Clock, Code, Eye, Copy, Play, Download, Trash2, ArrowRight } from 'lucide-react';
import { UserRecentActivityItem } from '../../types';
import { getRecentActivities, clearRecentActivities } from '../../services/userService';
import { formatDateTime } from '../../utils/helpers';

interface UserRecentActivityCardProps {
  onNavigateToCode?: (codeId: string) => void;
}

export const UserRecentActivityCard: React.FC<UserRecentActivityCardProps> = ({
  onNavigateToCode,
}) => {
  const [activities, setActivities] = useState<UserRecentActivityItem[]>([]);

  useEffect(() => {
    setActivities(getRecentActivities());
  }, []);

  const handleClear = () => {
    clearRecentActivities();
    setActivities([]);
  };

  const getActionBadge = (action: UserRecentActivityItem['action']) => {
    switch (action) {
      case 'run':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Play className="w-2.5 h-2.5 fill-current" />
            <span>Executed</span>
          </span>
        );
      case 'copied':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Copy className="w-2.5 h-2.5" />
            <span>Copied</span>
          </span>
        );
      case 'downloaded':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Download className="w-2.5 h-2.5" />
            <span>Downloaded</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            <Eye className="w-2.5 h-2.5" />
            <span>Viewed</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <Activity className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Recently Viewed & Run History
            </h3>
            <p className="text-[10px] text-slate-400">
              Quick shortcuts to your recently tested scripts
            </p>
          </div>
        </div>

        {activities.length > 0 && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-rose-500 transition"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {activities.length === 0 ? (
        <div className="py-8 text-center space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Clock className="w-5 h-5" />
          </div>
          <p className="text-xs text-slate-500">
            No recent activity yet. When you view or run tools, they will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          {activities.slice(0, 10).map((act, idx) => (
            <div
              key={`${act.codeId}-${act.timestamp}-${idx}`}
              className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-800 hover:border-indigo-500/30 transition group"
            >
              <div className="flex items-center gap-3 min-w-0">
                {getActionBadge(act.action)}
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {act.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span>{act.language}</span>
                    <span>•</span>
                    <span>{formatDateTime(act.timestamp)}</span>
                  </div>
                </div>
              </div>

              {onNavigateToCode && (
                <button
                  onClick={() => onNavigateToCode(act.codeId)}
                  className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition opacity-80 group-hover:opacity-100 shrink-0"
                  title="Re-open code"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
