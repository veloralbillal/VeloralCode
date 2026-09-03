import React from 'react';
import { ShieldAlert, Lock, ArrowLeft, LogIn, Sparkles, HelpCircle } from 'lucide-react';

interface CreatorAccessDeniedProps {
  onNavigate: (route: string) => void;
}

export const CreatorAccessDenied: React.FC<CreatorAccessDeniedProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/50 rounded-3xl p-6 sm:p-10 shadow-xl text-center space-y-6 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-500/10 dark:bg-red-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Shield & Lock icon badge */}
        <div className="relative inline-flex items-center justify-center">
          <div className="w-20 h-20 rounded-3xl bg-red-100 dark:bg-red-950/70 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 flex items-center justify-center shadow-lg shadow-red-500/10">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-md">
            <Lock className="w-4 h-4" />
          </div>
        </div>

        {/* Badge */}
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800">
            403 Forbidden • Access Denied (অ্যাক্সেস ব্লকড)
          </span>
        </div>

        {/* Title & Explanations */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Direct Access to /creator is Restricted
          </h1>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
            সরাসরি <code className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-red-600 dark:text-red-400 font-bold">/creator</code> ডিরেক্টরিতে ব্রাউজ করা সম্পূর্ণ সংরক্ষিত ও নিষিদ্ধ।
          </p>
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 text-xs text-slate-600 dark:text-slate-400 text-left space-y-2">
            <div className="flex items-start gap-2">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 shrink-0">1.</span>
              <span>
                <strong>ক্রিয়েটরের পাবলিক পেজ দেখতে:</strong> ক্রিয়েটরের নির্দিষ্ট ইউনিক লিংক ব্যবহার করুন। উদাহরণ: <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">/creator/veloralbillal</span>
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-indigo-600 dark:text-indigo-400 shrink-0">2.</span>
              <span>
                <strong>ক্রিয়েটর স্টুডিও ড্যাশবোর্ডে প্রবেশ করতে:</strong> আপনার অনুমোদিত ক্রিয়েটর অ্যাকাউন্টে সাইন ইন করুন।
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => onNavigate('#/login')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition active:scale-95"
          >
            <LogIn className="w-4 h-4" />
            <span>ক্রিয়েটর লগইন (Creator Login)</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('#/')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>মূল পাতায় ফিরে যান (Home)</span>
          </button>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => onNavigate('#/codes')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>সকল পাবলিক টুলস ও কোড ব্রাউজ করুন</span>
          </button>
        </div>
      </div>
    </div>
  );
};
