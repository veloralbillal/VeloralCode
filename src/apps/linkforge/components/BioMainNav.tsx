import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Sparkles,
  Code2,
  Globe,
  Share2,
  QrCode,
  ExternalLink,
  Calendar,
  Wallet,
  Link2,
  User,
  Bookmark,
  Check,
  ArrowLeft,
  Flame,
  LayoutDashboard,
  Layers,
  ChevronRight,
  Sliders,
} from 'lucide-react';
import { Profile } from '../types';

interface BioMainNavProps {
  profile: Profile;
  isSimulator?: boolean;
  onNavigate?: (route: string) => void;
  onShare: () => void;
  copiedLink: boolean;
  onOpenMainMenu?: () => void;
}

export const BioMainNav: React.FC<BioMainNavProps> = ({
  profile,
  isSimulator = false,
  onNavigate,
  onShare,
  copiedLink,
  onOpenMainMenu,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [copiedQrUrl, setCopiedQrUrl] = useState(false);

  const bioUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/#/app/linkforge?bio=${profile.username}`
      : `https://veloralcode.app/#/bio/${profile.username}`;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=12&data=${encodeURIComponent(
    bioUrl
  )}`;

  const nav = (route: string) => {
    setMenuOpen(false);
    if (onNavigate) {
      onNavigate(route);
    } else if (typeof window !== 'undefined') {
      window.location.hash = route;
    }
  };

  // Close menu on ESC
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setQrModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleCopyQrUrl = () => {
    navigator.clipboard?.writeText(bioUrl);
    setCopiedQrUrl(true);
    setTimeout(() => setCopiedQrUrl(false), 2000);
  };

  return (
    <>
      {/* Bio Main Navigation Header Bar */}
      <header
        aria-label="Bio Main Navigation"
        className={`w-full z-30 transition-all ${
          isSimulator
            ? 'mb-4 pt-1'
            : 'sticky top-0 mb-6 py-2 px-3 sm:px-4 backdrop-blur-md bg-slate-950/60 border-b border-white/10'
        }`}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          {/* Left: Main Menu Button & Brand */}
          <div className="flex items-center gap-2">
            {/* Primary Main Menu Toggle Button */}
            <button
              onClick={() => {
                if (onOpenMainMenu) {
                  onOpenMainMenu();
                } else {
                  setMenuOpen(true);
                }
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 border border-white/15 text-white text-xs font-bold transition cursor-pointer shadow-sm"
              title="Open Platform Main Menu Navigation"
              aria-label="Open Main Menu Navigation"
            >
              <Menu className="w-4 h-4 text-indigo-400" />
              <span className="text-[11px] sm:text-xs font-extrabold">Main Menu</span>
            </button>

            {/* Platform Brand / Quick Home Shortcut */}
            <button
              onClick={() => nav('#/')}
              className="flex items-center gap-1.5 px-2 py-1 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
              title="Veloral Code Toolkit Home"
            >
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-xs">
                <Code2 className="w-3.5 h-3.5" />
              </div>
              <span className="hidden sm:inline text-xs font-extrabold tracking-tight">
                Veloral
              </span>
            </button>

            {/* Bio Domain Pill */}
            <div className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono text-slate-400 bg-white/5 border border-white/10">
              <Globe className="w-3 h-3 text-indigo-400" />
              <span className="truncate max-w-[160px]">
                {profile.customDomain || `@${profile.username}`}
              </span>
            </div>
          </div>

          {/* Center Navigation Shortcuts (Desktop View) */}
          {!isSimulator && (
            <nav className="hidden lg:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-[11px] font-semibold">
              <button
                onClick={() => nav('#/')}
                className="px-2.5 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                Explore Codes
              </button>
              <button
                onClick={() => nav('#/events')}
                className="px-2.5 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                Events
              </button>
              <button
                onClick={() => nav('#/app/bakikhata')}
                className="px-2.5 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                Baki Khata
              </button>
              <button
                onClick={() => nav('#/app/shortener')}
                className="px-2.5 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                Shortener
              </button>
            </nav>
          )}

          {/* Right Action Icons (QR, Share, Studio) */}
          <div className="flex items-center gap-1.5">
            {/* QR Code Modal Button */}
            <button
              onClick={() => setQrModalOpen(true)}
              className="p-2 min-w-[34px] min-h-[34px] flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-slate-300 hover:text-white border border-white/15 transition cursor-pointer"
              title="View & Scan Bio QR Code"
              aria-label="View QR Code"
            >
              <QrCode className="w-3.5 h-3.5 text-indigo-300" />
            </button>

            {/* Share Profile Link Button */}
            <button
              onClick={onShare}
              className="p-2 min-w-[34px] min-h-[34px] flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-slate-300 hover:text-white border border-white/15 transition cursor-pointer"
              title="Copy & Share Profile Link"
              aria-label="Share profile"
            >
              {copiedLink ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Share2 className="w-3.5 h-3.5" />
              )}
            </button>

            {/* LinkForge Studio / Create Bio Button */}
            {!isSimulator && (
              <button
                onClick={() => nav('#/app/linkforge')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 active:scale-95 text-white text-[11px] font-bold transition cursor-pointer shadow-md shadow-indigo-600/30"
                title="Create or Edit Bio in LinkForge Studio"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">LinkForge Studio</span>
                <span className="sm:hidden">Studio</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Slide-out Main Menu Navigation Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Container */}
          <div className="relative w-80 sm:w-96 max-w-[90vw] bg-slate-900 border-r border-slate-800 text-slate-100 flex flex-col justify-between shadow-2xl z-50 animate-in slide-in-from-left duration-200">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-md">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">Main Menu Nav</h3>
                  <p className="text-[10px] text-slate-400">All Platforms & Tools</p>
                </div>
              </div>

              <button
                onClick={() => setMenuOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                title="Close Menu (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Options List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {/* Bio Page Context Card */}
              <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/40 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-indigo-400/30">
                    <img
                      src={
                        profile.avatarUrl ||
                        `https://api.dicebear.com/7.x/bottts/svg?seed=${profile.username}`
                      }
                      alt={profile.displayName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate">{profile.displayName}</p>
                    <p className="text-[10px] text-indigo-300 font-mono truncate">
                      @{profile.username}
                    </p>
                  </div>
                  <button
                    onClick={onShare}
                    className="p-2 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 text-xs transition cursor-pointer"
                    title="Share"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Custom Domain & Bio URL Badge */}
                <div className="pt-1.5 border-t border-indigo-900/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-mono flex items-center gap-1">
                    <Globe className="w-3 h-3 text-indigo-400" />
                    <span className="truncate max-w-[170px]">
                      {profile.customDomain || `${profile.username}.linkforge.app`}
                    </span>
                  </span>
                  <button
                    onClick={() => nav('#/app/linkforge')}
                    className="text-indigo-400 hover:text-indigo-300 font-bold text-[10px] underline cursor-pointer"
                  >
                    Custom Domain
                  </button>
                </div>
              </div>

              {/* Section 1: LinkForge & Studio Apps */}
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2 pt-1">
                  LinkForge Bio & Studio
                </p>

                <button
                  onClick={() => nav('#/app/linkforge')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-left transition text-white cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-indigo-200">LinkForge Studio</p>
                      <p className="text-[10px] text-indigo-300/80">
                        Create & edit blocks, themes & domain
                      </p>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-500 text-white">
                    Studio
                  </span>
                </button>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setQrModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800 text-left transition text-slate-200 hover:text-white cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-800 text-indigo-400 flex items-center justify-center border border-white/10">
                      <QrCode className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold">View Bio QR Code</p>
                      <p className="text-[10px] text-slate-400">Scan & download QR code</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
                </button>
              </div>

              {/* Section 2: Veloral Platform & Other Apps */}
              <div className="space-y-1 pt-2 border-t border-slate-800">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2">
                  Veloral Toolkit & Apps
                </p>

                <button
                  onClick={() => nav('#/')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800 text-left transition text-slate-200 hover:text-white cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-indigo-900/60 text-indigo-400 flex items-center justify-center">
                      <Code2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold">Explore Codes & Tools</p>
                      <p className="text-[10px] text-slate-400">Verified templates & snippets</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
                </button>

                <button
                  onClick={() => nav('#/events')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800 text-left transition text-slate-200 hover:text-white cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-rose-900/60 text-rose-400 flex items-center justify-center">
                      <Flame className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold">Events & Code Drops</p>
                      <p className="text-[10px] text-slate-400">Timed developer flash sales</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-500 text-white">
                    Live
                  </span>
                </button>

                <button
                  onClick={() => nav('#/app/bakikhata')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800 text-left transition text-slate-200 hover:text-white cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-900/60 text-emerald-400 flex items-center justify-center">
                      <Wallet className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold">Baki Khata Digital Ledger</p>
                      <p className="text-[10px] text-slate-400">Smart accounting & balance</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => nav('#/app/shortener')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800 text-left transition text-slate-200 hover:text-white cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-violet-900/60 text-violet-400 flex items-center justify-center">
                      <Link2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold">URL Shortener & Ads</p>
                      <p className="text-[10px] text-slate-400">Short links & monetization</p>
                    </div>
                  </div>
                </button>
              </div>

              {/* Section 3: Admin & Account */}
              <div className="space-y-1 pt-2 border-t border-slate-800">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2">
                  Management & Admin
                </p>

                <button
                  onClick={() => nav('#/admin')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-amber-950/30 border border-amber-500/20 text-left transition text-amber-200 hover:text-amber-100 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-900/60 text-amber-400 flex items-center justify-center">
                      <Sliders className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold">Super Admin Panel</p>
                      <p className="text-[10px] text-amber-400/80">Platform settings & moderation</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => nav('#/profile')}
                  className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-800 text-left transition text-slate-300 hover:text-white cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="text-xs">My Profile & Settings</span>
                  </div>
                </button>

                <button
                  onClick={() => nav('#/profile/licenses')}
                  className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-800 text-left transition text-slate-300 hover:text-white cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Bookmark className="w-4 h-4 text-amber-400" />
                    <span className="text-xs">Purchased License Keys</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="p-3 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between">
              <button
                onClick={() => nav('#/')}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Home</span>
              </button>

              <button
                onClick={() => nav('#/app/linkforge')}
                className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition cursor-pointer"
              >
                Open Studio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal for Bio */}
      {qrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs"
            onClick={() => setQrModalOpen(false)}
          />

          <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-center z-10 animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setQrModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto mb-3">
              <QrCode className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white mb-1">Scan Bio QR Code</h3>
            <p className="text-xs text-slate-400 mb-4">
              Scan with your phone camera to instantly visit{' '}
              <strong className="text-indigo-400">@{profile.username}</strong>
            </p>

            {/* QR Image Container */}
            <div className="bg-white p-3.5 rounded-2xl inline-block shadow-inner mx-auto mb-4 border border-slate-300">
              <img
                src={qrImageUrl}
                alt={`QR code for ${profile.username}`}
                className="w-48 h-48 sm:w-52 sm:h-52 object-contain"
              />
            </div>

            <div className="space-y-2">
              <button
                onClick={handleCopyQrUrl}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-md shadow-indigo-600/25 cursor-pointer"
              >
                {copiedQrUrl ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Bio Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Copy Bio Link</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-slate-500 font-mono truncate">{bioUrl}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
