import React, { useState, useEffect } from 'react';
import { Bookmark, Code2, ExternalLink, Trash2, ArrowRight, Search, Filter, Sparkles, FolderCode } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

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
      showToast('বুকমার্ক থেকে সরিয়ে ফেলা হয়েছে', 'info');
    } catch {
      showToast('বুকমার্ক আপডেট করতে সমস্যা হয়েছে', 'error');
    }
  };

  // Categories list
  const categories = ['all', ...Array.from(new Set(bookmarks.map((b) => b.category).filter(Boolean)))];

  const filteredBookmarks = bookmarks.filter((b) => {
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (b.category && b.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (b.language && b.language.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || b.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner Card */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent dark:from-amber-950/30 dark:via-orange-950/20 border border-amber-200/60 dark:border-amber-800/40 rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Bookmark className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Saved Bookmarks</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                {bookmarks.length} Tools
              </span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              আপনার সংরক্ষিত সমস্ত ফেভারিট কোড ও ওয়েব টুলস এখানে গ্রিড আকারে সাজানো আছে।
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="বুকমার্ক খুঁজুন..."
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-hidden focus:border-amber-500 w-full sm:w-48 shadow-xs"
            />
          </div>

          {categories.length > 2 && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-amber-500 shadow-xs"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'all' ? 'সকল ক্যাটাগরি' : c}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 h-36 animate-pulse space-y-3">
              <div className="flex justify-between">
                <div className="w-16 h-5 bg-slate-200 dark:bg-slate-800 rounded-md" />
                <div className="w-6 h-6 bg-slate-200 dark:bg-slate-800 rounded-full" />
              </div>
              <div className="w-3/4 h-5 bg-slate-200 dark:bg-slate-800 rounded-md" />
              <div className="w-1/2 h-3 bg-slate-200 dark:bg-slate-800 rounded-md" />
            </div>
          ))}
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-md">
            <Bookmark className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              কোনো বুকমার্ক সেভ করা নেই
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              এক্সপ্লোর বা ক্যাটালগ থেকে যেকোনো পছন্দের টুল বা কোডের বুকমার্ক আইকনে ক্লিক করে এখানে সেভ করে রাখুন।
            </p>
          </div>
        </div>
      ) : filteredBookmarks.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center space-y-2">
          <p className="text-xs font-semibold text-slate-500">
            "{searchQuery}" এর সাথে মিলে এমন কোনো বুকমার্ক পাওয়া যায়নি।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBookmarks.map((b) => (
            <div
              key={b.codeId}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:border-amber-500/50 dark:hover:border-amber-500/50 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60">
                    {b.category || 'Tool'}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {b.language || 'web'}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition line-clamp-1">
                  {b.title}
                </h3>

                <p className="text-[11px] text-slate-400">
                  সংরক্ষিত হয়েছে: {formatDate(b.bookmarkedAt)}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => handleRemove(b)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                  title="Remove from bookmarks"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>রিমুভ</span>
                </button>

                {onNavigateToCode && (
                  <button
                    type="button"
                    onClick={() => onNavigateToCode(b.codeId)}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm shadow-amber-500/30 transition active:scale-95"
                  >
                    <span>ওপেন করুন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
