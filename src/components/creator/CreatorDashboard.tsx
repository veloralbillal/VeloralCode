import React, { useState, useEffect } from 'react';
import {
  Code2,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  Wallet,
  ArrowUpRight,
  PlusCircle,
  Sparkles,
  ExternalLink,
  Flame,
  Heart,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CodeItem, CreatorStats, CreatorTransaction } from '../../types';
import { subscribeToCreatorCodes, fetchCreatorTransactions } from '../../services/creatorService';
import { formatDate, getCategoryBadgeClass } from '../../utils/helpers';
import { formatBDT, formatUSD, usdToBdt } from '../../utils/currency';
import { formatCreatorName } from '../../utils/userDisplay';

interface CreatorDashboardProps {
  onNavigate: (route: string) => void;
}

export const CreatorDashboard: React.FC<CreatorDashboardProps> = ({ onNavigate }) => {
  const { currentUser, userProfile } = useAuth();
  const [codes, setCodes] = useState<CodeItem[]>([]);
  const [transactions, setTransactions] = useState<CreatorTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const creatorDisplayName = formatCreatorName(
    userProfile?.creatorDisplayName || userProfile?.name,
    currentUser?.email,
    'Creator'
  );

  useEffect(() => {
    if (!currentUser) return;

    setLoading(true);
    const unsubscribe = subscribeToCreatorCodes(
      currentUser.uid,
      currentUser.email || '',
      (items) => {
        setCodes(items);
        setLoading(false);
      },
      () => setLoading(false)
    );

    fetchCreatorTransactions(currentUser.uid).then((txList) => {
      setTransactions(txList);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const stats: CreatorStats = {
    totalUploads: codes.length,
    liveTools: codes.filter((c) => c.status === 'published').length,
    pendingApproval: codes.filter((c) => c.status === 'pending_approval').length,
    rejectedTools: codes.filter((c) => c.status === 'rejected').length,
    totalViews: codes.reduce((acc, curr) => acc + (curr.views || 0), 0),
    walletBalance: Number(userProfile?.creatorBalance || 0),
    totalEarnings: Number(userProfile?.creatorEarnings || 0),
    totalWithdrawn: transactions
      .filter((t) => t.type === 'withdrawal' && t.status === 'completed')
      .reduce((acc, t) => acc + Math.abs(t.amount), 0),
  };

  const topViewedCodes = [...codes]
    .filter((c) => c.status === 'published')
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);

  const recentUploads = [...codes].slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-6 sm:p-8 text-white shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wide text-white">
              <Sparkles className="w-3.5 h-3.5" /> Creator Studio Central
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Hello, {creatorDisplayName}!
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
              Upload web tools, codes, and scripts. Receive tips, earnings in BDT (টাকা), and rewards when your tools go live!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('#/creator/upload')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-emerald-800 font-bold text-xs sm:text-sm shadow-md hover:bg-emerald-50 transition-all"
            >
              <PlusCircle className="w-4 h-4 text-emerald-600" /> Upload New Tool
            </button>
            <button
              onClick={() => onNavigate('#/creator/wallet')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-semibold text-xs sm:text-sm transition-all"
            >
              <Wallet className="w-4 h-4" /> View Wallet ({formatBDT(usdToBdt(stats.walletBalance))})
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -right-8 -bottom-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Views */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Total Views</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {stats.totalViews.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-500" /> Across all published tools
            </p>
          </div>
        </div>

        {/* Live Published Tools */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Live Tools</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {stats.liveTools} <span className="text-xs text-slate-400 font-normal">/ {stats.totalUploads}</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Approved & publicly accessible
            </p>
          </div>
        </div>

        {/* Pending Approval */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Pending Review</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {stats.pendingApproval}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Awaiting admin approval
            </p>
          </div>
        </div>

        {/* Wallet Balance */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Available Balance</span>
            <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {formatBDT(usdToBdt(stats.walletBalance))}
            </div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
              {formatBDT(usdToBdt(stats.totalEarnings))} ({formatUSD(stats.totalEarnings)}) Lifetime
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Top Performing Tools & Recent Uploads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Tools by Views */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Top Performing Tools</h3>
              </div>
              <button
                onClick={() => onNavigate('#/creator/tools')}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                View All <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            {loading ? (
              <div className="py-12 text-center text-xs text-slate-400">Loading top metrics...</div>
            ) : topViewedCodes.length === 0 ? (
              <div className="py-10 text-center text-xs text-slate-400">
                No approved tools yet. Upload your first tool to start tracking views!
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-2">
                {topViewedCodes.map((item, idx) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                          {item.title}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {item.category} • {item.language}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                          {item.views.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-400 block">views</span>
                      </div>
                      <button
                        onClick={() => onNavigate(`#/code/${item.id}`)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="View Public Tool"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800 text-center">
            <span className="text-[11px] text-slate-400">
              Each live tool view establishes your creator reputation and eligibility for milestone bonuses.
            </span>
          </div>
        </div>

        {/* Recent Uploads & Status */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-500" />
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Recent Uploads & Status</h3>
              </div>
              <button
                onClick={() => onNavigate('#/creator/tools')}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                Manage <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            {loading ? (
              <div className="py-12 text-center text-xs text-slate-400">Loading uploads...</div>
            ) : recentUploads.length === 0 ? (
              <div className="py-10 text-center text-xs text-slate-400">
                You haven't uploaded any tools yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-2">
                {recentUploads.map((item) => {
                  let statusBadge = (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Live
                    </span>
                  );

                  if (item.status === 'pending_approval') {
                    statusBadge = (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> In Review
                      </span>
                    );
                  } else if (item.status === 'rejected') {
                    statusBadge = (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Action Needed
                      </span>
                    );
                  }

                  return (
                    <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                            {item.title}
                          </p>
                          {statusBadge}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Uploaded on {formatDate(item.createdAt)}
                        </p>
                      </div>

                      <button
                        onClick={() => onNavigate(`#/creator/edit/${item.id}`)}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors shrink-0"
                      >
                        Edit Tool
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => onNavigate('#/creator/upload')}
              className="w-full py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-semibold text-xs border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Upload Another Tool
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
