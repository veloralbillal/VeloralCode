import React, { useState, useEffect } from 'react';
import { Bookmark, Code2, ExternalLink, Trash2, ArrowRight } from 'lucide-react';
import { UserBookmarkItem } from '../../types';
import { getUserBookmarks, toggleBookmark } from '../../services/userService';
import { formatDate } from '../../utils/helpers';
import { useToast } from '../../context/ToastContext';

interface UserBookmarksCardProps {
  userId: string;
  onNavigateToCode?: (codeId: string) => void;
}

export const UserBookmarksCard: React.FC<UserBookmarksCardProps> = ({
  userId,
  onNavigateToCode,
}) => {
  const { showToast } = useToast();
  const [bookmarks, setBookmarks] = useState<UserBookmarkItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBookmarks = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await getUserBookmarks(userId);
      setBookmarks(data);
    } catch (err) {
      console.warn('Could not load bookmarks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookmarks();
  }, [userId]);

  const handleRemove = async (item: UserBookmarkItem) => {
    try {
      await toggleBookmark(userId, {
        id: item.codeId,
        title: item.title,
        category: item.category,
        language: item.language,
      });
      setBookmarks((prev) => prev.filter((x) => x.codeId !== item.codeId));
      showToast('Removed from favorites', 'info');
    } catch {
      showToast('Failed to remove bookmark', 'error');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Bookmark className="w-3.5 h-3.5 fill-current" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              My Bookmarked Codes
            </h3>
            <p className="text-[10px] text-slate-400">
              Saved scripts, tools, and UI snippets
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-slate-400">
          {bookmarks.length} saved
        </span>
      </div>

      {loading ? (
        <div className="py-6 text-center text-xs text-slate-400 animate-pulse">
          Loading your bookmarks...
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="py-8 text-center space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Bookmark className="w-5 h-5" />
          </div>
          <p className="text-xs text-slate-500">
            No saved codes yet. Click the bookmark icon on any code in Explore to save it here!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {bookmarks.map((b) => (
            <div
              key={b.codeId}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-start justify-between gap-3 hover:border-indigo-500/40 transition group"
            >
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                    {b.language}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate">{b.category}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {b.title}
                </h4>
                <span className="text-[10px] text-slate-400 block">
                  Saved on {formatDate(b.bookmarkedAt)}
                </span>
              </div>

              <div className="flex items-center gap-1 shrink-0 pt-1">
                {onNavigateToCode && (
                  <button
                    onClick={() => onNavigateToCode(b.codeId)}
                    className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 transition"
                    title="Open Code"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => handleRemove(b)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition"
                  title="Remove from bookmarks"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
