import React, { useState } from 'react';
import {
  Check,
  Copy,
  ExternalLink,
  QrCode,
  Share2,
  X,
  Sparkles,
  Link2,
  ShieldCheck,
  Download,
} from 'lucide-react';
import { ShortUrl } from '../types';

interface ShortUrlResultModalProps {
  shortUrl: ShortUrl | null;
  onClose: () => void;
}

export const ShortUrlResultModal: React.FC<ShortUrlResultModalProps> = ({ shortUrl, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  if (!shortUrl) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://veloralbillal.top';
  // Direct domain/random link format as requested: domain/random
  const cleanShortLink = `${origin}/${shortUrl.slug}`;
  // Primary domain/r/slug link format
  const primaryShortLink = `${origin}/r/${shortUrl.slug}`;
  // Fallback hash link format
  const hashShortLink = `${origin}/#/r/${shortUrl.slug}`;

  const [copiedClean, setCopiedClean] = useState(false);

  const handleCopyClean = async () => {
    try {
      await navigator.clipboard.writeText(cleanShortLink);
      setCopiedClean(true);
      setTimeout(() => setCopiedClean(false), 2500);
    } catch {}
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const shareText = `Check out this link: ${cleanShortLink}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(cleanShortLink)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(cleanShortLink)}&text=${encodeURIComponent(shortUrl.title || 'Short Link')}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;

  // SVG QR Code generator function
  const renderSvgQr = (text: string) => {
    // Generate an encoded Google Charts or simple SVG QR API image
    const qrApi = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(text)}&color=4f46e5&bgcolor=ffffff&qzone=2`;
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner">
        <img
          src={qrApi}
          alt={`QR Code for ${text}`}
          className="w-48 h-48 rounded-xl object-contain bg-white p-2"
          referrerPolicy="no-referrer"
        />
        <a
          href={qrApi}
          target="_blank"
          rel="noopener noreferrer"
          download={`qrcode-${shortUrl.slug}.png`}
          className="mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download QR Code</span>
        </a>
      </div>
    );
  };

  return (
    <div
      id="short-url-result-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="short-url-result-modal-content"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                Short Link Created Successfully!
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Your link is ready to share and track clicks
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Clean Short Link (domain/random) */}
        <div className="p-4 rounded-2xl bg-violet-50/70 dark:bg-violet-950/40 border border-violet-200/80 dark:border-violet-900/60 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-violet-800 dark:text-violet-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Direct Short URL (domain/random)</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-200/70 dark:bg-violet-900 text-violet-800 dark:text-violet-200 font-bold">
              /{shortUrl.slug}
            </span>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-slate-800 border border-violet-200 dark:border-slate-700">
            <div className="flex-1 font-mono text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate select-all px-2">
              {cleanShortLink}
            </div>
            <button
              onClick={handleCopyClean}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                copiedClean
                  ? 'bg-emerald-600 text-white'
                  : 'bg-violet-600 hover:bg-violet-700 text-white shadow-xs'
              }`}
            >
              {copiedClean ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>

          {/* Canonical /r/ link & destination */}
          <div className="pt-1 border-t border-violet-100 dark:border-violet-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-500 dark:text-slate-400">
            <div className="truncate flex items-center gap-1">
              <span className="font-semibold text-slate-600 dark:text-slate-300 shrink-0">Destination:</span>
              <span className="truncate underline font-mono text-[10px]">{shortUrl.targetUrl}</span>
            </div>
            <button
              onClick={() => handleCopy(primaryShortLink)}
              className="text-violet-600 dark:text-violet-400 hover:underline text-[11px] font-semibold text-left sm:text-right shrink-0"
            >
              {copied ? 'Copied Canonical Link!' : `Copy /r/${shortUrl.slug} format`}
            </button>
          </div>
        </div>

        {/* Action Buttons: QR Code & Test Link */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => setShowQr(!showQr)}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            <QrCode className="w-4 h-4 text-violet-500" />
            <span>{showQr ? 'Hide QR Code' : 'View QR Code'}</span>
          </button>

          <a
            href={primaryShortLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition shadow-xs"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Test Short Link</span>
          </a>
        </div>

        {/* QR Code view */}
        {showQr && (
          <div className="animate-in fade-in duration-200">
            {renderSvgQr(primaryShortLink)}
          </div>
        )}

        {/* Social Share Bar */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">
            Share Directly:
          </span>
          <div className="flex items-center gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition"
            >
              <span>WhatsApp</span>
            </a>
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 text-[11px] font-bold text-sky-700 dark:text-sky-300 hover:bg-sky-100 transition"
            >
              <span>Telegram</span>
            </a>
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-[11px] font-bold text-blue-700 dark:text-blue-300 hover:bg-blue-100 transition"
            >
              <span>Facebook</span>
            </a>
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition"
            >
              <span>X (Twitter)</span>
            </a>
          </div>
        </div>

        {/* Secondary Format / Safe Info */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Dual Routing Support</span>
          </div>
          <p>
            Your short link is supported via both <code className="font-mono text-violet-600 dark:text-violet-400">{`/r/${shortUrl.slug}`}</code> and <code className="font-mono text-violet-600 dark:text-violet-400">{`/#/r/${shortUrl.slug}`}</code> instantly.
          </p>
        </div>

        {/* Footer Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
        >
          Create Another Link
        </button>
      </div>
    </div>
  );
};
