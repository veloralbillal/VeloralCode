import React, { useEffect } from 'react';
import { Calendar, MapPin, ShieldCheck } from 'lucide-react';
import { EventItem } from '../../types/event';
import { EventModalHeader } from './EventModalHeader';
import { EventPriceBox } from './EventPriceBox';
import { calculateSavings } from './eventUtils';

interface EventDetailsModalProps {
  event: EventItem | null;
  onClose: () => void;
}

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ event, onClose }) => {
  // Close on escape key
  useEffect(() => {
    if (!event) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [event, onClose]);

  if (!event) return null;

  const currency = event.currency || '৳';
  const savings = calculateSavings(event.price, event.downPrice);

  const handleAction = () => {
    if (event.actionUrl) {
      if (event.actionUrl.startsWith('http://') || event.actionUrl.startsWith('https://')) {
        window.open(event.actionUrl, '_blank', 'noopener,noreferrer');
      } else {
        window.location.hash = event.actionUrl.replace(/^#\/?/, '');
        onClose();
      }
    } else {
      window.open('https://t.me/BillalHossen', '_blank');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md overflow-hidden"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg sm:max-w-xl md:max-w-2xl bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] sm:max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Cover & Badges Header */}
        <EventModalHeader event={event} savings={savings} onClose={onClose} />

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-7 space-y-4 sm:space-y-5 overscroll-contain">
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white leading-tight sm:leading-snug">
              {event.title}
            </h2>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-medium text-slate-600 dark:text-slate-400 mt-2.5">
              {event.eventDate && (
                <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-semibold">
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  <span>{event.eventDate}</span>
                </div>
              )}
              {event.eventLocation && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 shrink-0" />
                  <span>{event.eventLocation}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Event Overview & Benefits
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* Pricing & Buy Action */}
          <EventPriceBox
            price={event.price}
            downPrice={event.downPrice}
            currency={currency}
            actionLabel={event.actionLabel}
            onAction={handleAction}
          />

          <div className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 shrink-0" />
            <span>Official event verified by CodeToolkit Administrator. Direct admission support provided.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
