import React, { useState, useEffect } from 'react';
import {
  Link2,
  Sparkles,
  Layers,
  Eye,
  ShieldCheck,
  Zap,
  Globe,
  Share2,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ShortUrl } from './types';
import {
  subscribeAllShortUrls,
  deleteShortUrl,
  getGuestSlugs,
} from './services/shortenerService';
import { UrlShortenerHeader } from './components/UrlShortenerHeader';
import { CreateShortUrlForm } from './components/CreateShortUrlForm';
import { ShortUrlResultModal } from './components/ShortUrlResultModal';
import { ShortUrlsTable } from './components/ShortUrlsTable';

interface UrlShortenerAppProps {
  onNavigate?: (route: string) => void;
}

export const UrlShortenerApp: React.FC<UrlShortenerAppProps> = ({ onNavigate }) => {
  const { currentUser, isAdmin } = useAuth();
  const [urls, setUrls] = useState<ShortUrl[]>([]);
  const [createdModalUrl, setCreatedModalUrl] = useState<ShortUrl | null>(null);
  const [selectedQrUrl, setSelectedQrUrl] = useState<ShortUrl | null>(null);

  // Subscribe to all short URLs in Firebase
  useEffect(() => {
    const unsubscribe = subscribeAllShortUrls((data) => {
      setUrls(data);
    });
    return () => unsubscribe();
  }, []);

  // Filter user's links
  // If logged in: URLs where createdBy matches currentUser.uid
  // If guest: URLs in local guest slugs list
  const guestSlugs = getGuestSlugs();
  const userUrls = urls.filter((item) => {
    if (currentUser?.uid && item.createdBy === currentUser.uid) return true;
    if (guestSlugs.includes(item.slug)) return true;
    return false;
  });

  // Calculate totals
  const totalUserLinks = userUrls.length;
  const totalUserClicks = userUrls.reduce((acc, curr) => acc + (curr.clicks || 0), 0);
  const totalGlobalLinks = urls.length;
  const totalGlobalClicks = urls.reduce((acc, curr) => acc + (curr.clicks || 0), 0);

  const handleDelete = async (slug: string) => {
    await deleteShortUrl(slug);
  };

  const handleBackToPlatform = () => {
    if (onNavigate) {
      onNavigate('#/');
    } else {
      window.location.hash = '#/';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors flex flex-col justify-between">
      <div>
        {/* Navigation Header */}
        <UrlShortenerHeader
          onBackToApp={handleBackToPlatform}
          totalLinksCount={totalUserLinks}
          totalClicksCount={totalUserClicks}
        />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
          {/* Hero Feature Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-violet-800/40">
            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-violet-600/20 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-violet-500/20 text-violet-300 border border-violet-400/30">
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>Veloral Cloud URL Shortener & Monetization</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                Create Smart Short Links, Share Seamlessly & Monetize with Ads
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Modern URL shortener with real-time Firebase cloud storage, custom alias <code className="text-violet-300 font-mono">domain/r/alias</code>, QR code generation, and flexible Ad Control Zones.
              </p>

              {/* Badges */}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Secure Cloud Storage</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  <span>Real-time Click Tracking</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-violet-400" />
                  <span>Universal Device Access</span>
                </span>
              </div>
            </div>
          </div>

          {/* Create Form */}
          <CreateShortUrlForm
            currentUser={currentUser}
            isAdmin={isAdmin}
            onSuccess={(created) => setCreatedModalUrl(created)}
          />

          {/* User Links Table / Cards */}
          <ShortUrlsTable
            urls={userUrls.length > 0 ? userUrls : urls.slice(0, 15)}
            onDelete={handleDelete}
            onShowQr={(url) => setSelectedQrUrl(url)}
          />
        </main>
      </div>

      {/* Result Modal when creating link */}
      {createdModalUrl && (
        <ShortUrlResultModal
          shortUrl={createdModalUrl}
          onClose={() => setCreatedModalUrl(null)}
        />
      )}

      {/* QR Code Modal when clicking QR in table */}
      {selectedQrUrl && (
        <ShortUrlResultModal
          shortUrl={selectedQrUrl}
          onClose={() => setSelectedQrUrl(null)}
        />
      )}

      {/* Bottom Footer */}
      <footer className="mt-12 border-t border-slate-200 dark:border-slate-800/80 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Veloral Developer Toolkit. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => (onNavigate ? onNavigate('#/app/shortener') : (window.location.hash = '#/app/shortener'))}
              className="hover:text-violet-600 transition"
            >
              URL Shortener
            </button>
            <button
              onClick={() => (onNavigate ? onNavigate('#/app/bakikhata') : (window.location.hash = '#/app/bakikhata'))}
              className="hover:text-emerald-600 transition"
            >
              Baki Khata
            </button>
            <button
              onClick={() => (onNavigate ? onNavigate('#/admin') : (window.location.hash = '#/admin'))}
              className="hover:text-indigo-600 transition"
            >
              Admin Panel
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UrlShortenerApp;
