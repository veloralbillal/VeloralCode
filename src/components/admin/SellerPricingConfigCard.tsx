import React, { useState, useEffect } from 'react';
import { Coins, Save, RotateCcw, Sparkles } from 'lucide-react';
import { SellerPricingConfig } from '../../types';
import {
  getSellerPricingConfig,
  updateSellerPricingConfig,
  DEFAULT_PRICING_CONFIG,
} from '../../services/sellerService';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

export const SellerPricingConfigCard: React.FC = () => {
  const { showToast } = useToast();
  const { currentUser } = useAuth();
  const [pricing, setPricing] = useState<SellerPricingConfig>(DEFAULT_PRICING_CONFIG);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPricing();
  }, []);

  const loadPricing = async () => {
    const data = await getSellerPricingConfig();
    setPricing(data);
  };

  const handleChange = (field: keyof SellerPricingConfig, val: number) => {
    setPricing((prev) => ({ ...prev, [field]: Math.max(0, val) }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSellerPricingConfig(pricing, currentUser?.email || 'Admin');
      showToast('Key coin pricing rules saved successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to save coin rates', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Key Generation Point/Coin Cost Settings
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold">
                Coin Economy
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Set how many points/coins sellers must spend to generate each license duration.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setPricing(DEFAULT_PRICING_CONFIG);
            showToast('Reset to default values in form. Click Save to commit.', 'info');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* 7 Days */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1">
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">7 Days Plan</label>
            <div className="relative">
              <input
                type="number"
                min="0"
                value={pricing.days7}
                onChange={(e) => handleChange('days7', parseInt(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-bold text-amber-600 dark:text-amber-400"
              />
              <span className="absolute right-2 top-1.5 text-[10px] text-slate-400 font-bold">Pts</span>
            </div>
          </div>

          {/* 30 Days (1 Mo) */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1">
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">1 Month (30d)</label>
            <div className="relative">
              <input
                type="number"
                min="0"
                value={pricing.days30}
                onChange={(e) => handleChange('days30', parseInt(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-bold text-amber-600 dark:text-amber-400"
              />
              <span className="absolute right-2 top-1.5 text-[10px] text-slate-400 font-bold">Pts</span>
            </div>
          </div>

          {/* 90 Days (3 Mo) */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1">
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">3 Months (90d)</label>
            <div className="relative">
              <input
                type="number"
                min="0"
                value={pricing.days90}
                onChange={(e) => handleChange('days90', parseInt(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-bold text-amber-600 dark:text-amber-400"
              />
              <span className="absolute right-2 top-1.5 text-[10px] text-slate-400 font-bold">Pts</span>
            </div>
          </div>

          {/* 180 Days (6 Mo) */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1">
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">6 Months (180d)</label>
            <div className="relative">
              <input
                type="number"
                min="0"
                value={pricing.days180}
                onChange={(e) => handleChange('days180', parseInt(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-bold text-amber-600 dark:text-amber-400"
              />
              <span className="absolute right-2 top-1.5 text-[10px] text-slate-400 font-bold">Pts</span>
            </div>
          </div>

          {/* 365 Days (1 Year) */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1">
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">1 Year (365d)</label>
            <div className="relative">
              <input
                type="number"
                min="0"
                value={pricing.days365}
                onChange={(e) => handleChange('days365', parseInt(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-bold text-amber-600 dark:text-amber-400"
              />
              <span className="absolute right-2 top-1.5 text-[10px] text-slate-400 font-bold">Pts</span>
            </div>
          </div>

          {/* Lifetime */}
          <div className="p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-1">
            <label className="block text-[11px] font-bold text-indigo-700 dark:text-indigo-300">Lifetime Access</label>
            <div className="relative">
              <input
                type="number"
                min="0"
                value={pricing.lifetime}
                onChange={(e) => handleChange('lifetime', parseInt(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-indigo-300 dark:border-indigo-700 bg-white dark:bg-slate-900 text-sm font-bold text-indigo-600 dark:text-indigo-400"
              />
              <span className="absolute right-2 top-1.5 text-[10px] text-indigo-400 font-bold">Pts</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md shadow-amber-600/30 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Pricing...' : 'Save Point Conversion Rates'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
