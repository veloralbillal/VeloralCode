import React from 'react';
import {
  X,
  BookOpen,
  Calendar,
  Users,
  AlertCircle,
  Coffee,
  ShoppingBag,
  Smartphone,
  PlusCircle,
  FileSpreadsheet,
  Printer,
  BarChart3,
  LayoutDashboard,
  Coins,
  Sparkles,
  Shield,
  User,
  Sun,
  Moon,
  LogOut,
  ChevronRight,
  Download,
} from 'lucide-react';
import { BakiStats } from '../types';
import { formatTaka } from '../utils/bakiUtils';
import { usePWAInstall } from '../../../utils/pwa/usePWAInstall';
import { PwaInstallModal } from './PwaInstallModal';

interface BakiSidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  stats: BakiStats;
  currentUser: any;
  userProfile: any;
  isAdmin?: boolean;
  isSeller?: boolean;
  theme: 'dark' | 'light';
  bkashFundBalance?: number;
  onToggleTheme: () => void;
  onSelectTuesdayFilter: () => void;
  onSelectAllCustomers: () => void;
  onSelectKhataTab?: () => void;
  onSelectBkashTab?: () => void;
  onOpenBkashAction?: (type?: any) => void;
  onOpenBkashRefill?: (mode?: any) => void;
  onOpenAddCustomer: () => void;
  onOpenAddDue: (category?: any) => void;
  onOpenDailyReport: () => void;
  onExportCsv: () => void;
  onPrintLedger: () => void;
  onNavigate: (route: string) => void;
  onLogout: () => void;
}

export const BakiSidebarDrawer: React.FC<BakiSidebarDrawerProps> = ({
  isOpen,
  onClose,
  stats,
  currentUser,
  userProfile,
  isAdmin,
  isSeller,
  theme,
  bkashFundBalance = 0,
  onToggleTheme,
  onSelectTuesdayFilter,
  onSelectAllCustomers,
  onSelectKhataTab,
  onSelectBkashTab,
  onOpenBkashAction,
  onOpenBkashRefill,
  onOpenAddCustomer,
  onOpenAddDue,
  onOpenDailyReport,
  onExportCsv,
  onPrintLedger,
  onNavigate,
  onLogout,
}) => {
  const {
    isInstallable,
    isInstalled,
    isIOS,
    isAndroid,
    isInIframe,
    showInstallGuide,
    setShowInstallGuide,
    install,
  } = usePWAInstall();

  if (!isOpen) return null;

  const isCreator = userProfile?.role === 'creator' || isAdmin;

  const handleAction = (cb: () => void) => {
    cb();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar Drawer Container */}
      <div className="fixed top-0 left-0 bottom-0 z-50 w-72 sm:w-80 bg-slate-900 border-r border-slate-800 text-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-left duration-200">
        <div className="p-5 space-y-5 overflow-y-auto flex-1">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/30">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-sm text-white tracking-tight">বাকির খাতা মেনু</h3>
                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500 text-white">
                    PRO
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">দোকান ও লেনদেনের খতিয়ান</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Balance Summary Pill */}
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/70 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>মোট বকেয়া পাওনা:</span>
              <span className="font-mono text-emerald-400 font-bold">{stats.totalCustomers} জন গ্রাহক</span>
            </div>
            <div className="text-xl font-black text-rose-400">
              {formatTaka(stats.totalDueAmount)}
            </div>
            <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between text-[10px] text-slate-400">
              <span>মঙ্গলবার কালেকশন:</span>
              <span className="font-extrabold text-amber-400">{formatTaka(stats.tuesdayDueAmount)}</span>
            </div>
          </div>

          {/* PWA Install App Card */}
          {!isInstalled && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-teal-950/80 border border-emerald-500/40 text-emerald-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-black text-white">বাকির খাতা অ্যাপ PWA</span>
                </div>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500 text-white">
                  Offline Ready
                </span>
              </div>
              <p className="text-[11px] text-emerald-300/90 leading-tight">
                হোমস্ক্রিনে অ্যাপ হিসেবে ইন্সটল করুন এবং যেকোনো সময় অফলাইনে ব্যবহার করুন।
              </p>
              <div className="flex gap-2">
                <button
                  id="pwa-drawer-install-action"
                  onClick={async () => {
                    await install();
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition active:scale-95 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>📱 বাকির খাতা ইন্সটল করুন</span>
                </button>
                <button
                  id="pwa-drawer-guide-action"
                  onClick={() => setShowInstallGuide(true)}
                  className="px-2.5 py-2 rounded-xl bg-emerald-900/60 border border-emerald-500/40 hover:bg-emerald-800/60 text-emerald-200 text-xs font-semibold transition"
                  title="ইনস্টল নিয়মাবলী"
                >
                  সাহায্য
                </button>
              </div>
            </div>
          )}

          {/* Section 1: খাতা ও ফিল্টার */}
          <div className="space-y-1">
            <span className="px-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
              খাতার ফিল্টার ও তালিকা
            </span>

            <button
              onClick={() => handleAction(onSelectAllCustomers)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition"
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-indigo-400" />
                <span>সব কাস্টমার খতিয়ান</span>
              </div>
              <span className="text-[10px] text-slate-400">{stats.totalCustomers}</span>
            </button>

            <button
              onClick={() => handleAction(onSelectTuesdayFilter)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition"
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>মঙ্গলবার কালেকশন ট্র্যাকার</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 font-black">
                {stats.tuesdayCustomerCount} জন
              </span>
            </button>
          </div>

          {/* Section: বিকাশ ও মোবাইল ব্যাংকিং ফান্ড */}
          <div className="space-y-1 pt-2 border-t border-slate-800">
            <span className="px-2 text-[10px] font-black uppercase tracking-wider text-pink-400">
              বিকাশ ও মোবাইল ব্যাংকিং
            </span>

            <button
              onClick={() => handleAction(() => onSelectBkashTab && onSelectBkashTab())}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-black bg-pink-950/40 border border-pink-700/60 text-pink-200 hover:bg-pink-900/50 transition"
            >
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-4 h-4 text-pink-400" />
                <span>বিকাশ কাউন্টার ও ফান্ড</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-600 text-white font-black">
                {formatTaka(bkashFundBalance)}
              </span>
            </button>

            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <button
                onClick={() => handleAction(() => onOpenBkashAction && onOpenBkashAction('recharge'))}
                className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl text-[11px] font-bold bg-slate-800/90 text-slate-300 hover:text-white hover:bg-slate-700 transition"
              >
                <span>⚡ রিচার্জ</span>
              </button>
              <button
                onClick={() => handleAction(() => onOpenBkashAction && onOpenBkashAction('send_money'))}
                className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl text-[11px] font-bold bg-slate-800/90 text-slate-300 hover:text-white hover:bg-slate-700 transition"
              >
                <span>💸 সেন্ড মানি</span>
              </button>
            </div>

            <button
              onClick={() => handleAction(() => onOpenBkashRefill && onOpenBkashRefill('add'))}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold text-pink-300 hover:bg-pink-950/40 transition"
            >
              <span>+ বিকাশ ফান্ড লোড / রিফিল</span>
            </button>
          </div>

          {/* Section 2: হিসাব ও দ্রুত এন্ট্রি */}
          <div className="space-y-1 pt-2 border-t border-slate-800">
            <span className="px-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
              দ্রুত এন্ট্রি ও ক্যাটাগরি
            </span>

            <button
              onClick={() => handleAction(onOpenAddCustomer)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-950/40 border border-emerald-800/60 hover:bg-emerald-900/50 transition"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>নতুন কাস্টমার তৈরি করুন</span>
            </button>

            <button
              onClick={() => handleAction(() => onOpenAddDue('cha_pan'))}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              <Coffee className="w-4 h-4 text-amber-400" />
              <span>চা ও পানের বাকি লিখুন</span>
            </button>

            <button
              onClick={() => handleAction(() => onOpenAddDue('mudi'))}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <span>মুদি পণ্যের বাকি এন্ট্রি</span>
            </button>

            <button
              onClick={() => handleAction(() => onOpenAddDue('bkash'))}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              <Smartphone className="w-4 h-4 text-pink-400" />
              <span>বিকাশ ও মোবাইল রিচার্জ লেনদেন</span>
            </button>
          </div>

          {/* Section 3: টুলস ও রিপোর্ট */}
          <div className="space-y-1 pt-2 border-t border-slate-800">
            <span className="px-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
              টুলস ও রিপোর্ট
            </span>

            <button
              onClick={() => handleAction(onOpenDailyReport)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span>আজকের দিনের জমার রিপোর্ট</span>
            </button>

            <button
              onClick={() => handleAction(onExportCsv)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>এক্সেল / CSV ব্যাকআপ ডাউনলোড</span>
            </button>

            <button
              onClick={() => handleAction(onPrintLedger)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              <Printer className="w-4 h-4 text-purple-400" />
              <span>খাতা প্রিন্ট / ভাউচার তৈরি</span>
            </button>
          </div>

          {/* Section 4: প্ল্যাটফর্ম ও অন্যান্য নেভিগেশন */}
          <div className="space-y-1 pt-2 border-t border-slate-800">
            <span className="px-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
              প্ল্যাটফর্ম হাব ও লিংক
            </span>

            <button
              onClick={() => handleAction(() => onNavigate('#/explore'))}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              <LayoutDashboard className="w-4 h-4 text-indigo-400" />
              <span>Explore Codes</span>
            </button>

            <button
              onClick={() => handleAction(() => onNavigate('#/events'))}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>Events & Drops</span>
            </button>

            <button
              onClick={() => handleAction(() => onNavigate('#/profile'))}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              <User className="w-4 h-4 text-indigo-400" />
              <span>User Profile</span>
            </button>

            {(isSeller || isAdmin) && (
              <button
                onClick={() => handleAction(() => onNavigate('#/seller'))}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-amber-300 hover:bg-amber-950/40 transition"
              >
                <div className="flex items-center gap-2.5">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span>Seller Hub</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            )}

            {isCreator && (
              <button
                onClick={() => handleAction(() => onNavigate('#/creator'))}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-emerald-300 hover:bg-emerald-950/40 transition"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Creator Studio</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            )}

            {isAdmin && (
              <button
                onClick={() => handleAction(() => onNavigate('#/admin'))}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-purple-300 hover:bg-purple-950/40 transition"
              >
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-purple-400" />
                  <span>Admin Panel</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
              </button>
            )}
          </div>
        </div>

        {/* Bottom Drawer Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/95 space-y-2">
          <div className="flex items-center justify-between">
            <button
              onClick={onToggleTheme}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:text-white transition"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-400" />}
              <span>{theme === 'dark' ? 'লাইট মোড' : 'ডার্ক মোড'}</span>
            </button>

            {currentUser && (
              <button
                onClick={() => handleAction(onLogout)}
                className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition"
                title="সাইন আউট"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
