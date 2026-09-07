import React, { useState } from 'react';
import {
  Search,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  Trash2,
  Calendar,
  Sparkles,
  Layers,
  Link2,
  Lock,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { ShortUrl } from '../types';

interface ShortUrlsTableProps {
  urls: ShortUrl[];
  onDelete: (slug: string) => Promise<void>;
  onShowQr: (url: ShortUrl) => void;
}

export const ShortUrlsTable: React.FC<ShortUrlsTableProps> = ({ urls, onDelete, onShowQr }) => {
  const [search, setSearch] = useState('');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://veloralbillal.top';

  const handleCopy = async (slug: string) => {
    try {
      const fullUrl = `${origin}/r/${slug}`;
      await navigator.clipboard.writeText(fullUrl);
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(null), 2000);
    } catch {}
  };

  const handleDelete = async (slug: string) => {
    if (!window.confirm(`Are you sure you want to delete this short link (/r/${slug})?`)) return;
    try {
      setDeletingSlug(slug);
      await onDelete(slug);
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingSlug(null);
    }
  };

  const filtered = urls.filter((item) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      item.slug.toLowerCase().includes(q) ||
      item.targetUrl.toLowerCase().includes(q) ||
      (item.title && item.title.toLowerCase().includes(q))
    );
  });

  const formatDate = (timestamp: number) => {
    if (!timestamp) return '–';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-sm space-y-4">
      {/* Top Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Layers className="w-4 h-4 text-violet-500" />
            <span>Saved Short Links</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
              {urls.length}
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time click statistics and link management
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search link or alias..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-violet-500"
          />
        </div>
      </div>

      {/* Empty State */}
      {filtered.length === 0 ? (
        <div className="py-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Link2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              {search ? 'No matching links found' : 'No short links created yet'}
            </p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {search ? 'Try searching with different keywords.' : 'Paste any URL above to create and manage your first short link.'}
            </p>
          </div>
        </div>
      ) : (
        /* Cards / Table List */
        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {filtered.map((item) => {
            const shortUrl = `${origin}/${item.slug}`;
            const canonicalUrl = `${origin}/r/${item.slug}`;
            const isDeleting = deletingSlug === item.slug;
            const isCopied = copiedSlug === item.slug;

            return (
              <div
                key={item.slug}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 px-2 rounded-2xl transition"
              >
                {/* Left: Info */}
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-black text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/60 px-2 py-0.5 rounded-md border border-violet-200/60 dark:border-violet-800/60">
                      /{item.slug}
                    </span>

                    {item.title && (
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                        {item.title}
                      </span>
                    )}

                    {item.password && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
                        <Lock className="w-2.5 h-2.5" />
                        Locked
                      </span>
                    )}

                    {item.enabled === false && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-600">
                        Disabled
                      </span>
                    )}
                  </div>

                  {/* Destination */}
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate max-w-md">
                    {item.targetUrl}
                  </p>

                  {/* Metadata */}
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(item.createdAt)}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-300">
                      <Eye className="w-3 h-3 text-emerald-500" />
                      {item.clicks || 0} clicks
                    </span>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => handleCopy(item.slug)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                      isCopied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-violet-50 dark:hover:bg-violet-950 text-slate-700 dark:text-slate-300 hover:text-violet-600'
                    }`}
                    title="Copy Link"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{isCopied ? 'Copied!' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={() => onShowQr(item)}
                    className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                    title="View QR Code"
                  >
                    <QrCode className="w-4 h-4 text-violet-500" />
                  </button>

                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                    title="Test Link"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => handleDelete(item.slug)}
                    disabled={isDeleting}
                    className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition disabled:opacity-40"
                    title="Delete Link"
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
  );
};
