import React, { useState, useEffect } from 'react';
import { X, Calendar, AlertTriangle, Eye, Check, Loader2 } from 'lucide-react';
import { EventItem, EventStatus, PopupType, TargetRole } from '../../types/event';
import { useToast } from '../../context/ToastContext';
import { AdminAudienceSelector } from './events/AdminAudienceSelector';
import { AdminWarningTypeSelector } from './events/AdminWarningTypeSelector';
import { AdminImageUploader } from './events/AdminImageUploader';
import { AdminActionLinkFields } from './events/AdminActionLinkFields';
import { AdminPricingFields } from './events/AdminPricingFields';
import { EventPopupModal } from '../events/EventPopupModal';

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
  const [actionLabel, setActionLabel] = useState('');
  const [status, setStatus] = useState<EventStatus>('active');
  const [isPopup, setIsPopup] = useState(true);
  const [popupBadge, setPopupBadge] = useState('⚠️ Important Notice');
  const [popupType, setPopupType] = useState<PopupType>('warning');
  const [targetRoles, setTargetRoles] = useState<TargetRole[]>(['all']);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (event) {
      setTitle(event.title || '');
      setDescription(event.description || '');
      setPrice(event.price !== undefined ? event.price : '');
      setDownPrice(event.downPrice !== undefined ? event.downPrice : '');
      setCurrency(event.currency || '৳');
      setImageUrl(event.imageUrl || '');
      setEventDate(event.eventDate || '');
      setEventLocation(event.eventLocation || '');
      setActionUrl(event.actionUrl || '');
      setActionLabel(event.actionLabel || '');
      setStatus(event.status || 'active');
      setIsPopup(event.isPopup !== undefined ? event.isPopup : true);
      setPopupBadge(event.popupBadge || '⚠️ Important Notice');
      setPopupType(event.popupType || 'warning');
      setTargetRoles(event.targetRoles && event.targetRoles.length > 0 ? event.targetRoles : ['all']);
    } else {
      setTitle('');
      setDescription('');
      setPrice('');
      setDownPrice('');
      setCurrency('৳');
      setImageUrl('');
      setEventDate('');
      setEventLocation('');
      setActionUrl('');
      setActionLabel('');
      setStatus('active');
      setIsPopup(true);
      setPopupBadge('⚠️ Important Notice');
      setPopupType('warning');
      setTargetRoles(['all']);
    }
  }, [event, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Notice / Event title is required', 'warning');
      return;
    }
    if (!description.trim()) {
      showToast('Notice / Event description is required', 'warning');
      return;
    }

    try {
      setSaving(true);
      await onSave({
        title: title.trim(),
        description: description.trim(),
        price: price !== '' && !isNaN(Number(price)) ? Number(price) : null,
        downPrice: downPrice !== '' && !isNaN(Number(downPrice)) ? Number(downPrice) : null,
        currency: currency.trim() || '৳',
        imageUrl: imageUrl.trim(),
        eventDate: eventDate.trim(),
        eventLocation: eventLocation.trim(),
        actionUrl: actionUrl.trim(),
        actionLabel: actionLabel.trim(),
        status,
        isPopup,
        popupBadge: popupBadge.trim() || '⚠️ Notice',
        popupType,
        targetRoles: targetRoles.length > 0 ? targetRoles : ['all'],
      });
      showToast(event ? 'Event/Warning updated!' : 'Event/Warning published!', 'success');
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  };

  const previewItem: EventItem = {
    id: 'preview',
    title: title || 'Warning Notice Headline',
    description: description || 'Detailed announcement and instructions will appear here.',
    price: price !== '' ? Number(price) : undefined,
    downPrice: downPrice !== '' ? Number(downPrice) : undefined,
    currency,
    imageUrl,
    eventDate,
    eventLocation,
    actionUrl,
    actionLabel,
    status,
    isPopup: true,
    popupBadge,
    popupType,
    targetRoles,
    createdAt: Date.now(),
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
        <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  {event ? 'Edit Warning / Event' : 'Create Warning Notice / Event'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Target user, creator, or seller accounts with popup warnings
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Notice / Event Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. System Maintenance Notice / Platform Rule Update"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-hidden transition"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Description / Message <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Provide clear notice details, policy warnings, or event steps..."
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-hidden transition"
              />
            </div>

            {/* Popup Toggle & Style Selection */}
            <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>Show as Auto-Popup Modal</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-200/80 dark:bg-amber-900/80 text-amber-800 dark:text-amber-300 font-bold">
                      POPUP
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Automatically opens as a modal window when targeted users enter the site
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={isPopup}
                  onChange={(e) => setIsPopup(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
              </div>

              {isPopup && (
                <div className="space-y-3 pt-2 border-t border-amber-200/40 dark:border-amber-900/40">
                  <AdminWarningTypeSelector
                    selectedType={popupType}
                    onChange={setPopupType}
                  />

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Popup Badge Text
                    </label>
                    <input
                      type="text"
                      value={popupBadge}
                      onChange={(e) => setPopupBadge(e.target.value)}
                      placeholder="e.g. ⚠️ WARNING, 🚨 CRITICAL, 📢 ANNOUNCEMENT"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Target Audience Selector (User, Creator, Seller, All) */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800">
              <AdminAudienceSelector
                selectedRoles={targetRoles}
                onChange={setTargetRoles}
              />
            </div>

            {/* Optional Image */}
            <AdminImageUploader
              imageUrl={imageUrl}
              onChange={setImageUrl}
            />

            {/* Optional Link */}
            <AdminActionLinkFields
              actionUrl={actionUrl}
              actionLabel={actionLabel}
              onChange={({ actionUrl: u, actionLabel: l }) => {
                if (u !== undefined) setActionUrl(u);
                if (l !== undefined) setActionLabel(l);
              }}
            />

            {/* Optional Pricing */}
            <AdminPricingFields
              price={price}
              downPrice={downPrice}
              currency={currency}
              eventDate={eventDate}
              eventLocation={eventLocation}
              onChange={(f) => {
                if (f.price !== undefined) setPrice(f.price);
                if (f.downPrice !== undefined) setDownPrice(f.downPrice);
                if (f.currency !== undefined) setCurrency(f.currency);
                if (f.eventDate !== undefined) setEventDate(f.eventDate);
                if (f.eventLocation !== undefined) setEventLocation(f.eventLocation);
              }}
            />

            {/* Status Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Publication Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as EventStatus)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
              >
                <option value="active">Active (Currently Live)</option>
                <option value="upcoming">Upcoming (Scheduled)</option>
                <option value="ended">Ended (Archived)</option>
              </select>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-indigo-500" />
                <span>Preview Popup</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition disabled:opacity-50 cursor-pointer"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{event ? 'Update' : 'Publish'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Live Preview Modal */}
      {showPreview && (
        <EventPopupModal
          isOpen={showPreview}
          event={previewItem}
          onClose={() => setShowPreview(false)}
          previewMode={true}
        />
      )}
    </>
  );
};
