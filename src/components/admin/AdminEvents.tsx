import React, { useState, useEffect } from 'react';
import { PlusCircle, Calendar, AlertTriangle } from 'lucide-react';
import { EventItem } from '../../types/event';
import {
  subscribeToAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  setEventAsPopup,
} from '../../services/eventService';
import { AdminEventModal } from './AdminEventModal';
import { EventPopupModal } from '../events/EventPopupModal';
import { DeleteConfirmModal } from '../common/Modal';
import { AdminActivePopupBanner } from './events/AdminActivePopupBanner';
import { AdminEventCard } from './events/AdminEventCard';
import { useToast } from '../../context/ToastContext';

export const AdminEvents: React.FC = () => {
  const { showToast } = useToast();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<EventItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [previewEvent, setPreviewEvent] = useState<EventItem | null>(null);

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

  const handleTogglePopup = async (ev: EventItem) => {
    try {
      const nextState = !ev.isPopup;
      await setEventAsPopup(ev.id, nextState);
      showToast(
        nextState ? `"${ev.title}" is now the active popup warning!` : 'Popup deactivated.',
        'success'
      );
    } catch (err: any) {
      showToast('Failed to update popup status', 'error');
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

  const activePopup = events.find((e) => e.isPopup);

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-500" />
            <span>Event & Warning Popup Management</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              {events.length}
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Create warning popups with optional image and link, targeted to user, creator, or seller accounts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingEvent(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Warning / Event</span>
        </button>
      </div>

      {/* Active User Warning Popup Banner */}
      {activePopup && (
        <AdminActivePopupBanner
          activeEvent={activePopup}
          onPreview={(ev) => setPreviewEvent(ev)}
          onDeactivate={(ev) => handleTogglePopup(ev)}
        />
      )}

      {/* Events Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <AlertTriangle className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Events or Popups Created Yet</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Click "Create Warning / Event" to publish targeted popups and notices.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((ev) => (
            <AdminEventCard
              key={ev.id}
              event={ev}
              onTogglePopup={handleTogglePopup}
              onPreview={(item) => setPreviewEvent(item)}
              onEdit={(item) => {
                setEditingEvent(item);
                setModalOpen(true);
              }}
              onDelete={(item) => setDeletingEvent(item)}
            />
          ))}
        </div>
      )}

      {/* Modal for Creating / Editing Events */}
      <AdminEventModal
        isOpen={modalOpen}
        event={editingEvent}
        onClose={() => {
          setModalOpen(false);
          setEditingEvent(null);
        }}
        onSave={handleCreateOrUpdate}
      />

      {/* Popup Live Preview */}
      <EventPopupModal
        isOpen={!!previewEvent}
        event={previewEvent}
        onClose={() => setPreviewEvent(null)}
        previewMode={true}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        isOpen={!!deletingEvent}
        title="Delete Event / Warning"
        itemTitle={deletingEvent?.title}
        message="Are you sure you want to delete this event or warning popup?"
        loading={deleteLoading}
        onConfirm={handleDelete}
        onClose={() => setDeletingEvent(null)}
      />
    </div>
  );
};
