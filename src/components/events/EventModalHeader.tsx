import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { EventItem } from '../../types/event';

interface EventModalHeaderProps {
  event: EventItem;
  savings: number;
  onClose: () => void;
}

export const EventModalHeader: React.FC<EventModalHeaderProps> = ({
  event,
  savings,
  onClose,
}) => {
  return (
    <div className="relative w-full h-40 sm:h-56 md:h-64 bg-slate-950 shrink-0 select-none">
      {/* Cover Image */}
      <img
        src={event.imageUrl}
        alt={event.title}
        className="w-full h-full object-cover object-center"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent pointer-events-none" />

      {/* Top Left: Event Status Badge */}
      <div className="absolute top-3 left-3 z-10">
        <span
          className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-md backdrop-blur-md ${
            event.status === 'active'
              ? 'bg-emerald-500/95 text-white'
              : event.status === 'upcoming'
              ? 'bg-amber-500/95 text-white'
              : 'bg-slate-700/95 text-slate-200'
          }`}
        >
          {event.status} Event
        </span>
      </div>

      {/* Top Right: Close Button */}
      <button
        onClick={onClose}
        aria-label="Close dialog"
        className="absolute top-3 right-3 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white backdrop-blur-md flex items-center justify-center shadow-lg border border-white/20 transition-transform active:scale-90 cursor-pointer"
      >
        <X className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Bottom Left: Savings Badge (Clean, compact, no overlap) */}
      {savings > 0 && (
        <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10">
          <span className="inline-flex items-center gap-1 bg-gradient-to-r from-rose-500 to-pink-600 text-white text-[11px] sm:text-xs font-black px-2.5 sm:px-3 py-1 rounded-full shadow-lg">
            <Sparkles className="w-3 h-3 shrink-0" />
            <span>SAVE {savings}%</span>
          </span>
        </div>
      )}
    </div>
  );
};
