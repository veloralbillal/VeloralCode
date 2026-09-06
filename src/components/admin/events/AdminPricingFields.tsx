import React, { useState } from 'react';
import { ChevronDown, ChevronUp, DollarSign } from 'lucide-react';

interface AdminPricingFieldsProps {
  price: number | string;
  downPrice: number | string;
  currency: string;
  eventDate: string;
  eventLocation: string;
  onChange: (fields: {
    price?: number | string;
    downPrice?: number | string;
    currency?: string;
    eventDate?: string;
    eventLocation?: string;
  }) => void;
}

export const AdminPricingFields: React.FC<AdminPricingFieldsProps> = ({
  price,
  downPrice,
  currency,
  eventDate,
  eventLocation,
  onChange,
}) => {
  const [expanded, setExpanded] = useState(Boolean(price || downPrice || eventDate));

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/40">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition"
      >
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Event Pricing & Location Details
          </span>
          <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>

      {expanded && (
        <div className="p-3.5 pt-0 space-y-3 border-t border-slate-100 dark:border-slate-800">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Regular Price
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => onChange({ price: e.target.value })}
                placeholder="e.g. 1500"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Down Payment
              </label>
              <input
                type="number"
                value={downPrice}
                onChange={(e) => onChange({ downPrice: e.target.value })}
                placeholder="e.g. 500"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Currency Symbol
              </label>
              <input
                type="text"
                value={currency}
                onChange={(e) => onChange({ currency: e.target.value })}
                placeholder="৳"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Event Date & Time
              </label>
              <input
                type="text"
                value={eventDate}
                onChange={(e) => onChange({ eventDate: e.target.value })}
                placeholder="e.g. 15 October, 2026 at 8:00 PM"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Location / Platform
              </label>
              <input
                type="text"
                value={eventLocation}
                onChange={(e) => onChange({ eventLocation: e.target.value })}
                placeholder="Online / Live Google Meet"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
