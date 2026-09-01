import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Coins,
  Key,
  CheckCircle2,
  DollarSign,
  PieChart,
  Calendar,
  Layers,
  ArrowUpRight,
  Download,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fetchKeysBySeller } from '../../services/sellerService';
import { LicenseKey } from '../../types';
import { formatDate } from '../../utils/helpers';

export const SellerReports: React.FC = () => {
  const { userProfile } = useAuth();
  const [keys, setKeys] = useState<LicenseKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [sellingPricePerMonth, setSellingPricePerMonth] = useState<number>(10); // in currency units (USD/BDT)
  const [currencySymbol, setCurrencySymbol] = useState<string>('$');

  useEffect(() => {
    if (userProfile?.userId) {
      loadKeys();
    }
  }, [userProfile?.userId]);

  const loadKeys = async () => {
    if (!userProfile?.userId) return;
    setLoading(true);
    try {
      const data = await fetchKeysBySeller(userProfile.userId);
      setKeys(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Calculations
  const totalKeys = keys.length;
  const activeKeys = keys.filter((k) => k.status === 'active').length;
  const usedKeys = keys.filter((k) => k.status === 'used').length;
  const revokedKeys = keys.filter((k) => k.status === 'revoked').length;
  const totalCoinsSpent = keys.reduce((acc, k) => acc + (k.coinsCost || 10), 0);

  // Group by duration
  const durationBreakdown = {
    days7: keys.filter((k) => k.durationDays === 7).length,
    days30: keys.filter((k) => k.durationDays === 30).length,
    days90: keys.filter((k) => k.durationDays === 90).length,
    days180: keys.filter((k) => k.durationDays === 180).length,
    days365: keys.filter((k) => k.durationDays === 365).length,
    lifetime: keys.filter((k) => k.durationDays === 0).length,
  };

  // Estimated gross sales calculation based on seller's configured retail price multiplier
  const estimatedRevenue = keys.reduce((acc, k) => {
    const months = k.durationDays === 0 ? 12 : Math.max(1, Math.round(k.durationDays / 30));
    return acc + months * sellingPricePerMonth;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Seller Sales & Income Reports
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 font-bold">
                Performance Hub
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Overview of your generated license keys, user redemptions, coin expenditures, and estimated sales revenue.
            </p>
          </div>
        </div>

        {/* Currency & Price Estimator Selector */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
          <span className="text-slate-500 font-medium pl-2">Currency:</span>
          <select
            value={currencySymbol}
            onChange={(e) => setCurrencySymbol(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 font-bold text-slate-800 dark:text-slate-200"
          >
            <option value="$">USD ($)</option>
            <option value="৳">BDT (৳)</option>
            <option value="₹">INR (₹)</option>
            <option value="€">EUR (€)</option>
          </select>

          <span className="text-slate-500 font-medium pl-2">Avg Price/Mo:</span>
          <input
            type="number"
            min="1"
            value={sellingPricePerMonth}
            onChange={(e) => setSellingPricePerMonth(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 font-bold text-slate-800 dark:text-slate-200"
          />
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Generated Keys */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-indigo-500">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Keys Sold
            </span>
            <Key className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{totalKeys}</p>
          <p className="text-[11px] text-slate-400">Total volume generated</p>
        </div>

        {/* Redeemed / Active Customers */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-emerald-500">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Customer Redeemed
            </span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{usedKeys}</p>
          <p className="text-[11px] text-slate-400">
            {totalKeys > 0 ? Math.round((usedKeys / totalKeys) * 100) : 0}% activation rate
          </p>
        </div>

        {/* Total Points Invested */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-amber-500">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Points Burned
            </span>
            <Coins className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{totalCoinsSpent} Pts</p>
          <p className="text-[11px] text-slate-400">Points spent on generation</p>
        </div>

        {/* Estimated Sales Revenue */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-950/40 dark:to-teal-950/30 border border-emerald-500/20 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
            <span className="text-xs font-bold uppercase tracking-wider">Estimated Revenue</span>
            <DollarSign className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {currencySymbol}
            {estimatedRevenue}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Based on your retail price rates</p>
        </div>
      </div>

      {/* Plan & Duration Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Breakdown by Duration */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <PieChart className="w-4 h-4 text-indigo-500" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Sales by Plan Duration</h4>
          </div>

          <div className="space-y-3">
            {[
              { label: '7 Days Trial', count: durationBreakdown.days7, color: 'bg-slate-400' },
              { label: '1 Month (30 Days)', count: durationBreakdown.days30, color: 'bg-indigo-500' },
              { label: '3 Months (90 Days)', count: durationBreakdown.days90, color: 'bg-blue-500' },
              { label: '6 Months (180 Days)', count: durationBreakdown.days180, color: 'bg-amber-500' },
              { label: '1 Year (365 Days)', count: durationBreakdown.days365, color: 'bg-emerald-500' },
              { label: 'Lifetime Access', count: durationBreakdown.lifetime, color: 'bg-violet-500' },
            ].map((item) => {
              const pct = totalKeys > 0 ? Math.round((item.count / totalKeys) * 100) : 0;
              return (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{item.label}</span>
                    <span className="text-slate-500 font-bold">
                      {item.count} keys ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* License Status Distribution */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Layers className="w-4 h-4 text-emerald-500" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">License Status Breakdown</h4>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300">Active</span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{activeKeys}</p>
              <p className="text-[10px] text-slate-400">Ready to sell</p>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-indigo-700 dark:text-indigo-300">Redeemed</span>
              <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{usedKeys}</p>
              <p className="text-[10px] text-slate-400">In use by clients</p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-800/60 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-rose-700 dark:text-rose-300">Revoked</span>
              <p className="text-2xl font-black text-rose-600 dark:text-rose-400">{revokedKeys}</p>
              <p className="text-[10px] text-slate-400">Cancelled</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <p className="font-bold text-slate-800 dark:text-slate-200">💡 Reseller Tip:</p>
            <p>
              Active keys can be shared immediately with your buyers. Once a user enters the key on the login/activation screen, the status will automatically change to <strong>Redeemed</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
