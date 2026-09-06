import React from 'react';
import { AlertTriangle, ShieldAlert, Info, Sparkles } from 'lucide-react';
import { PopupType } from '../../../types/event';

interface AdminWarningTypeSelectorProps {
  selectedType: PopupType;
  onChange: (type: PopupType) => void;
}

const TYPE_OPTIONS: { id: PopupType; label: string; icon: React.ElementType; color: string }[] = [
  { id: 'warning', label: 'Warning Notice', icon: AlertTriangle, color: 'text-amber-500' },
  { id: 'alert', label: 'Urgent Alert', icon: ShieldAlert, color: 'text-rose-500' },
  { id: 'info', label: 'Announcement', icon: Info, color: 'text-sky-500' },
  { id: 'success', label: 'Event / Offer', icon: Sparkles, color: 'text-emerald-500' },
];

export const AdminWarningTypeSelector: React.FC<AdminWarningTypeSelectorProps> = ({
  selectedType,
  onChange,
}) => {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
        Popup Style / Severity
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {TYPE_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const active = selectedType === opt.id;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                active
                  ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 font-bold text-slate-900 dark:text-white'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-4 h-4 ${opt.color} shrink-0`} />
              <span className="text-xs truncate">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
