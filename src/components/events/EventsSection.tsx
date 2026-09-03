import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { EventItem } from '../../types/event';
import { subscribeToActiveEvents } from '../../services/eventService';
import { EventCard } from './EventCard';
import { EventDetailsModal } from './EventDetailsModal';

interface EventsSectionProps {
  onNavigate: (route: string) => void;
}

export const EventsSection: React.FC<EventsSectionProps> = ({ onNavigate }) => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  useEffect(() => {
    const unsub = subscribeToActiveEvents((list) => {
      setEvents(list.slice(0, 3)); // show top 3 on home section
    });
    return () => unsub();
  }, []);

  if (events.length === 0) return null;

  return (
    <div className="space-y-6 pt-2">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Featured Workshops & Masterclasses</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Upcoming Events & Bootcamps
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Register with discounted down prices for live coding sessions, certification sprints, and developer workshops.
          </p>
        </div>

        <button
          onClick={() => onNavigate('#/events')}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <span>View All Events</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((ev) => (
          <EventCard key={ev.id} event={ev} onSelect={(item) => setSelectedEvent(item)} />
        ))}
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
};
