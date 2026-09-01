import React from 'react';
import { Send, MessageSquareCode, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';
import { useSiteConfig } from '../../context/SiteConfigContext';

interface ContactAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  userNumericUid?: string;
}

export const ContactAdminModal: React.FC<ContactAdminModalProps> = ({
  isOpen,
  onClose,
  userEmail = '',
  userNumericUid = '',
}) => {
  const { siteConfig } = useSiteConfig();

  if (!isOpen) return null;

  // Dynamic admin contact configurations from Firebase
  const rawTelegram = siteConfig?.telegramUsername || 'BillalHossen';
  const cleanTelegram = rawTelegram.trim().replace(/^@/, '').replace(/^https?:\/\/t\.me\//, '');

  const rawWhatsapp = siteConfig?.whatsappNumber || '8801700000000';
  const cleanWhatsapp = rawWhatsapp.trim().replace(/[^0-9]/g, '');

  const uidDisplay = userNumericUid || 'N/A';
  const emailDisplay = userEmail || '—';

  // Construct message using admin's template if available
  let messageBody = siteConfig?.contactMessageTemplate ||
    'Hello Admin, I want to purchase / renew a Premium Pro License Key for my account (My UID: {uid}) - Email: {email}. Please share the payment methods and details.';
  
  messageBody = messageBody
    .replace(/{uid}/g, uidDisplay)
    .replace(/{email}/g, emailDisplay);

  const encodedMsg = encodeURIComponent(messageBody);

  const telegramUrl = cleanTelegram
    ? `https://t.me/${cleanTelegram}?text=${encodedMsg}`
    : '#';
  const whatsappUrl = cleanWhatsapp
    ? `https://wa.me/${cleanWhatsapp}?text=${encodedMsg}`
    : '#';

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Get / Renew License Key
              </h3>
              <p className="text-[11px] text-slate-500">
                Contact Admin directly via Telegram or WhatsApp
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xs font-bold p-1"
          >
            ✕
          </button>
        </div>

        {/* User Info Confirmation */}
        <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/40 text-xs space-y-1 text-slate-700 dark:text-slate-300">
          <div className="flex items-center justify-between font-bold">
            <span>Your Account UID:</span>
            <span className="font-mono text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800">
              {uidDisplay}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>Email:</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">{emailDisplay}</span>
          </div>
          <p className="text-[10px] text-slate-400 pt-1">
            Your UID will be automatically included in the message for instant activation.
          </p>
        </div>

        {/* Channels */}
        <div className="space-y-2.5">
          {/* Telegram */}
          {cleanTelegram && (
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-sky-500/10 hover:bg-sky-500/15 border border-sky-500/25 text-sky-600 dark:text-sky-400 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-xs">
                  <Send className="w-4 h-4 -rotate-45" />
                </div>
                <div className="text-left">
                  <span className="block text-xs font-bold text-slate-900 dark:text-white group-hover:text-sky-500 transition">
                    Contact on Telegram
                  </span>
                  <span className="text-[11px] text-slate-500">@{cleanTelegram} (Fastest response)</span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-sky-500 transition" />
            </a>
          )}

          {/* WhatsApp */}
          {cleanWhatsapp && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                  <MessageSquareCode className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="block text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition">
                    Contact on WhatsApp
                  </span>
                  <span className="text-[11px] text-slate-500">Direct Chat & Support</span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition" />
            </a>
          )}
        </div>

        {/* Benefits badge */}
        <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Instant key delivery & automated 1-click redemption.</span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};
