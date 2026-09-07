import React from 'react';
import { Phone, Calendar, Clock, PlusCircle, CheckCircle, ChevronRight, MessageSquare } from 'lucide-react';
import { Customer } from '../types';
import { formatTaka, formatDateTime } from '../utils/bakiUtils';

interface CustomerCardProps {
  customer: Customer;
  onOpenAddDue: (customer: Customer) => void;
  onOpenPayment: (customer: Customer) => void;
  onViewDetails: (customer: Customer) => void;
}

export const CustomerCard: React.FC<CustomerCardProps> = ({
  customer,
  onOpenAddDue,
  onOpenPayment,
  onViewDetails,
}) => {
  const hasDue = customer.totalDue > 0;

  const handleWhatsAppReminder = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!customer.phone) return;
    const cleanPhone = customer.phone.replace(/[^0-9]/g, '');
    const intlPhone = cleanPhone.startsWith('0') ? '88' + cleanPhone : cleanPhone;
    const message = encodeURIComponent(
      `Hello ${customer.name}, your current outstanding credit balance at our shop is ${formatTaka(customer.totalDue)}. Please settle it at your earliest convenience. Thank you!`
    );
    window.open(`https://wa.me/${intlPhone}?text=${message}`, '_blank');
  };

  return (
    <div
      onClick={() => onViewDetails(customer)}
      className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition cursor-pointer flex flex-col justify-between gap-4 group"
    >
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
              {customer.name}
            </h3>
            {customer.phone && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{customer.phone}</span>
              </div>
            )}
            {customer.address && (
              <p className="text-[11px] text-slate-400 truncate mt-0.5">
                📍 {customer.address}
              </p>
            )}
          </div>

          {/* Due amount badge */}
          <div className="text-right shrink-0">
            <span
              className={`inline-block px-3 py-1 rounded-xl text-sm font-black ${
                hasDue
                  ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                  : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
              }`}
            >
              {hasDue ? `Due: ${formatTaka(customer.totalDue)}` : 'Paid in Full'}
            </span>
          </div>
        </div>

        {/* Badges and Timestamp */}
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px]">
          {customer.settlesOnTuesday && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-800">
              <Calendar className="w-3 h-3" />
              <span>Tuesday Settlement</span>
            </span>
          )}

          <div className="flex items-center gap-1 text-slate-400 ml-auto">
            <Clock className="w-3 h-3" />
            <span>Last Activity: {formatDateTime(customer.lastActivityAt)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => onOpenAddDue(customer)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition border border-rose-200/60 dark:border-rose-800"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>+ Due</span>
        </button>

        <button
          onClick={() => onOpenPayment(customer)}
          disabled={!hasDue}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition border ${
            hasDue
              ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border-emerald-200/60 dark:border-emerald-800'
              : 'text-slate-400 bg-slate-100 dark:bg-slate-800 border-transparent cursor-not-allowed opacity-50'
          }`}
        >
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Collect</span>
        </button>

        {hasDue && customer.phone && (
          <button
            onClick={handleWhatsAppReminder}
            title="Send friendly reminder on WhatsApp"
            className="p-2 rounded-xl text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition border border-emerald-200 dark:border-emerald-800"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          onClick={() => onViewDetails(customer)}
          title="View Full Statement"
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
