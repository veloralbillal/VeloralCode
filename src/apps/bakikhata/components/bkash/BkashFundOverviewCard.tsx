import React from 'react';
import { Smartphone, Plus, RefreshCw, Send, ArrowDownRight, ArrowUpRight, Zap } from 'lucide-react';
import { BkashFund } from '../../types';
import { formatTaka } from '../../utils/bakiUtils';

interface BkashFundOverviewCardProps {
  fund: BkashFund;
  onOpenActionModal: (type?: any) => void;
  onOpenRefillModal: (mode: 'add' | 'set') => void;
}

export const BkashFundOverviewCard: React.FC<BkashFundOverviewCardProps> = ({
  fund,
  onOpenActionModal,
  onOpenRefillModal,
}) => {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-pink-600 via-pink-700 to-rose-800 text-white p-5 sm:p-7 shadow-xl shadow-pink-900/20 relative overflow-hidden">
      {/* Background soft glow decoration */}
      <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left Side: Current Fund Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-white/20 backdrop-blur-xs text-white">
              <Smartphone className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-pink-100">
              বিকাশ ও মোবাইল ব্যাংকিং ফান্ড
            </span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white text-pink-700">
              লাইভ ব্যালেন্স
            </span>
          </div>

          <div>
            <div className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              {formatTaka(fund.currentBalance || 0)}
            </div>
            <p className="text-xs text-pink-100/80 mt-1">
              রিচার্জ, সেন্ড মানি বা ক্যাশ ইন করলে ফান্ড কমবে এবং ক্যাশ আউটে ফান্ড বাড়বে
            </p>
          </div>
        </div>

        {/* Right Side: Fast Fund Actions */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <button
            onClick={() => onOpenActionModal('recharge')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white text-pink-700 font-extrabold text-xs shadow-lg shadow-black/10 hover:bg-pink-50 active:scale-95 transition"
          >
            <Zap className="w-4 h-4" />
            <span>মোবাইল রিচার্জ</span>
          </button>

          <button
            onClick={() => onOpenActionModal('send_money')}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-pink-500/50 hover:bg-pink-500/70 text-white font-bold text-xs backdrop-blur-xs border border-white/20 transition active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>সেন্ড মানি</span>
          </button>

          <button
            onClick={() => onOpenRefillModal('add')}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs backdrop-blur-xs border border-white/20 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>ফান্ড লোড</span>
          </button>

          <button
            onClick={() => onOpenRefillModal('set')}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition"
            title="ব্যালেন্স সমন্বয় / পরিবর্তন"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Mini Stats */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-6 pt-5 border-t border-white/15 text-xs">
        <div className="bg-black/15 backdrop-blur-xs p-2.5 rounded-2xl">
          <div className="flex items-center gap-1 text-pink-200 text-[11px] mb-0.5">
            <Zap className="w-3.5 h-3.5" /> মোট রিচার্জ
          </div>
          <div className="font-extrabold text-sm">{formatTaka(fund.totalRechargeSent || 0)}</div>
        </div>

        <div className="bg-black/15 backdrop-blur-xs p-2.5 rounded-2xl">
          <div className="flex items-center gap-1 text-pink-200 text-[11px] mb-0.5">
            <ArrowUpRight className="w-3.5 h-3.5" /> সেন্ড মানি
          </div>
          <div className="font-extrabold text-sm">{formatTaka(fund.totalSendMoneySent || 0)}</div>
        </div>

        <div className="bg-black/15 backdrop-blur-xs p-2.5 rounded-2xl">
          <div className="flex items-center gap-1 text-pink-200 text-[11px] mb-0.5">
            <ArrowDownRight className="w-3.5 h-3.5" /> ক্যাশ আউট
          </div>
          <div className="font-extrabold text-sm text-emerald-200">
            {formatTaka(fund.totalCashOutReceived || 0)}
          </div>
        </div>

        <div className="bg-black/15 backdrop-blur-xs p-2.5 rounded-2xl">
          <div className="flex items-center gap-1 text-pink-200 text-[11px] mb-0.5">
            <Send className="w-3.5 h-3.5" /> ক্যাশ ইন
          </div>
          <div className="font-extrabold text-sm">{formatTaka(fund.totalCashInSent || 0)}</div>
        </div>
      </div>
    </div>
  );
};
