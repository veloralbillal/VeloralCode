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
  Sparkles
} from 'lucide-react';
import { fetchDistributionReports } from '../../services/distributionService';
import { DistributionReportSummary } from '../../types/distribution';
import { formatBDT, formatUSD } from '../../utils/currency';
import { useToast } from '../../context/ToastContext';

export const AdminDownloadCopyReport: React.FC = () => {
  const { showToast } = useToast();
  const [filter, setFilter] = useState<'daily' | 'weekly' | 'custom'>('daily');
  const [loading, setLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>('Just now');
  
  // Custom date range (default last 30 days)
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
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

  const loadReport = async () => {
    setLoading(true);
    try {
      let customRange: { start: number; end: number } | undefined = undefined;
      if (filter === 'custom') {
        const sTime = new Date(startDate).setHours(0, 0, 0, 0);
        const eTime = new Date(endDate).setHours(23, 59, 59, 999);
        customRange = { start: sTime, end: eTime };
      }

      const data = await fetchDistributionReports(filter, customRange);
      setSummary(data);
      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (err: any) {
      showToast(err.message || 'Failed to load distribution report', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, [filter, startDate, endDate]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Download & Copy Distribution Report (ডাউনলোড ও কপি রিপোর্ট)
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time tracking of tool downloads, code copies, and creator royalty distribution.
          </p>
        </div>

        {/* Filter Pills + Refresh */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            {(['daily', 'weekly', 'custom'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                  filter === f
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {f === 'daily' ? 'Daily (আজকের)' : f === 'weekly' ? 'Weekly (সাপ্তাহিক)' : 'Custom (কাস্টম)'}
              </button>
            ))}
          </div>

          <button
            onClick={loadReport}
            disabled={loading}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition flex items-center gap-1.5 text-xs font-semibold"
            title="Fetch Latest Report"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-500' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Custom Date Pickers */}
      {filter === 'custom' && (
        <div className="p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 flex flex-wrap items-center gap-3 text-xs">
          <Calendar className="w-4 h-4 text-indigo-500" />
          <span className="font-bold text-slate-700 dark:text-slate-300">Select Range:</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
          />
          <span className="text-slate-400">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
          />
        </div>
      )}

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Total Copies</span>
            <Copy className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {summary.totalCopies}
          </p>
          <span className="text-[10px] text-slate-400">Code snippet copied</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Total Downloads</span>
            <Download className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {summary.totalDownloads}
          </p>
          <span className="text-[10px] text-slate-400">Source files downloaded</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Verified Paid Actions</span>
            <ShieldCheck className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {summary.totalUniquePaidActions}
          </p>
          <span className="text-[10px] text-slate-400">Anti-cheating approved</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Creator Royalties</span>
            <DollarSign className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-2">
            ৳{summary.totalEarningsBDT}
          </p>
          <span className="text-[10px] text-slate-400">≈ ${summary.totalEarningsUSD} USD</span>
        </div>
      </div>

      {/* Top Tools Section */}
      {summary.topTools.length > 0 && (
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Top Downloaded & Copied Tools (সর্বোচ্চ ব্যবহৃত টুলসমূহ)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {summary.topTools.slice(0, 6).map((tool, idx) => (
              <div
                key={tool.codeId}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  <span className="w-5 h-5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-600 font-bold flex items-center justify-center text-[10px]">
                    #{idx + 1}
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white truncate">
                    {tool.title}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-slate-500">
                    <strong className="text-slate-800 dark:text-slate-200">{tool.copies}</strong> copies / <strong className="text-slate-800 dark:text-slate-200">{tool.downloads}</strong> dl
                  </span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    ৳{tool.totalEarningsBDT}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity Logs */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Recent Activity Logs (সরাসরি লগ ও অ্যান্টি-চিটিং স্ট্যাটাস)
          </h4>
          <span className="text-[10px] text-slate-400">Refreshed: {lastRefreshed}</span>
        </div>

        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3 font-semibold">Tool</th>
                <th className="p-3 font-semibold">Action</th>
                <th className="p-3 font-semibold">User</th>
                <th className="p-3 font-semibold">Anti-Cheating Check</th>
                <th className="p-3 font-semibold">Payout</th>
                <th className="p-3 font-semibold text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {summary.recentLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-400">
                    No download or copy events in selected time range.
                  </td>
                </tr>
              ) : (
                summary.recentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition">
                    <td className="p-3 font-medium text-slate-800 dark:text-slate-200 max-w-[180px] truncate">
                      {log.toolTitle}
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.actionType === 'copy'
                          ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300'
                          : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300'
                      }`}>
                        {log.actionType === 'copy' ? <Copy className="w-3 h-3" /> : <Download className="w-3 h-3" />}
                        {log.actionType === 'copy' ? 'Copy' : 'Download'}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500 font-mono text-[11px] truncate max-w-[140px]">
                      {log.userEmail}
                    </td>
                    <td className="p-3">
                      {log.isEligibleForPayout ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Verified Paid User</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
                          <XCircle className="w-3.5 h-3.5 text-rose-400" />
                          <span>
                            {log.ineligibilityReason === 'own_code'
                              ? 'Own Code (No Earning)'
                              : log.ineligibilityReason === 'free_user'
                              ? 'Free User'
                              : 'Duplicate (1x Only)'}
                          </span>
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-bold text-amber-600 dark:text-amber-400">
                      {log.isEligibleForPayout ? `৳${log.earningAmountBDT}` : '—'}
                    </td>
                    <td className="p-3 text-right text-slate-400 text-[11px] whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
