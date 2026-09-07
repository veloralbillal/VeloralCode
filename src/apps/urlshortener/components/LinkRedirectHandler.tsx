import React, { useState, useEffect, useRef } from 'react';
import {
  Link2,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Lock,
  CheckCircle2,
  Home,
  RefreshCw,
} from 'lucide-react';
import { ShortUrl, ShortenerAdsConfig, DEFAULT_ADS_CONFIG } from '../types';
import {
  getShortUrlBySlug,
  recordLinkClick,
  getShortenerAdsConfig,
} from '../services/shortenerService';

interface LinkRedirectHandlerProps {
  slug: string;
  onNavigate?: (route: string) => void;
}

export const LinkRedirectHandler: React.FC<LinkRedirectHandlerProps> = ({ slug, onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const [shortUrl, setShortUrl] = useState<ShortUrl | null>(null);
  const [adsConfig, setAdsConfig] = useState<ShortenerAdsConfig>(DEFAULT_ADS_CONFIG);
  const [errorStatus, setErrorStatus] = useState<'not_found' | 'disabled' | 'expired' | null>(null);

  // Password state
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordUnlocked, setPasswordUnlocked] = useState(false);

  // Countdown & Redirect states
  const [countdown, setCountdown] = useState<number>(5);
  const [isReady, setIsReady] = useState(false);
  const clickLoggedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);
        const [urlData, configData] = await Promise.all([
          getShortUrlBySlug(slug),
          getShortenerAdsConfig(),
        ]);

        if (!isMounted) return;

        setAdsConfig(configData);

        if (!urlData) {
          setErrorStatus('not_found');
          setLoading(false);
          return;
        }

        if (urlData.enabled === false) {
          setErrorStatus('disabled');
          setLoading(false);
          return;
        }

        if (urlData.expiresAt && Date.now() > urlData.expiresAt) {
          setErrorStatus('expired');
          setLoading(false);
          return;
        }

        setShortUrl(urlData);

        // Check if direct redirect mode
        const shouldDirectRedirect =
          urlData.adMode === 'direct' ||
          (urlData.adMode === 'default' && configData.globalAdMode === 'direct');

        if (shouldDirectRedirect && !urlData.password) {
          // Log click and redirect immediately
          if (!clickLoggedRef.current) {
            clickLoggedRef.current = true;
            recordLinkClick(slug);
          }
          window.location.replace(urlData.targetUrl);
          return;
        }

        // Set countdown
        const duration = Math.max(1, configData.countdownSeconds || 5);
        setCountdown(duration);

        // Record click once
        if (!clickLoggedRef.current) {
          clickLoggedRef.current = true;
          recordLinkClick(slug);
        }
      } catch (err) {
        console.error('Redirect handler error:', err);
        setErrorStatus('not_found');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Countdown timer effect
  useEffect(() => {
    if (loading || errorStatus || !shortUrl) return;
    if (shortUrl.password && !passwordUnlocked) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsReady(true);
    }
  }, [countdown, loading, errorStatus, shortUrl, passwordUnlocked]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shortUrl) return;
    if (passwordInput === shortUrl.password) {
      setPasswordUnlocked(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const handleProceed = () => {
    if (!shortUrl) return;
    window.location.href = shortUrl.targetUrl;
  };

  // Helper to extract domain name
  const getDomainName = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.hostname;
    } catch {
      return url;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-center text-white">
        <div className="w-16 h-16 rounded-3xl bg-violet-600/20 text-violet-400 flex items-center justify-center mb-4 border border-violet-500/30">
          <RefreshCw className="w-8 h-8 animate-spin" />
        </div>
        <h2 className="text-xl font-bold mb-2">Verifying Destination Link...</h2>
        <p className="text-xs text-slate-400 font-mono">/r/{slug}</p>
      </div>
    );
  }

  // Error states (Not found, expired, disabled)
  if (errorStatus || !shortUrl) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl text-white">
          <div className="w-16 h-16 rounded-3xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto border border-rose-500/20">
            <AlertCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black">
              {errorStatus === 'disabled'
                ? 'Link Temporarily Disabled'
                : errorStatus === 'expired'
                ? 'Link Has Expired'
                : 'Link Not Found'}
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              {errorStatus === 'disabled'
                ? 'This link has been deactivated by the administrator or creator.'
                : errorStatus === 'expired'
                ? 'This short link has reached its scheduled expiration date.'
                : `The requested short link (/r/${slug}) is invalid or has been deleted.`}
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <button
              onClick={() => (onNavigate ? onNavigate('#/app/shortener') : (window.location.hash = '#/app/shortener'))}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-violet-600/30"
            >
              <Link2 className="w-4 h-4" />
              <span>Create Short Link</span>
            </button>

            <button
              onClick={() => (onNavigate ? onNavigate('#/') : (window.location.hash = '#/'))}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Password protection prompt
  if (shortUrl.password && !passwordUnlocked) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl text-white">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto border border-amber-500/20">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-black">Password Protected Link</h2>
            <p className="text-xs text-slate-400">
              Enter the access password specified by the link creator
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-3">
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Enter password..."
              required
              className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-sm text-center text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />

            {passwordError && (
              <p className="text-xs text-rose-400 font-bold">Incorrect password! Please try again.</p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition"
            >
              Unlock Link
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Render Interstitial Ad & Countdown Page
  const totalDuration = adsConfig.countdownSeconds || 5;
  const progressPercent = Math.min(100, Math.round(((totalDuration - countdown) / totalDuration) * 100));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between py-6 px-4 sm:px-6 selection:bg-violet-500 selection:text-white">
      {/* Top Section: Header & Ad Zone 1 */}
      <div className="max-w-3xl w-full mx-auto space-y-4">
        {/* Brand bar */}
        <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center text-white shadow-md shadow-violet-600/30">
              <Link2 className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm text-white">Veloral Link Redirect</span>
          </div>

          <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/60">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified & Secure</span>
          </span>
        </div>

        {/* Ad Zone 1: Header Banner */}
        {adsConfig.headerBanner?.enabled && (
          <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-md">
            <div className="px-3 py-1 bg-slate-800/60 text-[10px] uppercase tracking-wider text-slate-400 font-bold flex items-center justify-between">
              <span>Sponsored Ad</span>
              <span>Ad Zone 1</span>
            </div>
            {adsConfig.headerBanner.type === 'html' && adsConfig.headerBanner.htmlCode ? (
              <div
                className="p-3 overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: adsConfig.headerBanner.htmlCode }}
              />
            ) : (
              <a
                href={adsConfig.headerBanner.clickUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                {adsConfig.headerBanner.imageUrl ? (
                  <img
                    src={adsConfig.headerBanner.imageUrl}
                    alt="Advertisement"
                    className="w-full max-h-36 object-cover group-hover:opacity-90 transition"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="p-4 bg-gradient-to-r from-violet-900/40 to-indigo-950/40 text-center space-y-1">
                    <p className="text-sm font-bold text-violet-300">
                      {adsConfig.headerBanner.title || 'Sponsored Banner Ad'}
                    </p>
                    <p className="text-xs text-slate-400">
                      {adsConfig.headerBanner.description || 'Promote your brand here'}
                    </p>
                  </div>
                )}
              </a>
            )}
          </div>
        )}
      </div>

      {/* Center Section: Destination & Countdown Box */}
      <div className="max-w-lg w-full mx-auto my-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
        {/* Notice text */}
        {adsConfig.noticeText && (
          <p className="text-xs text-slate-400 font-medium">
            {adsConfig.noticeText}
          </p>
        )}

        {/* Destination preview */}
        <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2 text-left">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Destination:
          </span>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center shrink-0">
              <ExternalLink className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white truncate">
                {shortUrl.title || getDomainName(shortUrl.targetUrl)}
              </p>
              <p className="text-xs text-slate-400 font-mono truncate">
                {getDomainName(shortUrl.targetUrl)}
              </p>
            </div>
          </div>
        </div>

        {/* Circular / Big Countdown Visual */}
        <div className="py-2">
          {!isReady ? (
            <div className="space-y-3">
              <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                {/* SVG Progress Circle */}
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    className="text-slate-800 stroke-current"
                    strokeWidth="8"
                    fill="transparent"
                    r="38"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-violet-500 stroke-current transition-all duration-1000 ease-linear"
                    strokeWidth="8"
                    strokeDasharray={238.76}
                    strokeDashoffset={238.76 - (238.76 * progressPercent) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                    r="38"
                    cx="50"
                    cy="50"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-white">{countdown}</span>
                  <span className="text-[9px] text-slate-400 font-semibold uppercase">sec</span>
                </div>
              </div>
              <p className="text-xs text-slate-400">
                Your link is being prepared... please wait
              </p>
            </div>
          ) : (
            <div className="space-y-2 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <p className="text-sm font-bold text-emerald-400">
                Link is ready! Click below to proceed
              </p>
            </div>
          )}
        </div>

        {/* Primary Proceed Action */}
        <div>
          <button
            onClick={handleProceed}
            disabled={!isReady && !adsConfig.allowEarlySkip}
            className={`w-full py-3.5 px-6 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
              isReady
                ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 text-white shadow-emerald-600/30 animate-pulse'
                : adsConfig.allowEarlySkip
                ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-violet-600/30'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
            }`}
          >
            <span>
              {isReady
                ? 'Get Destination Link'
                : adsConfig.allowEarlySkip
                ? 'Skip Ad'
                : `Preparing link (${countdown}s)...`}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Ad Zone 2: Middle Sponsor Card */}
        {adsConfig.middleAd?.enabled && (
          <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-3 text-left space-y-2">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
              Sponsored Offer
            </div>
            {adsConfig.middleAd.type === 'html' && adsConfig.middleAd.htmlCode ? (
              <div dangerouslySetInnerHTML={{ __html: adsConfig.middleAd.htmlCode }} />
            ) : (
              <a
                href={adsConfig.middleAd.clickUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 group"
              >
                {adsConfig.middleAd.imageUrl && (
                  <img
                    src={adsConfig.middleAd.imageUrl}
                    alt="Sponsored"
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-200 group-hover:text-violet-400 transition truncate">
                    {adsConfig.middleAd.title || 'Sponsored Link'}
                  </p>
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {adsConfig.middleAd.description || 'Click to explore more'}
                  </p>
                </div>
              </a>
            )}
          </div>
        )}
      </div>

      {/* Footer Section: Ad Zone 3 & Info */}
      <div className="max-w-3xl w-full mx-auto space-y-3 text-center">
        {/* Ad Zone 3: Footer Banner */}
        {adsConfig.footerBanner?.enabled && (
          <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-sm">
            {adsConfig.footerBanner.type === 'html' && adsConfig.footerBanner.htmlCode ? (
              <div dangerouslySetInnerHTML={{ __html: adsConfig.footerBanner.htmlCode }} />
            ) : (
              <a
                href={adsConfig.footerBanner.clickUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 text-xs text-slate-400 hover:text-white"
              >
                {adsConfig.footerBanner.title || 'Footer Advertisement Banner'}
              </a>
            )}
          </div>
        )}

        <div className="text-[11px] text-slate-500 flex items-center justify-center gap-3">
          <span>Powered by Veloral URL Shortener</span>
          <span>•</span>
          <button
            onClick={() => (onNavigate ? onNavigate('#/app/shortener') : (window.location.hash = '#/app/shortener'))}
            className="hover:underline text-slate-400"
          >
            Create Short Link
          </button>
        </div>
      </div>
    </div>
  );
};
