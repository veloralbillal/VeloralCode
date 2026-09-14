import React from 'react';
import {
  BarChart3,
  TrendingUp,
  MousePointerClick,
  Eye,
  Smartphone,
  Globe2,
  Activity,
  ArrowUpRight,
} from 'lucide-react';
import { Profile } from '../types';
import { linkForgeService } from '../services/linkForgeService';

interface AnalyticsTabProps {
  profile: Profile;
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ profile }) => {
  const analytics = linkForgeService.getAnalytics(profile.username);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div>
        <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-500" />
          <span>Real-Time Visitor & Click Analytics</span>
        </h2>
        <p className="text-xs text-slate-500">
          Track engagement, link conversions, referrers, and device telemetry
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Page Views</span>
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {analytics.pageViews.toLocaleString()}
          </p>
          <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" /> +18.4% this week
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Total Clicks</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {analytics.totalClicks.toLocaleString()}
          </p>
          <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" /> +24.1% this week
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Avg. CTR</span>
            <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-500">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {analytics.ctr}%
          </p>
          <p className="text-[10px] text-slate-500 font-medium">Industry avg ~22%</p>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Active Blocks</span>
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-500">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {profile.blocks.filter((b) => b.isActive).length}
          </p>
          <p className="text-[10px] text-slate-500 font-medium">
            {profile.blocks.length} total created
          </p>
        </div>
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Referrers */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Top Traffic Sources</span>
            <span className="text-[10px] text-indigo-500 font-bold">Referral Channels</span>
          </h3>

          <div className="space-y-3">
            {analytics.topReferrers.map((ref) => (
              <div key={ref.source} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{ref.source}</span>
                  <span className="text-slate-500 font-mono font-semibold">
                    {ref.count.toLocaleString()} ({ref.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600"
                    style={{ width: `${ref.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device & Country Breakdown */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Devices & Top Geos</span>
            <span className="text-[10px] text-emerald-500 font-bold">Audience Split</span>
          </h3>

          {/* Devices */}
          <div className="grid grid-cols-3 gap-2 text-center pb-3 border-b border-slate-100 dark:border-slate-800">
            {analytics.deviceStats.map((d) => (
              <div key={d.device} className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50">
                <Smartphone className="w-4 h-4 mx-auto text-indigo-500 mb-1" />
                <p className="text-sm font-black text-slate-900 dark:text-white">{d.percentage}%</p>
                <p className="text-[10px] text-slate-500 truncate">{d.device.split(' ')[0]}</p>
              </div>
            ))}
          </div>

          {/* Countries */}
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Top Locations</p>
            <div className="grid grid-cols-2 gap-2">
              {analytics.countryStats.map((geo) => (
                <div
                  key={geo.country}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs"
                >
                  <span className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200">
                    <span>{geo.flag}</span>
                    <span>{geo.country}</span>
                  </span>
                  <span className="font-mono text-slate-500 font-bold text-[11px]">{geo.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
