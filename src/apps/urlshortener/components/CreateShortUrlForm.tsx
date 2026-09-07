import React, { useState } from 'react';
import {
  Link2,
  Sparkles,
  Clipboard,
  ChevronDown,
  ChevronUp,
  Lock,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { ShortUrl } from '../types';
import { createShortUrl, normalizeUrl } from '../services/shortenerService';
import { useAuth } from '../../../context/AuthContext';

interface CreateShortUrlFormProps {
  onSuccess: (shortUrl: ShortUrl) => void;
  currentUser?: any;
  isAdmin?: boolean;
}

export const CreateShortUrlForm: React.FC<CreateShortUrlFormProps> = ({ onSuccess, currentUser, isAdmin }) => {
  const { isAdmin: authIsAdmin } = useAuth();
  const effectiveAdmin = isAdmin ?? authIsAdmin;

  const [targetUrl, setTargetUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [title, setTitle] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [expiryOption, setExpiryOption] = useState<'never' | '1d' | '7d' | '30d'>('never');
  const [password, setPassword] = useState('');
  const [adMode, setAdMode] = useState<'default' | 'enabled' | 'direct'>('default');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setTargetUrl(text.trim());
      }
    } catch {
      // Clipboard access denied or unsupported
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanUrl = targetUrl.trim();
    if (!cleanUrl) {
      setError('Please enter a valid destination URL.');
      return;
    }

    try {
      setLoading(true);

      let expiresAt: number | null = null;
      if (expiryOption === '1d') expiresAt = Date.now() + 24 * 60 * 60 * 1000;
      else if (expiryOption === '7d') expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
      else if (expiryOption === '30d') expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;

      const created = await createShortUrl({
        targetUrl: cleanUrl,
        customSlug: customSlug.trim() || undefined,
        title: title.trim() || undefined,
        createdBy: currentUser?.uid || 'guest',
        creatorEmail: currentUser?.email || undefined,
        expiresAt,
        password: password.trim() || undefined,
        adMode: effectiveAdmin ? adMode : 'default',
        isAdmin: effectiveAdmin,
      });

      // Clear input fields
      setTargetUrl('');
      setCustomSlug('');
      setTitle('');
      setPassword('');
      setShowAdvanced(false);

      onSuccess(created);
    } catch (err: any) {
      setError(err?.message || 'Failed to create short link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const domain = typeof window !== 'undefined' ? window.location.host : 'veloralbillal.top';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-lg shadow-slate-200/50 dark:shadow-none space-y-5">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-violet-50 dark:bg-violet-950/70 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800/80">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Instant Short Link Generator</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Create a New Short Link
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Paste your long or complex web address to generate an easily shareable short link
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-rose-700 dark:text-rose-300 text-xs animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
          <div className="flex-1 font-medium">{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Main Target URL Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            Destination URL <span className="text-rose-500">*</span>
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3.5 text-slate-400 pointer-events-none">
              <Link2 className="w-5 h-5 text-violet-500" />
            </div>
            <input
              type="text"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="https://example.com/very/long/web/page/url..."
              required
              className="w-full pl-11 pr-24 py-3 sm:py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
            />
            <button
              type="button"
              onClick={handlePasteClipboard}
              className="absolute right-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 transition flex items-center gap-1.5 shadow-2xs"
            >
              <Clipboard className="w-3.5 h-3.5 text-violet-500" />
              <span>Paste</span>
            </button>
          </div>
        </div>

        {/* Custom Slug / Alias */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Custom Alias / Slug (Optional)
              </label>
              <span className="text-[10px] text-violet-600 dark:text-violet-400 font-mono font-semibold">domain/random</span>
            </div>
            <div className="flex items-center rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 overflow-hidden focus-within:ring-2 focus-within:ring-violet-500">
              <span className="px-3 text-xs font-mono text-slate-500 border-r border-slate-200 dark:border-slate-700 select-none bg-slate-100/60 dark:bg-slate-800 shrink-0 font-semibold">
                /
              </span>
              <input
                type="text"
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                placeholder="my-link (leave blank for random)"
                className="w-full px-3 py-2.5 text-xs sm:text-sm font-mono text-slate-900 dark:text-white bg-transparent focus:outline-hidden"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Link Title / Note (Optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Facebook Post, App Download, Drive File"
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </div>

        {/* Advanced Options Toggle */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1.5 text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline"
          >
            {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            <span>{showAdvanced ? 'Hide' : 'Show'} Advanced Options (Expiry, Password, Ad Mode)</span>
          </button>

          {showAdvanced && (
            <div className="mt-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3.5 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Expiry selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Expiration</span>
                  </label>
                  <select
                    value={expiryOption}
                    onChange={(e: any) => setExpiryOption(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 font-medium focus:outline-hidden focus:ring-2 focus:ring-violet-500"
                  >
                    <option value="never">Never Expire</option>
                    <option value="1d">Expires in 24 Hours</option>
                    <option value="7d">Expires in 7 Days</option>
                    <option value="30d">Expires in 30 Days</option>
                  </select>
                </div>

                {/* Optional Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Password Protection</span>
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Leave blank for public access"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 font-medium focus:outline-hidden focus:ring-2 focus:ring-violet-500"
                  />
                </div>

                {/* Ad Mode */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Ad & Redirect Mode</span>
                    </label>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      effectiveAdmin 
                        ? 'bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-300' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}>
                      {effectiveAdmin ? 'Admin Control' : 'Locked (Admin Policy)'}
                    </span>
                  </div>

                  {effectiveAdmin ? (
                    <select
                      value={adMode}
                      onChange={(e: any) => setAdMode(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 font-medium focus:outline-hidden focus:ring-2 focus:ring-violet-500"
                    >
                      <option value="default">Default (System Global Policy)</option>
                      <option value="enabled">Ad Interstitial & Countdown</option>
                      <option value="direct">Direct Redirect (No Ads)</option>
                    </select>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>Controlled by admin. Your links follow standard system redirect policy.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-700 hover:from-violet-500 hover:to-indigo-600 text-white font-bold text-sm shadow-md shadow-violet-600/30 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>Generating Short Link...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Shorten URL</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
