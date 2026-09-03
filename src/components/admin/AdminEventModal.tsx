import React, { useState, useEffect } from 'react';
import { X, Upload, Calendar, DollarSign, Tag, Image as ImageIcon, MapPin, Link as LinkIcon } from 'lucide-react';
import { EventItem, EventStatus } from '../../types/event';
import { useToast } from '../../context/ToastContext';

interface AdminEventModalProps {
  isOpen: boolean;
  event: EventItem | null;
  onClose: () => void;
  onSave: (data: Omit<EventItem, 'id' | 'createdAt'>) => Promise<void>;
}

export const AdminEventModal: React.FC<AdminEventModalProps> = ({
  isOpen,
  event,
  onClose,
  onSave,
}) => {
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | string>('');
  const [downPrice, setDownPrice] = useState<number | string>('');
  const [currency, setCurrency] = useState('৳');
  const [imageUrl, setImageUrl] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [actionUrl, setActionUrl] = useState('');
  const [actionLabel, setActionLabel] = useState('Book Down Payment');
  const [status, setStatus] = useState<EventStatus>('active');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (event) {
      setTitle(event.title || '');
      setDescription(event.description || '');
      setPrice(event.price ?? '');
      setDownPrice(event.downPrice ?? '');
      setCurrency(event.currency || '৳');
      setImageUrl(event.imageUrl || '');
      setEventDate(event.eventDate || '');
      setEventLocation(event.eventLocation || '');
      setActionUrl(event.actionUrl || '');
      setActionLabel(event.actionLabel || 'Buy');
      setStatus(event.status || 'active');
    } else {
      setTitle('');
      setDescription('');
      setPrice('');
      setDownPrice('');
      setCurrency('৳');
      setImageUrl('');
      setEventDate('');
      setEventLocation('Online (Live Workshop)');
      setActionUrl('');
      setActionLabel('Buy');
      setStatus('active');
    }
  }, [event, isOpen]);

  if (!isOpen) return null;

  // Handle local image file upload (converts to Base64)
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file (PNG, JPG, WebP)', 'warning');
      return;
    }

    if (file.size > 2.5 * 1024 * 1024) {
      showToast('Image file must be under 2.5MB', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result as string);
      showToast('Image loaded successfully!', 'success');
    };
    reader.onerror = () => {
      showToast('Error reading image file', 'error');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Event title is required', 'warning');
      return;
    }
    if (!description.trim()) {
      showToast('Event description is required', 'warning');
      return;
    }
    if (price === '' || isNaN(Number(price))) {
      showToast('Please enter a valid regular price', 'warning');
      return;
    }
    if (downPrice === '' || isNaN(Number(downPrice))) {
      showToast('Please enter a valid down price', 'warning');
      return;
    }
    if (!imageUrl.trim()) {
      showToast('Please upload an image or provide an image URL', 'warning');
      return;
    }

    try {
      setSaving(true);
      await onSave({
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        downPrice: Number(downPrice),
        currency: currency.trim() || '৳',
        imageUrl: imageUrl.trim(),
        eventDate: eventDate.trim(),
        eventLocation: eventLocation.trim(),
        actionUrl: actionUrl.trim(),
        actionLabel: actionLabel.trim() || 'Buy',
        status,
      });
      showToast(event ? 'Event updated successfully!' : 'Event published successfully!', 'success');
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Failed to save event', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                {event ? 'Edit Event' : 'Create New Event'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Event title, pricing, down price, and banner cover
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Event Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Masterclass on React & Modern Web APIs"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description *
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the workshop schedule, learning outcomes, tools covered, certificates..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              required
            />
          </div>

          {/* Price & Down Price Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Currency Symbol
              </label>
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                placeholder="৳, $, etc."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Regular Price *
              </label>
              <input
                type="number"
                min={0}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 3000"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                Down Price (Offer / Booking) *
              </label>
              <input
                type="number"
                min={0}
                value={downPrice}
                onChange={(e) => setDownPrice(e.target.value)}
                placeholder="e.g. 1000"
                className="w-full px-3 py-2 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-800 text-xs text-emerald-600 dark:text-emerald-400 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                required
              />
            </div>
          </div>

          {/* Image Upload Area */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Event Cover Image * (Upload or URL)
            </label>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-indigo-300 dark:border-indigo-700 bg-indigo-50/50 dark:bg-indigo-950/30 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold cursor-pointer transition-colors">
                  <Upload className="w-4 h-4" />
                  <span>Upload Image from Device</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                </label>
                <span className="text-xs text-slate-400">or paste image link</span>
              </div>

              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... or base64 data"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />

              {imageUrl && (
                <div className="relative w-full h-36 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-950">
                  <img
                    src={imageUrl}
                    alt="Event Preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="absolute top-2 right-2 p-1 rounded-md bg-rose-600 text-white text-[10px] font-bold hover:bg-rose-500"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Date, Location, Action */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Event Date & Time
              </label>
              <input
                type="text"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                placeholder="e.g. October 15, 2026 - 8:00 PM"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Location or Platform
              </label>
              <input
                type="text"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                placeholder="e.g. Google Meet, Zoom, Dhaka Lab"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Registration / Action Link
              </label>
              <input
                type="text"
                value={actionUrl}
                onChange={(e) => setActionUrl(e.target.value)}
                placeholder="https://t.me/BillalHossen"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Button Label
              </label>
              <input
                type="text"
                value={actionLabel}
                onChange={(e) => setActionLabel(e.target.value)}
                placeholder="Buy"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as EventStatus)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="active">Active (Registration Open)</option>
                <option value="upcoming">Upcoming (Coming Soon)</option>
                <option value="ended">Ended (Closed)</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {saving ? 'Saving...' : event ? 'Update Event' : 'Publish Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
