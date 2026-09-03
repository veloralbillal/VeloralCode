import React, { useEffect, useState } from 'react';
import {
  Users,
  FolderCode,
  CheckCircle,
  Clock,
  Eye,
  PlusCircle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  FileCode,
  ShieldAlert,
  Coins,
  Key,
  Code2,
  ArrowDownToLine,
  Calendar,
  Image as ImageIcon,
} from 'lucide-react';
import { DashboardStats, CodeItem } from '../../types';
import { subscribeToDashboardStats, subscribeToAllCodes } from '../../services/codeService';
import { DashboardStatsSkeleton } from '../common/LoadingSkeleton';
import { formatDate } from '../../utils/helpers';

interface AdminDashboardProps {
  onNavigate: (route: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalCodes: 0,
    publishedCodes: 0,
    draftCodes: 0,
    totalViews: 0,
  });
  const [recentCodes, setRecentCodes] = useState<CodeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubStats = subscribeToDashboardStats((newStats) => {
      setStats(newStats);
      setLoading(false);
    });

    const unsubCodes = subscribeToAllCodes((all) => {
      setRecentCodes(all.slice(0, 5));
    });

    return () => {
      unsubStats();
      unsubCodes();
    };
  }, []);

  const statCards = [
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/40',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Total Codes',
      value: stats.totalCodes,
      icon: FolderCode,
      color: 'from-violet-500 to-purple-600',
      bgColor: 'bg-violet-50 dark:bg-violet-950/40',
      textColor: 'text-violet-600 dark:text-violet-400',
    },
    {
      label: 'Published Codes',
      value: stats.publishedCodes,
      icon: CheckCircle,
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
      textColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      label: 'Draft Codes',
      value: stats.draftCodes,
      icon: Clock,
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50 dark:bg-amber-950/40',
      textColor: 'text-amber-600 dark:text-amber-400',
    },
    {
      label: 'Total Views',
      value: stats.totalViews,
      icon: Eye,
      color: 'from-pink-500 to-rose-600',
      bgColor: 'bg-pink-50 dark:bg-pink-950/40',
      textColor: 'text-pink-600 dark:text-pink-400',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      {loading ? (
        <DashboardStatsSkeleton />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 sm:gap-4">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {card.label}
                  </span>
                  <div className={`p-2 rounded-xl ${card.bgColor} ${card.textColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {card.value.toLocaleString()}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Action Section & Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col justify-between border border-indigo-800/40 space-y-4">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Realtime Synchronization</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">Publish & Manage Code Snippets</h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Any item created or updated here instantly propagates via Firebase Realtime Database to all connected developers with zero server latency.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('#/admin/add')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold transition-all shadow-md shadow-indigo-500/30"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Code</span>
            </button>
            <button
              onClick={() => onNavigate('#/admin/creator-tools')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/30"
            >
              <Code2 className="w-4 h-4" />
              <span>Review Creator Tools</span>
            </button>
            <button
              onClick={() => onNavigate('#/admin/withdrawals')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-500/30"
            >
              <ArrowDownToLine className="w-4 h-4" />
              <span>Money Withdrawals</span>
            </button>
            <button
              onClick={() => onNavigate('#/admin/sellers')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
            >
              <Coins className="w-4 h-4" />
              <span>Sellers & Points</span>
            </button>
            <button
              onClick={() => onNavigate('#/admin/banners')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs font-semibold transition-all border border-indigo-500/40"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Slider Banners</span>
            </button>
            <button
              onClick={() => onNavigate('#/admin/events')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs font-semibold transition-all border border-indigo-500/40"
            >
              <Calendar className="w-4 h-4" />
              <span>Events & Down Price</span>
            </button>
            <button
              onClick={() => onNavigate('#/admin/manage')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
            >
              <FolderCode className="w-4 h-4" />
              <span>Manage Codes ({stats.totalCodes})</span>
            </button>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-500" />
            Admin Operations
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <span>Use Draft mode to review complex code before making it visible to users.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
              <span>Specify semantic versioning (e.g. 1.2.0) to track updates for developers.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <span>Firebase RTDB Security Rules enforce admin-only write permissions at the database level.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Recent Codes Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Recently Added / Updated Snippets
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Latest entries in Firebase Realtime Database
            </p>
          </div>
          <button
            onClick={() => onNavigate('#/admin/manage')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentCodes.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No code entries found in database. Click "Create New Code Entry" to add one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase">
                  <th className="pb-3 px-2">Title</th>
                  <th className="pb-3 px-2">Language</th>
                  <th className="pb-3 px-2">Category</th>
                  <th className="pb-3 px-2">Version</th>
                  <th className="pb-3 px-2">Status</th>
                  <th className="pb-3 px-2 text-right">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {recentCodes.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer"
                    onClick={() => item.id && onNavigate(`#/admin/edit/${item.id}`)}
                  >
                    <td className="py-3 px-2 font-bold text-slate-900 dark:text-white truncate max-w-xs">
                      {item.title}
                    </td>
                    <td className="py-3 px-2 font-mono text-slate-600 dark:text-slate-300">
                      {item.language}
                    </td>
                    <td className="py-3 px-2 text-slate-500 dark:text-slate-400">
                      {item.category}
                    </td>
                    <td className="py-3 px-2 font-mono text-slate-400">
                      v{item.version || '1.0.0'}
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === 'published'
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                            : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right text-slate-400">
                      {formatDate(item.updatedAt || item.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
