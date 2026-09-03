import React, { useState, useEffect } from 'react';
import { DollarSign, Save, ShieldAlert, Check } from 'lucide-react';
import { getPlatformDistributionSettings, updatePlatformDistributionSettings } from '../../services/distributionService';
import { USD_TO_BDT_RATE, formatBDT } from '../../utils/currency';
import { useToast } from '../../context/ToastContext';

export const AdminMinWithdrawalCard: React.FC = () => {
  const { showToast } = useToast();
  const [minBdt, setMinBdt] = useState<number>(500);
  const [fixedRateBdt, setFixedRateBdt] = useState<number>(3);
  const [poolShare, setPoolShare] = useState<number>(40);
  const [saving, setSaving] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | undefined>(undefined);

  useEffect(() => {
    getPlatformDistributionSettings().then((s) => {
      setMinBdt(s.minWithdrawalBDT);
      setFixedRateBdt(s.fixedRatePerDownloadBDT);
      setPoolShare(s.poolSharePercentage);
      setLastUpdated(s.updatedAt);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (minBdt <= 0) {
      showToast('Minimum withdrawal must be at least ৳50', 'warning');
      return;
    }
    setSaving(true);
    try {
      const updated = await updatePlatformDistributionSettings({
        minWithdrawalBDT: Number(minBdt),
        fixedRatePerDownloadBDT: Number(fixedRateBdt),
        poolSharePercentage: Number(poolShare),
      });
      setLastUpdated(updated.updatedAt);
      showToast('Minimum withdrawal & distribution settings updated successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const minUsdEquivalent = (minBdt / USD_TO_BDT_RATE).toFixed(2);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              Minimum Withdrawal & Distribution Settings (মিনিমাম উইথড্র কনফিগারেশন)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Set the minimum threshold creators must reach before requesting payouts via bKash/Nagad.
            </p>
          </div>
        </div>

        {lastUpdated && (
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Updated: {new Date(lastUpdated).toLocaleDateString()}
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Minimum Withdrawal in BDT */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Minimum Withdrawal (টাকা BDT)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">৳</span>
              <input
                type="number"
                min="50"
                step="10"
                value={minBdt}
                onChange={(e) => setMinBdt(Number(e.target.value))}
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>
            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
              ≈ ${minUsdEquivalent} USD (@ 1$ = {USD_TO_BDT_RATE}৳)
            </p>
          </div>

          {/* Fixed Rate Per Copy/Download */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Fixed Rate per Download/Copy (BDT)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">৳</span>
              <input
                type="number"
                min="1"
                step="0.5"
                value={fixedRateBdt}
                onChange={(e) => setFixedRateBdt(Number(e.target.value))}
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>
            <p className="text-[11px] text-slate-400">Paid to creator per unique subscriber copy</p>
          </div>

          {/* Pool Share Percentage */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Monthly Royalty Pool Share (%)
            </label>
            <div className="relative">
              <input
                type="number"
                min="10"
                max="90"
                value={poolShare}
                onChange={(e) => setPoolShare(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">%</span>
            </div>
            <p className="text-[11px] text-slate-400">Portion of subscription distributed to pool creators</p>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Quick Limits:</span>
          {[200, 300, 500, 1000].map((preset) => (
            <button
              type="button"
              key={preset}
              onClick={() => setMinBdt(preset)}
              className={`px-2.5 py-1 rounded-lg border font-semibold transition ${
                minBdt === preset
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-400'
              }`}
            >
              ৳{preset}
            </button>
          ))}
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/20 transition flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save Settings (সেভ করুন)</span>
          </button>
        </div>
      </form>
    </div>
  );
};
