import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Copy, 
  ShieldCheck, 
  DollarSign, 
  RefreshCw, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  BarChart3,
  Sparkles,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { fetchDistributionReports } from '../../services/distributionService';
import { DistributionReportSummary } from '../../types/distribution';
import { formatBDT, formatUSD } from '../../utils/currency';
import { useToast } from '../../context/ToastContext';
import { UserProfile } from '../../types';

interface CreatorPayPerClickReportProps {
  userProfile: UserProfile | null;
  creatorUid: string;
  creatorEmail: string;
}

export const CreatorPayPerClickReport: React.FC<CreatorPayPerClickReportProps> = ({
  userProfile,
  creatorUid,
  creatorEmail,
}) => {
  const { showToast } = useToast();
  const [filter, setFilter] = useState<'daily' | 'weekly' | 'custom'>('daily');
  const [loading, setLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>('Just now');
  
  // Custom date range (default last 14 days)
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 14);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  const [summary, setSummary] = useState<DistributionReportSummary>({
    totalCopies: 0,
    totalDownloads: 0,
    totalUniquePaidActions: 0,
    totalEarningsBDT: 0,
    totalEarningsUSD: 0,
    topTools: [],
    recentLogs: [],
  });

  const isFixedModel = userProfile?.creatorPayoutModel === 'fixed';
  const isLocked = Boolean(userProfile?.creatorPayoutModelLocked && userProfile?.creatorPayoutModel);

  const loadReport = async () => {
    if (!creatorUid && !creatorEmail) return;
    setLoading(true);
    try {
      let customRange: { start: number; end: number } | undefined = undefined;
      if (filter === 'custom') {
        const sTime = new Date(startDate).setHours(0, 0, 0, 0);
        const eTime = new Date(endDate).setHours(23, 59, 59, 999);
        customRange = { start: sTime, end: eTime };
      }

      const data = await fetchDistributionReports(
        filter,
        customRange,
        { uid: creatorUid, email: creatorEmail }
      );
      setSummary(data);
      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (err: any) {
      showToast(err.message || 'Failed to load earning clicks & download report', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, [filter, startDate, endDate, creatorUid, creatorEmail]);

  // If user selected Pool or has not locked any model yet, we can still show the report or context banner
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Clicks, Downloads & Copies Report (ক্লিক, ডাউনলোড ও কপি আর্নিং রিপোর্ট)
            </h3>
            {isFixedModel ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                Pay-Per-Download Active (৳৩ ফিক্সড রেট)
              </span>
            ) : userProfile?.creatorPayoutModel === 'pool' ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800">
                Subscription Pool Active (৪০% পুল শেয়ার)
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                Model Pending Setup
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            আপনার টুলের দৈনিক কোড কপি, ডাউনলোড অ্যাকশন এবং জমা হওয়া রয়্যালটির সরাসরি অডিট রিপোর্ট।
          </p>
        </div>

        {/* Refresh & Time filter buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setFilter('daily')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                filter === 'daily'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              আজকের দিন (Daily)
            </button>
            <button
              type="button"
              onClick={() => setFilter('weekly')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                filter === 'weekly'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              গত ৭ দিন (Weekly)
            </button>
            <button
              type="button"
              onClick={() => setFilter('custom')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                filter === 'custom'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              কাস্টম (Custom)
            </button>
          </div>

          <button
            type="button"
            onClick={loadReport}
            disabled={loading}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
            title={`সর্বশেষ রিফ্রেশ: ${lastRefreshed}`}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Custom Date Range Picker */}
      {filter === 'custom' && (
        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex-wrap text-xs">
          <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
          <div className="flex items-center gap-2">
            <span className="text-slate-500">From:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">To:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>
      )}

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Copies */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Total Code Copies</span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Copy className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {summary.totalCopies.toLocaleString()}
          </div>
          <p className="text-[10px] text-slate-500">Total code copy clicks recorded</p>
        </div>

        {/* Total Downloads */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Total Downloads</span>
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Download className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {summary.totalDownloads.toLocaleString()}
          </div>
          <p className="text-[10px] text-slate-500">File & bundle download clicks</p>
        </div>

        {/* Paid Verified Actions (Rule 1, 2, 3 Passed) */}
        <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/50 space-y-2">
          <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400">
            <span className="text-xs font-semibold">Paid Unique Actions</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-700 dark:text-emerald-400">
            {summary.totalUniquePaidActions.toLocaleString()}
          </div>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-500">
            Verified unique paid user clicks
          </p>
        </div>

        {/* Total Period Earnings */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Period Payout (আয়)</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400">
            {formatBDT(summary.totalEarningsBDT)}
          </div>
          <p className="text-[10px] text-slate-500">
            ≈ {formatUSD(summary.totalEarningsUSD)} (Direct Wallet Credited)
          </p>
        </div>
      </div>

      {/* Two Column Layout: Top Tools Breakdown & Recent User Interaction Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        {/* Top Tools by Downloads/Copies */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              টুল অনুযায়ী ক্লিক ও ডাউনলোড (Top Tools Breakdown)
            </h4>
          </div>

          {loading ? (
            <div className="py-8 text-center text-xs text-slate-400">হিসাব লোড হচ্ছে...</div>
          ) : summary.topTools.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              নির্বাচিত সময়ে আপনার টুলের কোনো কপি বা ডাউনলোড ক্লিক পাওয়া যায়নি।
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800 space-y-1">
              {summary.topTools.map((t, idx) => (
                <div key={t.codeId} className="pt-2.5 pb-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <span className="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white truncate">
                      {t.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 text-right">
                    <span className="text-[11px] text-slate-500">
                      {t.copies} copies • {t.downloads} dl
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                      {formatBDT(t.totalEarningsBDT)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Interaction Audit Logs (Anti-Cheating Status) */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              ক্লিক অডিট লগ ও অ্যান্টি-চিটিং স্ট্যাটাস (Audit Logs)
            </h4>
            <span className="text-[10px] text-slate-400">সর্বশেষ অ্যাকশনসমূহ</span>
          </div>

          {loading ? (
            <div className="py-8 text-center text-xs text-slate-400">লগ লোড হচ্ছে...</div>
          ) : summary.recentLogs.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              এখনও কোনো ইন্টারঅ্যাকশন রেকর্ড জমা হয়নি।
            </div>
          ) : (
            <div className="max-h-[280px] overflow-y-auto space-y-2 pr-1">
              {summary.recentLogs.map((log) => {
                let badge = (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> +{formatBDT(log.earningAmountBDT || 3)}
                  </span>
                );

                if (!log.isEligibleForPayout) {
                  const reasonLabel = 
                    log.ineligibilityReason === 'own_code'
                      ? 'নিজের কোড'
                      : log.ineligibilityReason === 'free_user'
                      ? 'ফ্রি ইউজার'
                      : log.ineligibilityReason === 'duplicate_user'
                      ? 'পুনরাবৃত্তি (Duplicate)'
                      : 'Not eligible';

                  badge = (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center gap-1" title={reasonLabel}>
                      <XCircle className="w-3 h-3 text-slate-400" /> {reasonLabel}
                    </span>
                  );
                }

                return (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[160px] sm:max-w-[200px]">
                          {log.toolTitle}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-slate-400 px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800">
                          {log.actionType}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • User: {log.userEmail ? log.userEmail.split('@')[0] : 'Member'}
                      </p>
                    </div>
                    <div>{badge}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
