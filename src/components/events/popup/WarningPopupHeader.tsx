import React from 'react';
import { X, AlertTriangle, ShieldAlert, Info, Sparkles } from 'lucide-react';
import { EventItem, PopupType } from '../../../types/event';
import { POPUP_THEMES } from './WarningPopupTheme';

interface WarningPopupHeaderProps {
  event: EventItem;
  onClose: () => void;
}

export const WarningPopupHeader: React.FC<WarningPopupHeaderProps> = ({ event, onClose }) => {
  const popupType: PopupType = event.popupType || 'warning';
  const theme = POPUP_THEMES[popupType] || POPUP_THEMES.warning;
  const badgeText = event.popupBadge?.trim() || theme.defaultBadge;

  const renderIcon = () => {
    switch (popupType) {
      case 'alert':
        return <ShieldAlert className="w-8 h-8 text-rose-500" />;
      case 'info':
        return <Info className="w-8 h-8 text-sky-500" />;
      case 'success':
        return <Sparkles className="w-8 h-8 text-emerald-500" />;
      case 'warning':
      default:
        return <AlertTriangle className="w-8 h-8 text-amber-500" />;
    }
  };

  return (
    <div className="relative">
      {/* Close Button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-3 right-3 z-30 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-all hover:scale-105 cursor-pointer shadow-md"
        title="Close Notice"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>

      {event.imageUrl ? (
        /* Cover Image with gradient overlay */
        <div className="relative w-full h-44 sm:h-52 bg-slate-950 overflow-hidden">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="absolute top-3.5 left-4 z-20">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-md backdrop-blur-md ${theme.badgeBg} ${theme.badgeText}`}>
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{badgeText}</span>
            </span>
          </div>
        </div>
      ) : (
        /* Image-less Warning Header */
        <div className={`p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 ${theme.lightBg} flex items-center gap-4`}>
          <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0 shadow-xs">
            {renderIcon()}
          </div>
          <div>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${theme.badgeBg} ${theme.badgeText}`}>
              <span>{badgeText}</span>
            </span>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1">
              {event.title}
            </h3>
          </div>
        </div>
      )}
    </div>
  );
};
