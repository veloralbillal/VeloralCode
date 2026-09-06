import React from 'react';
import { Calendar, MapPin, Tag } from 'lucide-react';
import { EventItem } from '../../../types/event';

interface WarningPopupBodyProps {
  event: EventItem;
}

export const WarningPopupBody: React.FC<WarningPopupBodyProps> = ({ event }) => {
  const currency = event.currency || '৳';
  const hasPricing = (event.price !== undefined && event.price > 0) || (event.downPrice !== undefined && event.downPrice > 0);

  return (
    <div className="p-5 sm:p-6 space-y-4">
      {/* If there was an image, show title here */}
      {event.imageUrl && (
        <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-snug">
          {event.title}
        </h3>
      )}

      {/* Optional Metadata Row (Date / Location) */}
      {(event.eventDate || event.eventLocation) && (
        <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400">
          {event.eventDate && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-medium">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" />
              <span>{event.eventDate}</span>
            </span>
          )}
          {event.eventLocation && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-medium">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>{event.eventLocation}</span>
            </span>
          )}
        </div>
      )}

      {/* Description */}
      <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line max-h-56 overflow-y-auto scrollbar-thin pr-1">
        {event.description}
      </div>

      {/* Optional Pricing Highlight Box (only if pricing exists) */}
      {hasPricing && (
        <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-between">
          <div>
            {event.price !== undefined && event.price > 0 && (
              <span className="text-[11px] text-slate-400 line-through">
                Regular: {currency}{event.price.toLocaleString()}
              </span>
            )}
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <span>Down Payment:</span>
              <span className="text-base font-black text-indigo-600 dark:text-indigo-400">
                {currency}{(event.downPrice || 0).toLocaleString()}
              </span>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            Special Offer
          </span>
        </div>
      )}
    </div>
  );
};
