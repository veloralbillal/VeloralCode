import React from 'react';
import { Sparkles, Eye, AlertTriangle, Users } from 'lucide-react';
import { EventItem } from '../../../types/event';

interface AdminActivePopupBannerProps {
  activeEvent: EventItem;
  onPreview: (event: EventItem) => void;
  onDeactivate: (event: EventItem) => void;
}

export const AdminActivePopupBanner: React.FC<AdminActivePopupBannerProps> = ({
  activeEvent,
  onPreview,
  onDeactivate,
}) => {
  const roles = activeEvent.targetRoles && activeEvent.targetRoles.length > 0
    ? activeEvent.targetRoles.join(', ')
    : 'All Accounts';

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 border border-amber-500/30 dark:border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
      <div className="flex items-center gap-3">
        <span className="p-2.5 rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/30 shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </span>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wide">
              Active User Warning Popup (লাইভ পপআপ)
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold">
              Target: {roles}
            </span>
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 mt-0.5">
            {activeEvent.title}
          </h4>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        <button
          type="button"
          onClick={() => onPreview(activeEvent)}
          className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
        >
          <Eye className="w-3.5 h-3.5 text-indigo-500" />
          <span>Preview Popup</span>
        </button>
        <button
          type="button"
          onClick={() => onDeactivate(activeEvent)}
          className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 text-xs font-semibold transition cursor-pointer"
        >
          Deactivate
        </button>
      </div>
    </div>
  );
};
