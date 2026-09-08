import React, { useState, useEffect } from 'react';
import {
  Link2,
  Sparkles,
  Layers,
  Eye,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  Search,
  Sliders,
  Tv,
  Save,
  CheckCircle2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  PlusCircle,
  Calendar,
  Clock,
  Zap,
  Code,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import {
  ShortUrl,
  ShortenerAdsConfig,
  DEFAULT_ADS_CONFIG,
  AdZoneItem,
} from '../../apps/urlshortener/types';
import {
  subscribeAllShortUrls,
  updateShortUrl,
  deleteShortUrl,
  getShortenerAdsConfig,
  saveShortenerAdsConfig,
  createShortUrl,
} from '../../apps/urlshortener/services/shortenerService';
import { ShortUrlResultModal } from '../../apps/urlshortener/components/ShortUrlResultModal';

interface AdminShortenerManagerProps {
  onNavigate?: (route: string) => void;
}

export const AdminShortenerManager: React.FC<AdminShortenerManagerProps> = ({ onNavigate }) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'links' | 'ads' | 'create'>('links');
  const [urls, setUrls] = useState<ShortUrl[]>([]);
  const [adsConfig, setAdsConfig] = useState<ShortenerAdsConfig>(DEFAULT_ADS_CONFIG);
  const [search, setSearch] = useState('');
  const [savingAds, setSavingAds] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [selectedQrUrl, setSelectedQrUrl] = useState<ShortUrl | null>(null);

  // Link ad script editing modal state
  const [selectedEditUrl, setSelectedEditUrl] = useState<ShortUrl | null>(null);
  const [editHeaderHtml, setEditHeaderHtml] = useState('');
  const [editBodyStartHtml, setEditBodyStartHtml] = useState('');
  const [editFooterHtml, setEditFooterHtml] = useState('');
  const [editAdMode, setEditAdMode] = useState<'default' | 'enabled' | 'direct'>('default');
  const [savingEditUrl, setSavingEditUrl] = useState(false);

  // Admin link creator inputs
  const [adminTargetUrl, setAdminTargetUrl] = useState('');
  const [adminSlug, setAdminSlug] = useState('');
  const [adminTitle, setAdminTitle] = useState('');
  const [adminCreating, setAdminCreating] = useState(false);

  const openEditModal = (item: ShortUrl) => {
    setSelectedEditUrl(item);
    setEditHeaderHtml(item.customHeaderHtml || '');
    setEditBodyStartHtml(item.customBodyStartHtml || '');
    setEditFooterHtml(item.customFooterHtml || '');
    setEditAdMode(item.adMode || 'default');
  };

  const handleSaveEditUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEditUrl) return;
    setSavingEditUrl(true);
    try {
      await updateShortUrl(selectedEditUrl.slug, {
        customHeaderHtml: editHeaderHtml,
        customBodyStartHtml: editBodyStartHtml,
        customFooterHtml: editFooterHtml,
        adMode: editAdMode,
      });
      showToast('Link custom ad scripts updated successfully!', 'success');
      setSelectedEditUrl(null);
    } catch (err) {
      showToast('Failed to update link ad scripts', 'error');
    } finally {
      setSavingEditUrl(false);
    }
  };

  // Realtime subscription for all short URLs
  useEffect(() => {
    const unsubscribe = subscribeAllShortUrls((data) => {
      setUrls(data);
    });

    // Load ads settings
    getShortenerAdsConfig().then((cfg) => {
      setAdsConfig(cfg);
    });

    return () => unsubscribe();
  }, []);

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://veloralbillal.top';

  // Metrics
  const totalLinks = urls.length;
  const totalClicks = urls.reduce((acc, curr) => acc + (curr.clicks || 0), 0);
  const activeLinksCount = urls.filter((u) => u.enabled !== false).length;
  const disabledLinksCount = urls.filter((u) => u.enabled === false).length;

  const handleCopy = async (slug: string) => {
    try {
      const fullUrl = `${origin}/${slug}`;
      await navigator.clipboard.writeText(fullUrl);
      setCopiedSlug(slug);
      showToast(`Direct link copied: /${slug}`, 'success');
      setTimeout(() => setCopiedSlug(null), 2000);
    } catch {}
  };

  const handleToggleStatus = async (item: ShortUrl) => {
    const newStatus = !item.enabled;
    try {
      await updateShortUrl(item.slug, { enabled: newStatus });
      showToast(`Link marked as ${newStatus ? 'Active' : 'Disabled'}`, 'info');
    } catch (err) {
      showToast('Failed to update link status', 'error');
    }
  };

  const handleDelete = async (slug: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete /r/${slug}?`)) return;
    try {
      await deleteShortUrl(slug);
      showToast('Link deleted successfully', 'success');
    } catch (err) {
      showToast('Failed to delete link', 'error');
    }
  };

  const handleSaveAds = async () => {
    try {
      setSavingAds(true);
      await saveShortenerAdsConfig(adsConfig);
      showToast('Ads control configuration saved successfully!', 'success');
    } catch (err) {
      showToast('Failed to save settings', 'error');
    } finally {
      setSavingAds(false);
    }
  };

  const handleAdminCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminTargetUrl.trim()) return;

    try {
      setAdminCreating(true);
      const created = await createShortUrl({
        targetUrl: adminTargetUrl,
        customSlug: adminSlug.trim() || undefined,
        title: adminTitle.trim() || undefined,
        createdBy: 'admin',
        creatorEmail: 'admin@veloralcode.top',
      });

      showToast(`Custom link created successfully: /r/${created.slug}`, 'success');
      setAdminTargetUrl('');
      setAdminSlug('');
      setAdminTitle('');
      setSelectedQrUrl(created);
      setActiveTab('links');
    } catch (err: any) {
      showToast(err?.message || 'Failed to create link', 'error');
    } finally {
      setAdminCreating(false);
    }
  };

  // Filtered links
  const filteredUrls = urls.filter((item) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      item.slug.toLowerCase().includes(q) ||
      item.targetUrl.toLowerCase().includes(q) ||
      (item.title && item.title.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold">
            <span>Total Short Links</span>
            <Layers className="w-4 h-4 text-violet-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {totalLinks}
          </div>
          <p className="text-[10px] text-slate-400">Stored in database</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold">
            <span>Total Clicks</span>
            <Eye className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {totalClicks}
          </div>
          <p className="text-[10px] text-slate-400">All visitor clicks</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold">
            <span>Active Links</span>
            <ShieldCheck className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {activeLinksCount}
          </div>
          <p className="text-[10px] text-emerald-500 font-semibold">Live & accessible</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold">
            <span>Monetization Mode</span>
            <Tv className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white truncate">
            {adsConfig.globalAdMode === 'interstitial' ? 'Ad Interstitial' : 'Direct (No Ads)'}
          </div>
          <p className="text-[10px] text-amber-500 font-semibold">
            Countdown: {adsConfig.countdownSeconds}s
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 overflow-x-auto">
        <button
          onClick={() => setActiveTab('links')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'links'
              ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>All Short Links ({urls.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ads')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'ads'
              ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Tv className="w-4 h-4 text-amber-500" />
          <span>Ads Control Zone (Ads & Redirection)</span>
        </button>

        <button
          onClick={() => setActiveTab('create')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'create'
              ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <PlusCircle className="w-4 h-4 text-emerald-500" />
          <span>Admin Quick Generator</span>
        </button>
      </div>

      {/* Tab 1: All Short Links Management */}
      {activeTab === 'links' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                All Short Links in Database
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Activate or disable links, inspect click analytics, or remove links
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search alias or destination URL..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          {filteredUrls.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No short links found
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUrls.map((item) => {
                const isCopied = copiedSlug === item.slug;
                const fullUrl = `${origin}/${item.slug}`;

                return (
                  <div
                    key={item.slug}
                    className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 px-2 rounded-xl transition"
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-black text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/60 px-2 py-0.5 rounded-md border border-violet-200 dark:border-violet-800">
                          /{item.slug}
                        </span>

                        {item.title && (
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                            {item.title}
                          </span>
                        )}

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.enabled !== false
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                              : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                          }`}
                        >
                          {item.enabled !== false ? '● Active' : '● Disabled'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate max-w-lg">
                        {item.targetUrl}
                      </p>

                      <div className="flex items-center gap-3 text-[10px] text-slate-400">
                        <span>Clicks: <b className="text-emerald-500 font-bold">{item.clicks || 0}</b></span>
                        <span>•</span>
                        <span>Created: {new Date(item.createdAt).toLocaleDateString()}</span>
                        {item.creatorEmail && (
                          <>
                            <span>•</span>
                            <span className="truncate max-w-[140px]">{item.creatorEmail}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-center">
                      {/* Active/Disable Toggle Button */}
                      <button
                        onClick={() => handleToggleStatus(item)}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                          item.enabled !== false
                            ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100'
                            : 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-400 hover:bg-rose-100'
                        }`}
                        title="Toggle status"
                      >
                        {item.enabled !== false ? (
                          <>
                            <ToggleRight className="w-4 h-4 text-emerald-500" />
                            <span className="hidden sm:inline">Active</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-4 h-4 text-rose-500" />
                            <span className="hidden sm:inline">Disabled</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleCopy(item.slug)}
                        className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-violet-50 dark:hover:bg-violet-950 hover:text-violet-600 transition"
                        title="Copy link"
                      >
                        {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => setSelectedQrUrl(item)}
                        className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                        title="QR Code"
                      >
                        <QrCode className="w-4 h-4 text-violet-500" />
                      </button>

                      <button
                        onClick={() => openEditModal(item)}
                        className="px-2.5 py-1.5 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900 transition flex items-center gap-1 text-xs font-bold"
                        title="Edit Custom Ad Scripts for this Link"
                      >
                        <Code className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Ads</span>
                      </button>

                      <a
                        href={fullUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                        title="Test link"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>

                      <button
                        onClick={() => handleDelete(item.slug)}
                        className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 transition"
                        title="Delete link"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Ads Control Zone */}
      {activeTab === 'ads' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/80 mb-1">
                <Tv className="w-3.5 h-3.5" />
                <span>Advertising & Monetization Control Center</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Shortener Ads Zones & Redirection Policy
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure countdown timer, banner advertisements, and destination redirect behavior for short link visitors
              </p>
            </div>

            <button
              onClick={handleSaveAds}
              disabled={savingAds}
              className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-violet-600/30 disabled:opacity-50 shrink-0"
            >
              {savingAds ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </div>

          {/* Global Mode & Countdown Configuration */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-violet-500" />
              <span>Global Redirection & Timer Mode</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Ad Mode Radio Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Default Redirection Strategy:
                </label>
                <div className="space-y-2">
                  <label
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                      adsConfig.globalAdMode === 'interstitial'
                        ? 'bg-violet-50 dark:bg-violet-950/40 border-violet-500 text-slate-900 dark:text-white'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="globalAdMode"
                      checked={adsConfig.globalAdMode === 'interstitial'}
                      onChange={() => setAdsConfig({ ...adsConfig, globalAdMode: 'interstitial' })}
                      className="mt-1"
                    />
                    <div className="space-y-0.5">
                      <span className="text-xs font-black">
                        Ad-Supported Interstitial (Ads & Countdown Page)
                      </span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                        Visitors see your custom banner sponsors and countdown timer before being redirected to the destination URL.
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                      adsConfig.globalAdMode === 'direct'
                        ? 'bg-violet-50 dark:bg-violet-950/40 border-violet-500 text-slate-900 dark:text-white'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="globalAdMode"
                      checked={adsConfig.globalAdMode === 'direct'}
                      onChange={() => setAdsConfig({ ...adsConfig, globalAdMode: 'direct' })}
                      className="mt-1"
                    />
                    <div className="space-y-0.5">
                      <span className="text-xs font-black">
                        Direct Instant 301 Redirect (Zero Ads)
                      </span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                        Bypasses the interstitial page and immediately forwards visitors directly to the destination link.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Countdown duration & Early Skip */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Countdown Duration (Seconds):
                    </label>
                    <span className="font-mono text-xs font-bold text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-900/60 px-2 py-0.5 rounded-md">
                      {adsConfig.countdownSeconds} seconds
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    step="1"
                    value={adsConfig.countdownSeconds}
                    onChange={(e) =>
                      setAdsConfig({ ...adsConfig, countdownSeconds: parseInt(e.target.value, 10) })
                    }
                    className="w-full accent-violet-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>1 sec (Fast)</span>
                    <span>5 sec (Recommended)</span>
                    <span>15 sec (Max)</span>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={adsConfig.allowEarlySkip}
                      onChange={(e) =>
                        setAdsConfig({ ...adsConfig, allowEarlySkip: e.target.checked })
                      }
                      className="rounded accent-violet-600"
                    />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Allow visitors to click "Skip Ad" before timer completes
                    </span>
                  </label>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Notice / Announcement message on redirect page:
                  </label>
                  <input
                    type="text"
                    value={adsConfig.noticeText || ''}
                    onChange={(e) => setAdsConfig({ ...adsConfig, noticeText: e.target.value })}
                    placeholder="Preparing your destination link. Please wait a few seconds..."
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Ad Zone 1: Top Header Banner */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300">
                  Ad Zone 1
                </span>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  Header Banner Advertisement
                </h4>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={adsConfig.headerBanner.enabled}
                  onChange={(e) =>
                    setAdsConfig({
                      ...adsConfig,
                      headerBanner: { ...adsConfig.headerBanner, enabled: e.target.checked },
                    })
                  }
                  className="accent-violet-600 rounded"
                />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {adsConfig.headerBanner.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </label>
            </div>

            {adsConfig.headerBanner.enabled && (
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Ad Type:
                    </label>
                    <select
                      value={adsConfig.headerBanner.type}
                      onChange={(e: any) =>
                        setAdsConfig({
                          ...adsConfig,
                          headerBanner: { ...adsConfig.headerBanner, type: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200"
                    >
                      <option value="banner">Banner Image + Click Target</option>
                      <option value="html">Custom HTML / Ad Network Script</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Banner Title / Alt Text:
                    </label>
                    <input
                      type="text"
                      value={adsConfig.headerBanner.title || ''}
                      onChange={(e) =>
                        setAdsConfig({
                          ...adsConfig,
                          headerBanner: { ...adsConfig.headerBanner, title: e.target.value },
                        })
                      }
                      placeholder="e.g., Premium Cloud Hosting Deal"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {adsConfig.headerBanner.type === 'banner' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Banner Image URL:
                      </label>
                      <input
                        type="text"
                        value={adsConfig.headerBanner.imageUrl}
                        onChange={(e) =>
                          setAdsConfig({
                            ...adsConfig,
                            headerBanner: { ...adsConfig.headerBanner, imageUrl: e.target.value },
                          })
                        }
                        placeholder="https://example.com/banner-728x90.jpg"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Target Destination URL:
                      </label>
                      <input
                        type="text"
                        value={adsConfig.headerBanner.clickUrl}
                        onChange={(e) =>
                          setAdsConfig({
                            ...adsConfig,
                            headerBanner: { ...adsConfig.headerBanner, clickUrl: e.target.value },
                          })
                        }
                        placeholder="https://veloralbillal.top"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Custom HTML/Script Code:
                    </label>
                    <textarea
                      rows={3}
                      value={adsConfig.headerBanner.htmlCode || ''}
                      onChange={(e) =>
                        setAdsConfig({
                          ...adsConfig,
                          headerBanner: { ...adsConfig.headerBanner, htmlCode: e.target.value },
                        })
                      }
                      placeholder="<script async src='...'>...</script>"
                      className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-emerald-400"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Ad Zone 2: Middle Sponsor Ad */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                  Ad Zone 2
                </span>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  Middle Sponsored Card
                </h4>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={adsConfig.middleAd.enabled}
                  onChange={(e) =>
                    setAdsConfig({
                      ...adsConfig,
                      middleAd: { ...adsConfig.middleAd, enabled: e.target.checked },
                    })
                  }
                  className="accent-violet-600 rounded"
                />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {adsConfig.middleAd.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </label>
            </div>

            {adsConfig.middleAd.enabled && (
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Ad Type:
                    </label>
                    <select
                      value={adsConfig.middleAd.type}
                      onChange={(e: any) =>
                        setAdsConfig({
                          ...adsConfig,
                          middleAd: { ...adsConfig.middleAd, type: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200"
                    >
                      <option value="banner">Banner Image + Click Target</option>
                      <option value="html">Custom HTML / Ad Network Script</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Sponsor Title:
                    </label>
                    <input
                      type="text"
                      value={adsConfig.middleAd.title || ''}
                      onChange={(e) =>
                        setAdsConfig({
                          ...adsConfig,
                          middleAd: { ...adsConfig.middleAd, title: e.target.value },
                        })
                      }
                      placeholder="e.g., Best Cloud Hosting Discounts"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {adsConfig.middleAd.type === 'banner' ? (
                  <>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Short Description:
                      </label>
                      <input
                        type="text"
                        value={adsConfig.middleAd.description || ''}
                        onChange={(e) =>
                          setAdsConfig({
                            ...adsConfig,
                            middleAd: { ...adsConfig.middleAd, description: e.target.value },
                          })
                        }
                        placeholder="Claim this exclusive limited-time offer now"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Thumbnail Image URL:
                        </label>
                        <input
                          type="text"
                          value={adsConfig.middleAd.imageUrl}
                          onChange={(e) =>
                            setAdsConfig({
                              ...adsConfig,
                              middleAd: { ...adsConfig.middleAd, imageUrl: e.target.value },
                            })
                          }
                          placeholder="https://images.unsplash.com/photo-..."
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Destination Target URL:
                        </label>
                        <input
                          type="text"
                          value={adsConfig.middleAd.clickUrl}
                          onChange={(e) =>
                            setAdsConfig({
                              ...adsConfig,
                              middleAd: { ...adsConfig.middleAd, clickUrl: e.target.value },
                            })
                          }
                          placeholder="https://veloralbillal.top"
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Custom HTML/Script Code:
                    </label>
                    <textarea
                      rows={3}
                      value={adsConfig.middleAd.htmlCode || ''}
                      onChange={(e) =>
                        setAdsConfig({
                          ...adsConfig,
                          middleAd: { ...adsConfig.middleAd, htmlCode: e.target.value },
                        })
                      }
                      placeholder="<script async src='...'>...</script>"
                      className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-emerald-400"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Ad Zone 3: Footer Sticky Banner */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300">
                  Ad Zone 3
                </span>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  Footer Banner Ad Zone
                </h4>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={adsConfig.footerBanner.enabled}
                  onChange={(e) =>
                    setAdsConfig({
                      ...adsConfig,
                      footerBanner: { ...adsConfig.footerBanner, enabled: e.target.checked },
                    })
                  }
                  className="accent-violet-600 rounded"
                />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {adsConfig.footerBanner.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </label>
            </div>

            {adsConfig.footerBanner.enabled && (
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Ad Type:
                    </label>
                    <select
                      value={adsConfig.footerBanner.type}
                      onChange={(e: any) =>
                        setAdsConfig({
                          ...adsConfig,
                          footerBanner: { ...adsConfig.footerBanner, type: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200"
                    >
                      <option value="banner">Banner Image / Simple Link</option>
                      <option value="html">Custom HTML / Ad Network Script</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Banner Title:
                    </label>
                    <input
                      type="text"
                      value={adsConfig.footerBanner.title || ''}
                      onChange={(e) =>
                        setAdsConfig({
                          ...adsConfig,
                          footerBanner: { ...adsConfig.footerBanner, title: e.target.value },
                        })
                      }
                      placeholder="Sponsored Footer Banner"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {adsConfig.footerBanner.type === 'banner' ? (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Footer Target Link:
                    </label>
                    <input
                      type="text"
                      value={adsConfig.footerBanner.clickUrl}
                      onChange={(e) =>
                        setAdsConfig({
                          ...adsConfig,
                          footerBanner: { ...adsConfig.footerBanner, clickUrl: e.target.value },
                        })
                      }
                      placeholder="https://veloralbillal.top"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white"
                    />
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Custom HTML/Script Code:
                    </label>
                    <textarea
                      rows={3}
                      value={adsConfig.footerBanner.htmlCode || ''}
                      onChange={(e) =>
                        setAdsConfig({
                          ...adsConfig,
                          footerBanner: { ...adsConfig.footerBanner, htmlCode: e.target.value },
                        })
                      }
                      placeholder="<script async src='...'>...</script>"
                      className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-emerald-400"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Global Script Injection Points */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                Global Injection
              </span>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                Global Script & Ad Network Tags (Header, Body-Start, Footer)
              </h4>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Paste Adsterra, Google AdSense, or analytics scripts here to inject them globally across all short link redirect pages.
            </p>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Global Header Injection (<code className="text-violet-500">&lt;head&gt;</code>):
                </label>
                <textarea
                  rows={3}
                  value={adsConfig.headerInjectHtml || ''}
                  onChange={(e) => setAdsConfig({ ...adsConfig, headerInjectHtml: e.target.value })}
                  placeholder="<script async src='https://pagead2.googlesyndication.com/...'>...</script>"
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-emerald-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Global Body-Start Injection (<code className="text-violet-500">&lt;body&gt; top</code> - Popunder / Social Bar):
                </label>
                <textarea
                  rows={3}
                  value={adsConfig.bodyStartInjectHtml || ''}
                  onChange={(e) => setAdsConfig({ ...adsConfig, bodyStartInjectHtml: e.target.value })}
                  placeholder="<script type='text/javascript' src='//pl123456.highcpmgate.com/...'></script>"
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-emerald-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Global Footer Injection (<code className="text-violet-500">&lt;body&gt; bottom</code>):
                </label>
                <textarea
                  rows={3}
                  value={adsConfig.footerInjectHtml || ''}
                  onChange={(e) => setAdsConfig({ ...adsConfig, footerInjectHtml: e.target.value })}
                  placeholder="<!-- Footer tracking or banner tags -->"
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-emerald-400"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleSaveAds}
              disabled={savingAds}
              className="px-6 py-3 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-md shadow-violet-600/30 flex items-center gap-2 transition"
            >
              <Save className="w-4 h-4" />
              <span>Save All Settings</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Admin Quick Generator */}
      {activeTab === 'create' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 space-y-5 shadow-sm max-w-2xl">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Admin VIP Custom Link Generator
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Create branded aliases (e.g. /r/offer, /r/app, /r/promo) with real-time sync
            </p>
          </div>

          <form onSubmit={handleAdminCreateLink} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Destination URL <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={adminTargetUrl}
                onChange={(e) => setAdminTargetUrl(e.target.value)}
                placeholder="https://example.com/target..."
                required
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Custom Alias (Slug):
                </label>
                <div className="flex items-center rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <span className="px-3 text-xs text-slate-400 font-mono bg-slate-100 dark:bg-slate-700/50">
                    /r/
                  </span>
                  <input
                    type="text"
                    value={adminSlug}
                    onChange={(e) => setAdminSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                    placeholder="special-deal"
                    className="w-full px-3 py-2.5 text-xs font-mono text-slate-900 dark:text-white bg-transparent"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Link Title / Tag:
                </label>
                <input
                  type="text"
                  value={adminTitle}
                  onChange={(e) => setAdminTitle(e.target.value)}
                  placeholder="Official Promotion Link"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={adminCreating}
              className="w-full py-3.5 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-md shadow-violet-600/30 transition flex items-center justify-center gap-2"
            >
              {adminCreating ? (
                <span>Generating...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Create & Publish Link</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* QR Code Modal preview */}
      {selectedQrUrl && (
        <ShortUrlResultModal
          shortUrl={selectedQrUrl}
          onClose={() => setSelectedQrUrl(null)}
        />
      )}

      {/* Edit Link Custom Ads & Scripts Modal */}
      {selectedEditUrl && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-black flex items-center gap-2">
                  <Code className="w-4 h-4 text-violet-400" />
                  <span>Configure Ads for /{selectedEditUrl.slug}</span>
                </h3>
                <p className="text-xs text-slate-400 truncate max-w-md">{selectedEditUrl.targetUrl}</p>
              </div>
              <button
                onClick={() => setSelectedEditUrl(null)}
                className="text-slate-400 hover:text-white text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditUrl} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">
                  Link Redirection Policy:
                </label>
                <select
                  value={editAdMode}
                  onChange={(e: any) => setEditAdMode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-white"
                >
                  <option value="default">Use Global Default Policy</option>
                  <option value="enabled">Force Ad Interstitial + Countdown</option>
                  <option value="direct">Force Direct Redirect (Skip Ads)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">
                  Custom Header HTML / Script (<code className="text-violet-400">&lt;head&gt;</code>):
                </label>
                <textarea
                  rows={3}
                  value={editHeaderHtml}
                  onChange={(e) => setEditHeaderHtml(e.target.value)}
                  placeholder="<script>...</script>"
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">
                  Custom Body-Start HTML / Script (<code className="text-violet-400">&lt;body&gt; top</code> - Popunder):
                </label>
                <textarea
                  rows={3}
                  value={editBodyStartHtml}
                  onChange={(e) => setEditBodyStartHtml(e.target.value)}
                  placeholder="<script type='text/javascript' src='...'></script>"
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">
                  Custom Footer HTML / Script (<code className="text-violet-400">&lt;body&gt; bottom</code>):
                </label>
                <textarea
                  rows={3}
                  value={editFooterHtml}
                  onChange={(e) => setEditFooterHtml(e.target.value)}
                  placeholder="<!-- Footer ad tags -->"
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedEditUrl(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEditUrl}
                  className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-violet-600/30 cursor-pointer"
                >
                  {savingEditUrl ? <span>Saving...</span> : <span>Save Link Ad Scripts</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminShortenerManager;
