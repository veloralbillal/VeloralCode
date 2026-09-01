import React, { useState, useEffect } from 'react';
import {
  Send,
  MessageSquareCode,
  Save,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  PhoneCall,
  CheckCircle2,
} from 'lucide-react';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { SiteConfig } from '../../types';

export const AdminContactSettings: React.FC = () => {
  const { siteConfig, saveConfig, loading } = useSiteConfig();
  const { showToast } = useToast();
  const { currentUser } = useAuth();

  const [telegramUsername, setTelegramUsername] = useState(
    siteConfig.telegramUsername || 'BillalHossen'
  );
  const [whatsappNumber, setWhatsappNumber] = useState(
    siteConfig.whatsappNumber || '8801700000000'
  );
  const [messageTemplate, setMessageTemplate] = useState(
    siteConfig.contactMessageTemplate ||
      'Hello Admin, I want to purchase / renew a Premium Pro License Key for my account (My UID: {uid}) - Email: {email}. Please share the payment methods and details.'
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (siteConfig.telegramUsername !== undefined) {
      setTelegramUsername(siteConfig.telegramUsername);
    }
    if (siteConfig.whatsappNumber !== undefined) {
      setWhatsappNumber(siteConfig.whatsappNumber);
    }
    if (siteConfig.contactMessageTemplate !== undefined) {
      setMessageTemplate(siteConfig.contactMessageTemplate);
    }
  }, [siteConfig]);

  // Clean values for testing
  const cleanTelegram = telegramUsername.trim().replace(/^@/, '').replace(/^https?:\/\/t\.me\//, '');
  const cleanWhatsapp = whatsappNumber.trim().replace(/[^0-9]/g, '');

  const previewMessage = messageTemplate
    .replace('{uid}', '56840698')
    .replace('{email}', 'user@gmail.com');
  const encodedPreviewMsg = encodeURIComponent(previewMessage);

  const telegramPreviewUrl = cleanTelegram ? `https://t.me/${cleanTelegram}?text=${encodedPreviewMsg}` : '#';
  const whatsappPreviewUrl = cleanWhatsapp ? `https://wa.me/${cleanWhatsapp}?text=${encodedPreviewMsg}` : '#';

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cleanTelegram && !cleanWhatsapp) {
      showToast('Please provide at least one contact channel (Telegram or WhatsApp)', 'error');
      return;
    }

    setSaving(true);
    try {
      await saveConfig(
        {
          telegramUsername: cleanTelegram,
          whatsappNumber: cleanWhatsapp,
          contactMessageTemplate: messageTemplate.trim(),
        },
        currentUser?.email || 'Admin'
      );
      showToast('Telegram & WhatsApp contact settings saved successfully!', 'success');
    } catch (err: any) {
      showToast('Failed to save settings: ' + (err.message || 'Error occurred'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = () => {
    setTelegramUsername('BillalHossen');
    setWhatsappNumber('8801700000000');
    setMessageTemplate(
      'Hello Admin, I want to purchase / renew a Premium Pro License Key for my account (My UID: {uid}) - Email: {email}. Please share the payment methods and details.'
    );
    showToast('Reset fields to default values. Click "Save Changes" to apply.', 'info');
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200/60 dark:border-sky-800/60">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              License & Support Contact Channels (Telegram & WhatsApp)
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200/60 dark:border-sky-800/60">
                Direct Admin Link
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Set the official Telegram username and WhatsApp phone number used in the "Get / Renew License Key" modal across the user panel.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleResetDefaults}
          disabled={saving || loading}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Telegram Settings */}
          <div className="p-4 sm:p-5 rounded-2xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200/70 dark:border-sky-900/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-700 dark:text-sky-300">
                <div className="w-6 h-6 rounded-lg bg-sky-500 text-white flex items-center justify-center">
                  <Send className="w-3.5 h-3.5 -rotate-45" />
                </div>
                <span>Telegram Support Handle</span>
              </div>
              {cleanTelegram && (
                <a
                  href={telegramPreviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-600 hover:underline"
                >
                  <span>Test Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Username or Channel Name
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">@</span>
                <input
                  type="text"
                  value={telegramUsername}
                  onChange={(e) => setTelegramUsername(e.target.value)}
                  placeholder="e.g. BillalHossen"
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition font-mono"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Output URL: <span className="font-mono text-sky-600 dark:text-sky-400">https://t.me/{cleanTelegram || 'username'}</span>
              </p>
            </div>
          </div>

          {/* WhatsApp Settings */}
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-900/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center">
                  <MessageSquareCode className="w-3.5 h-3.5" />
                </div>
                <span>WhatsApp Support Number</span>
              </div>
              {cleanWhatsapp && (
                <a
                  href={whatsappPreviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:underline"
                >
                  <span>Test Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                WhatsApp Phone Number (with Country Code)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="e.g. 8801700000000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition font-mono"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Output URL: <span className="font-mono text-emerald-600 dark:text-emerald-400">https://wa.me/{cleanWhatsapp || '8801700000000'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Pre-filled Message Template */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            Auto-Generated Contact Message Template
          </label>
          <textarea
            rows={3}
            value={messageTemplate}
            onChange={(e) => setMessageTemplate(e.target.value)}
            placeholder="Hello Admin, I want to purchase / renew a Premium Pro License Key for my account (My UID: {uid}) - Email: {email}."
            className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition leading-relaxed"
          />
          <p className="text-[11px] text-slate-400">
            Available dynamic tags: <code className="text-indigo-500 font-bold">{'{uid}'}</code> (User 8-digit Account ID), <code className="text-indigo-500 font-bold">{'{email}'}</code> (User Email).
          </p>
        </div>

        {/* Live Preview Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>User Modal Preview ("Get / Renew License Key"):</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/25 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center">
                  <Send className="w-3.5 h-3.5 -rotate-45" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Contact on Telegram</p>
                  <p className="text-[11px] text-sky-400">@{cleanTelegram || 'BillalHossen'}</p>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center">
                  <MessageSquareCode className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Contact on WhatsApp</p>
                  <p className="text-[11px] text-emerald-400">+{cleanWhatsapp || '8801700000000'}</p>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            type="submit"
            disabled={saving || loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving Contacts...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Telegram & WhatsApp Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
