import React from 'react';
import { Sparkles, AlertTriangle, ShieldAlert, Info, Edit3, Trash2, Eye, Users, User, Palette, Coins } from 'lucide-react';
import { EventItem, TargetRole } from '../../../types/event';

interface AdminEventCardProps {
  event: EventItem;
  onTogglePopup: (event: EventItem) => void;
  onPreview: (event: EventItem) => void;
  onEdit: (event: EventItem) => void;
  onDelete: (event: EventItem) => void;
}

export const AdminEventCard: React.FC<AdminEventCardProps> = ({
  event,
  onTogglePopup,
  onPreview,
  onEdit,
  onDelete,
}) => {
  const currency = event.currency || '৳';
  const roles = event.targetRoles && event.targetRoles.length > 0 ? event.targetRoles : ['all'];

  const renderRoleBadge = (role: TargetRole) => {
    switch (role) {
      case 'user':
        return (
          <span key={role} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
            <User className="w-2.5 h-2.5" />
            <span>Users</span>
          </span>
        );
      case 'creator':
        return (
          <span key={role} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            <Palette className="w-2.5 h-2.5" />
            <span>Creators</span>
          </span>
        );
      case 'seller':
        return (
          <span key={role} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <Coins className="w-2.5 h-2.5" />
            <span>Sellers</span>
          </span>
        );
      case 'all':
      default:
        return (
          <span key={role} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            <Users className="w-2.5 h-2.5" />
            <span>All Accounts</span>
          </span>
        );
    }
  };

  return (
    <div className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition-all">
      {/* Event Cover or Warning Banner */}
      <div className="relative w-full h-40 bg-slate-950 overflow-hidden">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-amber-950/70 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-1">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono text-amber-400/80">NO IMAGE (CLEAN NOTICE)</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              event.status === 'active'
                ? 'bg-emerald-500 text-white'
                : event.status === 'upcoming'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-700 text-slate-300'
            }`}
          >
            {event.status}
          </span>
          {event.isPopup && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white shadow-md flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              <span>POPUP</span>
            </span>
          )}
        </div>

        <div className="absolute bottom-2.5 left-3 right-3">
          <h4 className="text-sm font-bold text-white line-clamp-1">{event.title}</h4>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
            {event.description}
          </p>

          {/* Target Audience row */}
          <div className="pt-2.5 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-medium text-slate-400">Target:</span>
            {roles.map(renderRoleBadge)}
          </div>
        </div>

        {/* Pricing / Details Box if present */}
        {((event.price !== undefined && event.price > 0) || (event.downPrice !== undefined && event.downPrice > 0)) && (
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">Down Payment:</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">
              {currency}{(event.downPrice || 0).toLocaleString()}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => onTogglePopup(event)}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer ${
              event.isPopup
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-indigo-950/60'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>{event.isPopup ? 'Popup Active' : 'Set Popup'}</span>
          </button>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onPreview(event)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition cursor-pointer"
              title="Preview Popup"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onEdit(event)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition cursor-pointer"
              title="Edit Event & Audience"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(event)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition cursor-pointer"
              title="Delete Event"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
