import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit3, Trash2, Calendar, MapPin, Tag, ExternalLink } from 'lucide-react';
import { EventItem } from '../../types/event';
import {
  subscribeToAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../../services/eventService';
import { AdminEventModal } from './AdminEventModal';
import { DeleteConfirmModal } from '../common/Modal';
import { useToast } from '../../context/ToastContext';

export const AdminEvents: React.FC = () => {
  const { showToast } = useToast();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<EventItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const unsub = subscribeToAllEvents((list) => {
      setEvents(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleCreateOrUpdate = async (data: Omit<EventItem, 'id' | 'createdAt'>) => {
    if (editingEvent) {
      await updateEvent(editingEvent.id, data);
    } else {
      await createEvent(data);
    }
  };

  const handleDelete = async () => {
    if (!deletingEvent) return;
    try {
      setDeleteLoading(true);
      await deleteEvent(deletingEvent.id);
      showToast('Event deleted successfully', 'success');
      setDeletingEvent(null);
    } catch (err: any) {
      showToast('Failed to delete event', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-500" />
            <span>Event Management</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              {events.length}
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Create events with Title, Description, Regular Price, Down Price, and Image Upload.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingEvent(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Event</span>
        </button>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <Calendar className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Events Created Yet</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Click "Add New Event" to publish workshops, bootcamps, and discount down payments.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((ev) => {
            const currency = ev.currency || '৳';
            return (
              <div
                key={ev.id}
                className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition-all"
              >
                {/* Event Cover */}
                <div className="relative w-full h-44 bg-slate-950 overflow-hidden">
                  <img
                    src={ev.imageUrl}
                    alt={ev.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />

                  {/* Status */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        ev.status === 'active'
                          ? 'bg-emerald-500 text-white'
                          : ev.status === 'upcoming'
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {ev.status}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3">
                    <h4 className="text-sm font-bold text-white line-clamp-1">{ev.title}</h4>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {ev.description}
                  </p>

                  {/* Pricing Box */}
                  <div className="p-2.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 line-through">
                        Reg: {currency}{ev.price.toLocaleString()}
                      </span>
                      <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <span>Down:</span>
                        <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                          {currency}{ev.downPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {ev.eventDate && (
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate max-w-[120px]">
                        {ev.eventDate}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-1">
                    <button
                      onClick={() => {
                        setEditingEvent(ev);
                        setModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-colors cursor-pointer"
                      title="Edit Event"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingEvent(ev)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors cursor-pointer"
                      title="Delete Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Event Create / Edit Modal */}
      <AdminEventModal
        isOpen={modalOpen}
        event={editingEvent}
        onClose={() => {
          setModalOpen(false);
          setEditingEvent(null);
        }}
        onSave={handleCreateOrUpdate}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingEvent}
        title="Delete Event"
        itemTitle={deletingEvent?.title}
        message="Are you sure you want to permanently delete this event? This action cannot be undone."
        loading={deleteLoading}
        onConfirm={handleDelete}
        onClose={() => setDeletingEvent(null)}
      />
    </div>
  );
};
