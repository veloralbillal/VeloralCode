import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Bot, 
  FileCode, 
  ShieldCheck, 
  Save, 
  RefreshCw, 
  Copy, 
  Check, 
  HelpCircle,
  ExternalLink,
  Sparkles,
  Search,
  Share2,
  Sliders,
  Code2,
  CheckCircle2,
  BarChart3,
  Zap
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { copyTextToClipboard } from '../../utils/helpers';

interface SeoSettings {
  siteTitle: string;
  siteDescription: string;
  siteKeywords: string;
  robotsContent: string;
  googleVerification: string;
  ogImage: string;
  canonicalUrl: string;
  twitterHandle: string;
  authorName: string;
  enableSitemap: boolean;
  enableStructuredData: boolean;
}

export const AdminSeoSettings: React.FC = () => {
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [copiedRobots, setCopiedRobots] = useState(false);
  const [copiedSitemap, setCopiedSitemap] = useState(false);
  const [copiedMeta, setCopiedMeta] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'meta' | 'robots' | 'preview'>('overview');

  const [seo, setSeo] = useState<SeoSettings>({
    siteTitle: 'CodeToolkit & Web Tools Directory',
    siteDescription: 'Discover, run, and share high-performance web components, AI-powered tools, and developer utilities.',
    siteKeywords: 'web tools, code snippets, creator tools, react components, javascript utilities, bot tools, seo tools',
    robotsContent: 'User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /creator/wallet\n\nSitemap: https://veloral-code.vercel.app/sitemap.xml',
    googleVerification: 'google-site-verification=sample_token_verification_code_12345',
    ogImage: 'https://veloral-code.vercel.app/og-preview.png',
    canonicalUrl: 'https://veloral-code.vercel.app',
    twitterHandle: '@codetoolkit',
    authorName: 'CodeToolkit Team',
    enableSitemap: true,
    enableStructuredData: true,
  });

  useEffect(() => {
    const saved = localStorage.getItem('code_toolkit_admin_seo');
    if (saved) {
      try {
        setSeo(JSON.parse(saved));
      } catch (err) {
        console.warn('Failed to parse saved SEO settings', err);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSeo((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (name: keyof SeoSettings) => {
    setSeo((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      localStorage.setItem('code_toolkit_admin_seo', JSON.stringify(seo));
      setSaving(false);
      showToast('Advanced SEO & Robots settings saved successfully!', 'success');
    }, 600);
  };

  const handleCopyRobots = async () => {
    await copyTextToClipboard(seo.robotsContent);
    setCopiedRobots(true);
    showToast('robots.txt content copied!', 'success');
    setTimeout(() => setCopiedRobots(false), 2000);
  };

  const handleCopySitemap = async () => {
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${seo.canonicalUrl}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${seo.canonicalUrl}/#/codes</loc>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${seo.canonicalUrl}/#/explore</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;
    await copyTextToClipboard(sitemapXml);
    setCopiedSitemap(true);
    showToast('Dynamic sitemap.xml copied to clipboard!', 'success');
    setTimeout(() => setCopiedSitemap(false), 2000);
  };

  const handleCopyHtmlTags = async () => {
    const htmlTags = `<!-- Primary Meta Tags -->
<title>${seo.siteTitle}</title>
<meta name="title" content="${seo.siteTitle}">
<meta name="description" content="${seo.siteDescription}">
<meta name="keywords" content="${seo.siteKeywords}">
<meta name="author" content="${seo.authorName}">
<link rel="canonical" href="${seo.canonicalUrl}">
<meta name="google-site-verification" content="${seo.googleVerification}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${seo.canonicalUrl}">
<meta property="og:title" content="${seo.siteTitle}">
<meta property="og:description" content="${seo.siteDescription}">
<meta property="og:image" content="${seo.ogImage}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${seo.canonicalUrl}">
<meta property="twitter:title" content="${seo.siteTitle}">
<meta property="twitter:description" content="${seo.siteDescription}">
<meta property="twitter:image" content="${seo.ogImage}">
<meta name="twitter:creator" content="${seo.twitterHandle}">`;
    await copyTextToClipboard(htmlTags);
    setCopiedMeta(true);
    showToast('HTML meta header tags copied!', 'success');
    setTimeout(() => setCopiedMeta(false), 2000);
  };

  // SEO Health Score Calculation
  const titleScore = seo.siteTitle.length >= 30 && seo.siteTitle.length <= 60 ? 25 : 15;
  const descScore = seo.siteDescription.length >= 120 && seo.siteDescription.length <= 160 ? 25 : 15;
  const keywordsScore = seo.siteKeywords ? 20 : 0;
  const robotsScore = seo.robotsContent ? 15 : 0;
  const canonicalScore = seo.canonicalUrl ? 15 : 0;
  const totalScore = titleScore + descScore + keywordsScore + robotsScore + canonicalScore;

  return (
    <div className="space-y-6 max-w-5xl pb-12">
      {/* Advanced Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-cyan-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md">
              <Globe className="w-3.5 h-3.5" /> Advanced Search Engine Optimization
            </div>
            <h1 className="text-xl sm:text-2xl font-black">SEO, Robots.txt & Meta Tags Master</h1>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl leading-relaxed">
              Fine-tune crawler permissions, real-time Google search snippet previews, structured schema injection, and automated sitemaps.
            </p>
          </div>

          {/* SEO Score Badge */}
          <div className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center gap-4 shrink-0 shadow-inner">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="5" className="text-white/20" fill="none" />
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  stroke="currentColor"
                  strokeWidth="5"
                  className={totalScore >= 80 ? 'text-emerald-400' : totalScore >= 50 ? 'text-amber-400' : 'text-rose-400'}
                  strokeDasharray={150.8}
                  strokeDashoffset={150.8 - (150.8 * totalScore) / 100}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <span className="absolute text-xs font-black">{totalScore}%</span>
            </div>
            <div>
              <p className="text-[11px] text-emerald-200 uppercase tracking-wider font-bold">SEO Health Score</p>
              <p className="text-xs font-bold text-white">
                {totalScore >= 80 ? 'Excellent Optimization' : totalScore >= 50 ? 'Good, Needs Fine-tuning' : 'Needs Attention'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'overview'
              ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>SEO Overview & Audit</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('meta')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'meta'
              ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Meta & OpenGraph Tags</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('robots')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'robots'
              ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>Robots.txt & Sitemap</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'preview'
              ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>Google Search & Social Preview</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Tab 1: Overview & Audit */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Title Length ({seo.siteTitle.length} chars)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {seo.siteTitle.length >= 30 && seo.siteTitle.length <= 60
                  ? 'Optimal length (30-60 characters).'
                  : 'Recommended title length is between 30 and 60 characters for Google serp.'}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Description Length ({seo.siteDescription.length} chars)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {seo.siteDescription.length >= 120 && seo.siteDescription.length <= 160
                  ? 'Optimal length (120-160 characters).'
                  : 'Recommended meta description length is between 120 and 160 characters.'}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Sitemap & Schema</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                XML Sitemap and Structured JSON-LD Data are fully enabled for instant crawler indexing.
              </p>
            </div>

            <div className="md:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                Quick Actions & Generator
              </h3>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleCopyHtmlTags}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-200 transition"
                >
                  {copiedMeta ? <Check className="w-4 h-4 text-emerald-500" /> : <Code2 className="w-4 h-4" />}
                  <span>{copiedMeta ? 'HTML Meta Tags Copied!' : 'Copy Header HTML Meta Tags'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopySitemap}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-200 transition"
                >
                  {copiedSitemap ? <Check className="w-4 h-4 text-emerald-500" /> : <FileCode className="w-4 h-4" />}
                  <span>{copiedSitemap ? 'Sitemap Copied!' : 'Generate & Copy Sitemap.xml'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Meta & OpenGraph Tags */}
        {activeTab === 'meta' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Global Meta & Social OpenGraph Parameters</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Configure title, description, keywords, author, and social preview cards.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Website Title Tag (<span className="font-mono text-indigo-600">&lt;title&gt;</span>)
                </label>
                <input
                  type="text"
                  name="siteTitle"
                  value={seo.siteTitle}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Meta Description (<span className="font-mono text-indigo-600">description</span>)
                </label>
                <textarea
                  name="siteDescription"
                  rows={2}
                  value={seo.siteDescription}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-indigo-500 leading-relaxed"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Keywords (<span className="font-mono text-indigo-600">keywords</span>)
                </label>
                <input
                  type="text"
                  name="siteKeywords"
                  value={seo.siteKeywords}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Canonical URL</label>
                <input
                  type="text"
                  name="canonicalUrl"
                  value={seo.canonicalUrl}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Google Verification Code</label>
                <input
                  type="text"
                  name="googleVerification"
                  value={seo.googleVerification}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Author Name</label>
                <input
                  type="text"
                  name="authorName"
                  value={seo.authorName}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Twitter Handle</label>
                <input
                  type="text"
                  name="twitterHandle"
                  value={seo.twitterHandle}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">OpenGraph Image URL</label>
                <input
                  type="text"
                  name="ogImage"
                  value={seo.ogImage}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Robots.txt & Sitemap */}
        {activeTab === 'robots' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Robots.txt & Sitemap Control</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Define search engine crawler access rules.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCopyRobots}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-xs font-bold text-slate-700 dark:text-slate-300 transition"
              >
                {copiedRobots ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedRobots ? 'Copied' : 'Copy Robots.txt'}</span>
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Robots.txt File Content</label>
              <textarea
                name="robotsContent"
                rows={8}
                value={seo.robotsContent}
                onChange={handleChange}
                className="w-full font-mono bg-slate-950 text-emerald-400 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-xs focus:outline-hidden focus:border-emerald-500 leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">Automated XML Sitemap</h4>
                  <p className="text-[11px] text-slate-500">Auto-generate sitemap for all tools</p>
                </div>
                <input
                  type="checkbox"
                  checked={seo.enableSitemap}
                  onChange={() => handleToggle('enableSitemap')}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">JSON-LD Structured Data</h4>
                  <p className="text-[11px] text-slate-500">Inject SoftwareApplication schema</p>
                </div>
                <input
                  type="checkbox"
                  checked={seo.enableStructuredData}
                  onChange={() => handleToggle('enableStructuredData')}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Google Search & Social Preview */}
        {activeTab === 'preview' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Live Search Engine Snippet Preview</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">See how your website appears on Google Search results.</p>
              </div>
            </div>

            {/* Google Serp Mockup Card */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5 max-w-2xl font-sans">
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">C</div>
                <div className="truncate">
                  <p className="text-slate-800 dark:text-slate-200 font-semibold">{seo.canonicalUrl}</p>
                </div>
              </div>
              <h3 className="text-base font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer line-clamp-1">
                {seo.siteTitle}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                {seo.siteDescription}
              </p>
            </div>
          </div>
        )}

        {/* Submit Save Button */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition active:scale-95 disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Saving...' : 'Save Advanced SEO Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
