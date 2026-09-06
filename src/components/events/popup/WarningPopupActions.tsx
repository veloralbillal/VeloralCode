import React, { useState } from 'react';
import { ExternalLink, Check, ArrowRight } from 'lucide-react';
import { EventItem } from '../../../types/event';

interface WarningPopupActionsProps {
  event: EventItem;
  onClose: () => void;
  onNavigate?: (tab: string) => void;
  previewMode?: boolean;
}

export const WarningPopupActions: React.FC<WarningPopupActionsProps> = ({
  event,
  onClose,
  onNavigate,
  previewMode = false,
}) => {
  const [dontShowSession, setDontShowSession] = useState(false);

  const handleDismiss = () => {
    if (dontShowSession && !previewMode) {
      sessionStorage.setItem(`dismissed_popup_${event.id}`, 'true');
    }
    onClose();
  };

  const handleAction = () => {
    if (event.actionUrl) {
      window.open(event.actionUrl, '_blank', 'noopener,noreferrer');
    } else if (onNavigate) {
      onNavigate('events');
    }
    handleDismiss();
  };

  const hasLink = Boolean(event.actionUrl?.trim());

  return (
    <div className="px-5 sm:px-6 pb-5 sm:pb-6 space-y-3">
      <div className="flex flex-col sm:flex-row items-center gap-2">
        {hasLink ? (
          <>
            <button
              type="button"
              onClick={handleAction}
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>{event.actionLabel || 'Check Details'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="w-full sm:w-auto py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Close
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={handleDismiss}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>I Understand</span>
          </button>
        )}
      </div>

      {!previewMode && (
        <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dontShowSession}
              onChange={(e) => setDontShowSession(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Don't show this notice again in this session</span>
          </label>
        </div>
      )}
    </div>
  );
};
