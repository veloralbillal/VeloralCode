import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  MessageSquare,
  Send,
  Copy,
  Check,
  Smartphone,
  Coffee,
  Calendar,
  Sparkles,
  Edit3,
  PhoneCall,
  Share2,
} from 'lucide-react';
import { Customer, BakiTransaction, CallingLog } from '../types';
import { formatTaka } from '../utils/bakiUtils';
import { useToast } from '../../../context/ToastContext';
import { recordCallingLog } from '../services/bakiStorageService';

interface BakiMessageModalProps {
  isOpen: boolean;
  customer: Customer | null;
  transactions: BakiTransaction[];
  currentUser?: any;
  initialType?: 'whatsapp' | 'sms';
  onClose: () => void;
  onLogSaved?: (newLog: CallingLog) => void;
}

export const BakiMessageModal: React.FC<BakiMessageModalProps> = ({
  isOpen,
  customer,
  transactions,
  currentUser,
  initialType = 'whatsapp',
  onClose,
  onLogSaved,
}) => {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<'meal' | 'polite' | 'tuesday' | 'custom'>('meal');
  const [customMessage, setCustomMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Derive recent items eaten/taken
  const recentDueItems = useMemo(() => {
    if (!customer) return [];
    return transactions
      .filter((t) => t.customerId === customer.id && t.type === 'due')
      .slice(0, 3)
      .map((t) => ({
        summary: t.itemsSummary || 'খাবার ও পণ্য',
        amount: t.amount,
      }));
  }, [customer, transactions]);

  // Construct items text
  const itemsText = useMemo(() => {
    if (recentDueItems.length === 0) {
      return '• সাধারণ বাকি হিসাব ও খরচ';
    }
    return recentDueItems
      .map((i) => `• ${i.summary} (${formatTaka(i.amount)})`)
      .join('\n');
  }, [recentDueItems]);

  // Templates
  const templates = useMemo(() => {
    if (!customer) return { meal: '', polite: '', tuesday: '' };

    const mealTemplate = `আসসালামু আলাইকুম / নমস্কার ${customer.name} ভাই,

🍽️ আজকে দোকানে যা যা খেয়েছেন / নিয়েছেন:
${itemsText}

💰 আপনার বর্তমান মোট বাকি: ${formatTaka(customer.totalDue)}

অনুগ্রহ করে হিসাবটি মিলিয়ে নিবেন। আপনার সুবিধামতো সময়ে পরিশোধের অনুরোধ রইল। ধন্যবাদ!`;

    const politeTemplate = `সম্মানিত ${customer.name} ভাই,
দোকানের বাকির খাতা অনুযায়ী আপনার বর্তমান বকেয়া বাকি ${formatTaka(customer.totalDue)}।

আপনার সুবিধাজনক সময়ে বাকি টাকাটি পরিশোধ করার জন্য বিনীত অনুরোধ জানাচ্ছি। কোনো হিসাবের গরমিল থাকলে দোকানে এসে মিলিয়ে নেওয়ার অনুরোধ রইল।

ধন্যবাদান্তে,
দোকান বাকির খাতা`;

    const tuesdayTemplate = `আসসালামু আলাইকুম ${customer.name} ভাই,
আজকে মঙ্গলবার—আপনার সাপ্তাহিক খাতা পরিশোধের দিন।

💰 আপনার বর্তমান মোট বকেয়া বাকি: ${formatTaka(customer.totalDue)}

দোকানে এসে অথবা বিকাশে পাঠিয়ে হিসাবটি ক্লিয়ার করার অনুরোধ রইল। ধন্যবাদ!`;

    return {
      meal: mealTemplate,
      polite: politeTemplate,
      tuesday: tuesdayTemplate,
    };
  }, [customer, itemsText]);

  // Sync custom message with selected template
  useEffect(() => {
    if (isOpen && customer) {
      if (customer.settlesOnTuesday && selectedTemplate === 'meal') {
        // Can stay on meal or tuesday
      }
      if (selectedTemplate !== 'custom') {
        setCustomMessage(templates[selectedTemplate] || templates.meal);
      }
    }
  }, [isOpen, customer, selectedTemplate, templates]);

  if (!isOpen || !customer) return null;

  const currentMessageText = selectedTemplate === 'custom' ? customMessage : templates[selectedTemplate] || templates.meal;

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(currentMessageText);
    setCopied(true);
    showToast('মেসেজ কপি করা হয়েছে!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendWhatsApp = async () => {
    if (!customer.phone) {
      showToast('এই কাস্টমারের কোনো ফোন নম্বর সেভ করা নেই!', 'warning');
      return;
    }
    setIsSending(true);
    const cleanPhone = customer.phone.replace(/[^0-9]/g, '');
    const intlPhone = cleanPhone.startsWith('0') ? '88' + cleanPhone : cleanPhone;
    const encoded = encodeURIComponent(currentMessageText);

    try {
      const newLog = await recordCallingLog(currentUser?.uid, {
        customerId: customer.id,
        customerName: customer.name,
        customerPhone: customer.phone,
        actionType: 'whatsapp_inquiry',
        message: currentMessageText,
      });
      if (onLogSaved) onLogSaved(newLog);
      showToast('WhatsApp এ মেসেজ পাঠানো হচ্ছে ও ডাটাবেজে সেভ হয়েছে!', 'success');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
      window.open(`https://wa.me/${intlPhone}?text=${encoded}`, '_blank');
      onClose();
    }
  };

  const handleSendSms = async () => {
    if (!customer.phone) {
      showToast('এই কাস্টমারের কোনো ফোন নম্বর সেভ করা নেই!', 'warning');
      return;
    }
    setIsSending(true);
    const cleanPhone = customer.phone.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(currentMessageText);

    try {
      const newLog = await recordCallingLog(currentUser?.uid, {
        customerId: customer.id,
        customerName: customer.name,
        customerPhone: customer.phone,
        actionType: 'sms_inquiry',
        message: currentMessageText,
      });
      if (onLogSaved) onLogSaved(newLog);
      showToast('সরাসরি SMS পাঠানো হচ্ছে ও ডাটাবেজে সেভ হয়েছে!', 'success');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
      window.location.href = `sms:${cleanPhone}?body=${encoded}`;
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/30">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                <span>বাকির হিসাব ও এসএমএস টেমপ্লেট</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {customer.name} • {customer.phone || 'ফোন নেই'} • বর্তমান বাকি: {formatTaka(customer.totalDue)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* Template Selection Pills */}
          <div>
            <label className="text-xs font-black text-slate-600 dark:text-slate-400 block mb-2 uppercase tracking-wider">
              টেমপ্লেট নির্বাচন করুন (Select Template)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedTemplate('meal');
                  setCustomMessage(templates.meal);
                }}
                className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                  selectedTemplate === 'meal'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/30'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-1.5 font-extrabold text-xs">
                  <Coffee className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>খাবারের বিবরণ</span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  কি কি খেয়েছেন ও মোট বাকি
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedTemplate('polite');
                  setCustomMessage(templates.polite);
                }}
                className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                  selectedTemplate === 'polite'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/30'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-1.5 font-extrabold text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>ভদ্র তাগাদা</span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  বিনীত অনুরোধ ও বাকি
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedTemplate('tuesday');
                  setCustomMessage(templates.tuesday);
                }}
                className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                  selectedTemplate === 'tuesday'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/30'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-1.5 font-extrabold text-xs">
                  <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                  <span>মঙ্গলবার রিমাইন্ডার</span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  সাপ্তাহিক খাতা পরিশোধ
                </p>
              </button>
            </div>
          </div>

          {/* Message Preview / Editor Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>মেসেজ প্রিভিউ ও এডিট (Message Preview)</span>
              </label>
              <button
                type="button"
                onClick={handleCopyMessage}
                className="flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-emerald-600 transition cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'কপি হয়েছে' : 'কপি করুন'}</span>
              </button>
            </div>

            <div className="relative rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-950/70 p-3 shadow-inner">
              <textarea
                value={currentMessageText}
                onChange={(e) => {
                  setSelectedTemplate('custom');
                  setCustomMessage(e.target.value);
                }}
                rows={8}
                className="w-full text-xs sm:text-sm text-slate-800 dark:text-slate-100 bg-transparent border-0 focus:outline-none focus:ring-0 resize-none font-sans leading-relaxed"
                placeholder="মেসেজ লিখুন..."
              />
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                <span>💡 আপনি চাইলে লেখার যেকোনো অংশ পরিবর্তন করতে পারবেন।</span>
                <span>{currentMessageText.length} অক্ষর</span>
              </div>
            </div>
          </div>

          {/* Quick Summary Pill */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 block">
                মেসেজ যাবে: {customer.name} ({customer.phone || 'নম্বর নেই'})
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                মোট বর্তমান বাকি: <strong className="text-rose-600 dark:text-rose-400">{formatTaka(customer.totalDue)}</strong>
              </span>
            </div>
            <span className="text-xs font-mono font-black px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400">
              {customer.phone || 'No Phone'}
            </span>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            বাতিল করুন
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSendSms}
              disabled={isSending || !customer.phone}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-extrabold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/80 hover:bg-sky-100 transition border border-sky-200 dark:border-sky-800 disabled:opacity-50 cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span>📱 SMS পাঠান</span>
            </button>

            <button
              type="button"
              onClick={handleSendWhatsApp}
              disabled={isSending || !customer.phone}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-500 transition shadow-md shadow-emerald-600/30 disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>🍽️ WhatsApp পাঠান</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
