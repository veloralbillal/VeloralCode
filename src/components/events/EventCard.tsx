import React from 'react';
import { Calendar, MapPin, Tag, ArrowRight, CheckCircle2 } from 'lucide-react';
import { EventItem } from '../../types/event';
import { formatActionLabel } from './eventUtils';

interface EventCardProps {
  event: EventItem;
  onSelect: (event: EventItem) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onSelect }) => {
  const currency = event.currency || '৳';
  const hasDownPrice = typeof event.downPrice === 'number' && event.downPrice > 0;
  const savings = hasDownPrice && event.price > event.downPrice
    ? Math.round(((event.price - event.downPrice) / event.price) * 100)
    : 0;

  return (
    <div
      onClick={() => onSelect(event)}
      className="group flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-300 cursor-pointer"
    >
      {/* Event Cover Image */}
      <div className="relative w-full h-48 sm:h-52 overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm ${
              event.status === 'active'
                ? 'bg-emerald-500/90 text-white'
                : event.status === 'upcoming'
                ? 'bg-amber-500/90 text-white'
                : 'bg-slate-700/90 text-slate-200'
            }`}
          >
            {event.status}
          </span>
        </div>

        {/* Savings Badge */}
        {savings > 0 && (
          <div className="absolute top-3 right-3 bg-rose-500 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-md animate-pulse">
            SAVE {savings}%
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {event.eventDate && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>{event.eventDate}</span>
            </div>
          )}

          <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {event.title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {event.description}
          </p>

          {event.eventLocation && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{event.eventLocation}</span>
            </div>
          )}
        </div>

        {/* Price & Down Price Area */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 line-through">
                {currency}{event.price.toLocaleString()}
              </span>
              <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                Down Price
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-baseline">
              <span className="text-base text-indigo-600 dark:text-indigo-400 mr-0.5">{currency}</span>
              <span>{event.downPrice ? event.downPrice.toLocaleString() : event.price.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(event);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 active:scale-95 cursor-pointer"
          >
            <span>{formatActionLabel(event.actionLabel)}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
