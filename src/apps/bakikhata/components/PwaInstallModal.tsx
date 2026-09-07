import React from 'react';
import {
  Smartphone,
  Download,
  Share2,
  PlusSquare,
  ExternalLink,
  X,
  CheckCircle2,
  AlertTriangle,
  Monitor,
  WifiOff,
} from 'lucide-react';

interface PwaInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  isInstallable: boolean;
  isInstalled: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isInIframe: boolean;
  onNativeInstall?: () => void;
}

export const PwaInstallModal: React.FC<PwaInstallModalProps> = ({
  isOpen,
  onClose,
  isInstallable,
  isInstalled,
  isIOS,
  isAndroid,
  isInIframe,
  onNativeInstall,
}) => {
  if (!isOpen) return null;

  const openInNewTab = () => {
    const origin = window.location.origin;
    window.open(`${origin}/?app=bakikhata#/app/bakikhata`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      id="pwa-install-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="pwa-install-modal-content"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-600/30 shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-black text-sm text-slate-900 dark:text-white tracking-tight">
                  Install Baki Khata App
                </h3>
                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500 text-white">
                  PWA
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Run smoothly on mobile and desktop offline
              </p>
            </div>
          </div>
          <button
            id="pwa-modal-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If Already Installed */}
        {isInstalled ? (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              The app is already installed!
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              You can launch Baki Khata directly from your home screen or app drawer.
            </p>
          </div>
        ) : (
          <>
            {/* Native Install Button (if browser fired beforeinstallprompt) */}
            {isInstallable && onNativeInstall && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-950 dark:text-emerald-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    Ready for Direct Install
                  </span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                    1-Click Fast Install
                  </span>
                </div>
                <button
                  id="pwa-direct-install-btn"
                  onClick={onNativeInstall}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Install Progressive Web App</span>
                </button>
              </div>
            )}

            {/* Iframe Notice & New Tab Button */}
            {isInIframe && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 space-y-2">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <p className="font-bold text-amber-950 dark:text-amber-300">
                      Direct browser install popups are restricted in preview mode
                    </p>
                    <p className="text-[11px] text-amber-800/90 dark:text-amber-200/80 leading-relaxed">
                      Browser security prevents install dialogs inside preview iframes. Open in a standalone tab to install directly to your home screen.
                    </p>
                  </div>
                </div>

                <button
                  id="pwa-open-tab-btn"
                  onClick={openInNewTab}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md shadow-amber-600/20 transition active:scale-95"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>🌐 Open Fullscreen in New Tab</span>
                </button>
              </div>
            )}

            {/* Platform Instructions */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                Manual Installation Guide (All Browsers)
              </span>

              {/* iOS / iPhone / iPad */}
              {isIOS ? (
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      iPhone / iPad (Safari Browser)
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-2 p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <Share2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>1. Tap the <strong>Share</strong> button at the bottom of Safari.</span>
                    </div>
                    <div className="flex items-center gap-2 p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <PlusSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>2. Select <strong>Add to Home Screen</strong> from the sheet.</span>
                    </div>
                    <div className="flex items-center gap-2 p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>3. Tap <strong>Add</strong> in the top right. The app icon is added to your home screen!</span>
                    </div>
                  </div>
                </div>
              ) : isAndroid ? (
                /* Android Chrome */
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Android Phone (Chrome Browser)
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-2 p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center shrink-0">⋮</span>
                      <span>1. Tap the <strong>(⋮) 3-dot menu</strong> in the top right of Chrome.</span>
                    </div>
                    <div className="flex items-center gap-2 p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <Download className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>2. Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</span>
                    </div>
                    <div className="flex items-center gap-2 p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>3. Confirm <strong>Install</strong>. The app installs immediately!</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Desktop Chrome / Edge */
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Computer / Laptop (Chrome / Edge)
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-2 p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <Download className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>1. Click the <strong>Install (⊕)</strong> icon on the right side of the address bar.</span>
                    </div>
                    <div className="flex items-center gap-2 p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center shrink-0">⋮</span>
                      <span>2. Or open the 3-dot menu and select <strong>"Install Baki Khata"</strong>.</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Offline Features Pill */}
            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-[11px] text-slate-600 dark:text-slate-300">
              <WifiOff className="w-4 h-4 text-teal-500 shrink-0" />
              <span>You can launch and view your ledger offline at any time without an internet connection.</span>
            </div>
          </>
        )}

        {/* Footer actions */}
        <div className="pt-2 flex gap-2">
          {isInIframe && !isInstalled && (
            <button
              id="pwa-modal-footer-tab-btn"
              onClick={openInNewTab}
              className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition"
            >
              Open in Tab ↗
            </button>
          )}
          <button
            id="pwa-modal-footer-close-btn"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-bold transition"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
