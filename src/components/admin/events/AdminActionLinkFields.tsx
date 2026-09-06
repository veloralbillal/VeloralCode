import React from 'react';
import { Link as LinkIcon } from 'lucide-react';

interface AdminActionLinkFieldsProps {
  actionUrl: string;
  actionLabel: string;
  onChange: (fields: { actionUrl?: string; actionLabel?: string }) => void;
}

export const AdminActionLinkFields: React.FC<AdminActionLinkFieldsProps> = ({
  actionUrl,
  actionLabel,
  onChange,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <LinkIcon className="w-3.5 h-3.5 text-indigo-500" />
          <span>Action Link & Button</span>
          <span className="text-slate-400 font-normal">(Optional)</span>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div className="sm:col-span-2">
          <input
            type="url"
            value={actionUrl}
            onChange={(e) => onChange({ actionUrl: e.target.value })}
            placeholder="https://example.com/page or telegram link"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-hidden transition"
          />
        </div>
        <div>
          <input
            type="text"
            value={actionLabel}
            onChange={(e) => onChange({ actionLabel: e.target.value })}
            placeholder="Button text (e.g. Check Details)"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-hidden transition"
          />
        </div>
      </div>
      <p className="text-[10px] text-slate-400">
        If left blank, the popup will show a clean "I Understand" acknowledgement button.
      </p>
    </div>
  );
};
