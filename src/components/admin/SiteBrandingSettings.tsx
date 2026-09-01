import React, { useState, useEffect } from 'react';
import {
  Globe,
  Save,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Layers,
  Type,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { SiteConfig } from '../../types';

export const SiteBrandingSettings: React.FC = () => {
  const { siteConfig, saveConfig, resetConfig, loading } = useSiteConfig();
  const { showToast } = useToast();
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState<SiteConfig>(siteConfig);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    setFormData(siteConfig);
  }, [siteConfig]);

  const handleChange = (field: keyof SiteConfig, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.siteName.trim()) {
      showToast('Site name cannot be empty', 'error');
      return;
    }
    setSaving(true);
    try {
      await saveConfig(formData, currentUser?.email || 'Admin');
      showToast('Site branding & text settings saved successfully!', 'success');
    } catch (err: any) {
      showToast('Failed to save settings: ' + (err.message || 'Error occurred'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Are you sure you want to reset all site texts to default?')) {
      return;
    }
    setResetting(true);
    try {
      await resetConfig(currentUser?.email || 'Admin');
      showToast('Site branding & texts reset to defaults', 'info');
    } catch (err: any) {
      showToast('Failed to reset: ' + (err.message || 'Error occurred'), 'error');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              User Panel Branding & Text Control
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
                Live RTDB Sync
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Customize the site title, description, and hero banner texts displayed across the User Panel and Footer.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          disabled={resetting || saving || loading}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Site Name */}
          <div className="sm:col-span-2 space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Site Brand Name
            </label>
            <div className="relative">
              <Type className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={formData.siteName}
                onChange={(e) => handleChange('siteName', e.target.value)}
                placeholder="e.g. CodeToolkit"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              />
            </div>
            <p className="text-[11px] text-slate-400">Shown on the Header, Sidebar, Footer, and Page Titles.</p>
          </div>

          {/* Version Badge */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Version Tag
            </label>
            <input
              type="text"
              value={formData.version || 'v2.0'}
              onChange={(e) => handleChange('version', e.target.value)}
              placeholder="e.g. v2.0"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
            />
            <p className="text-[11px] text-slate-400">Small badge next to logo.</p>
          </div>
        </div>

        {/* Site Tagline / Description */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            Site Tagline & Footer Description
          </label>
          <textarea
            rows={3}
            value={formData.siteTagline}
            onChange={(e) => handleChange('siteTagline', e.target.value)}
            placeholder="A high-performance code library, snippet manager..."
            required
            className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition leading-relaxed"
          />
          <p className="text-[11px] text-slate-400">
            This text is displayed in the user panel footer and metadata.
          </p>
        </div>

        {/* Hero Section Banner Texts */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              User Dashboard Hero Banner Texts
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Hero Badge */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Hero Top Badge
              </label>
              <input
                type="text"
                value={formData.heroBadge}
                onChange={(e) => handleChange('heroBadge', e.target.value)}
                placeholder="e.g. Firebase Realtime Database Powered"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              />
            </div>

            {/* Footer Copyright */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Footer Copyright Text
              </label>
              <input
                type="text"
                value={formData.footerCopyright}
                onChange={(e) => handleChange('footerCopyright', e.target.value)}
                placeholder="e.g. Built for developer productivity."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              />
            </div>
          </div>

          {/* Hero Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Hero Main Headline
            </label>
            <input
              type="text"
              value={formData.heroTitle}
              onChange={(e) => handleChange('heroTitle', e.target.value)}
              placeholder="e.g. Live Web Tools, Code Snippets & Output Hub"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
            />
          </div>

          {/* Hero Subtitle */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Hero Description
            </label>
            <textarea
              rows={2}
              value={formData.heroDescription}
              onChange={(e) => handleChange('heroDescription', e.target.value)}
              placeholder="e.g. Explore live interactive web apps, tools, widgets..."
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
            />
          </div>
        </div>

        {/* Live Preview Box */}
        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
            <span>Live Preview of Footer Branding:</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-left space-y-1.5">
            <p className="font-bold text-white text-sm flex items-center gap-2">
              {formData.siteName || 'CodeToolkit'}
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800">
                {formData.version || 'v2.0'}
              </span>
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              {formData.siteTagline || 'A high-performance code library...'}
            </p>
            <p className="text-[10px] text-slate-500 pt-1">
              © {new Date().getFullYear()} {formData.siteName || 'CodeToolkit'}. {formData.footerCopyright}
            </p>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving || loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving to Firebase...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Site Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
