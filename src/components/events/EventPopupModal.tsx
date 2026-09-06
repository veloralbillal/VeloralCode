import React from 'react';
import { EventItem } from '../../types/event';
import { WarningPopupHeader } from './popup/WarningPopupHeader';
import { WarningPopupBody } from './popup/WarningPopupBody';
import { WarningPopupActions } from './popup/WarningPopupActions';
import { POPUP_THEMES } from './popup/WarningPopupTheme';

interface EventPopupModalProps {
  isOpen: boolean;
  event: EventItem | null;
  onClose: () => void;
  onNavigate?: (tab: string) => void;
  previewMode?: boolean;
}

export const EventPopupModal: React.FC<EventPopupModalProps> = ({
  isOpen,
  event,
  onClose,
  onNavigate,
  previewMode = false,
}) => {
  if (!isOpen || !event) return null;

  const popupType = event.popupType || 'warning';
  const theme = POPUP_THEMES[popupType] || POPUP_THEMES.warning;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className={`relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border ${theme.borderColor} overflow-hidden my-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Warning Header with Badge & Image or Icon */}
        <WarningPopupHeader event={event} onClose={onClose} />

        {/* Warning Content Body */}
        <WarningPopupBody event={event} />

        {/* Action Controls (link optional & I Understand button) */}
        <WarningPopupActions
          event={event}
          onClose={onClose}
          onNavigate={onNavigate}
          previewMode={previewMode}
        />
      </div>
    </div>
  );
};
