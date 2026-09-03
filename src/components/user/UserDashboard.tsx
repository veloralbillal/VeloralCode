import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  Code2,
  Sparkles,
  Layers,
  Terminal,
  FilterX,
  PlusCircle,
  TrendingUp,
  FolderCode,
} from 'lucide-react';
import { CodeItem, SupportedLanguage } from '../../types';
import { subscribeToPublishedCodes } from '../../services/codeService';
import { CodeCard } from './CodeCard';
import { CardSkeleton } from '../common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { SliderBanner } from '../banner/SliderBanner';
import { EventsSection } from '../events/EventsSection';

interface UserDashboardProps {
  onOpenCode: (id: string) => void;
  onNavigate: (route: string) => void;
}

const LANGUAGES: ('All' | SupportedLanguage)[] = [
  'All',
  'JavaScript',
  'TypeScript',
  'HTML',
  'CSS',
  'Python',
  'PHP',
  'Java',
  'C++',
  'SQL',
  'Bash',
  'JSON',
  'Markdown',
];

export const UserDashboard: React.FC<UserDashboardProps> = ({ onOpenCode, onNavigate }) => {
  const { isAdmin } = useAuth();
  const { siteConfig } = useSiteConfig();
  const [codes, setCodes] = useState<CodeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLanguage, setSelectedLanguage] = useState<'All' | SupportedLanguage>('All');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'title'>('recent');

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToPublishedCodes(
      (items) => {
        setCodes(items);
        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const dynamicCategories = useMemo(() => {
    const cats = new Set<string>();
    codes.forEach((c) => {
      if (c.category && c.category.trim()) {
        cats.add(c.category.trim());
      }
    });
    return ['All', ...Array.from(cats).sort()];
  }, [codes]);

  const filteredCodes = useMemo(() => {
    let result = codes.filter((item) => {
      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }
      // Language filter
      if (selectedLanguage !== 'All' && item.language !== selectedLanguage) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = item.title?.toLowerCase().includes(q);
        const inDesc = item.description?.toLowerCase().includes(q);
        const inLang = item.language?.toLowerCase().includes(q);
        const inCat = item.category?.toLowerCase().includes(q);
        const inTags = item.tags?.some((t) => t.toLowerCase().includes(q));
        const inCode = item.code?.toLowerCase().includes(q);
        return inTitle || inDesc || inLang || inCat || inTags || inCode;
      }
      return true;
    });

    // Sorting
    if (sortBy === 'popular') {
      result = [...result].sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (sortBy === 'title') {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    } else {
      result = [...result].sort(
        (a, b) => (b.updatedAt || b.createdAt || 0) - (a.updatedAt || a.createdAt || 0)
      );
    }

    return result;
  }, [codes, searchQuery, selectedCategory, selectedLanguage, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedLanguage('All');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Live Slider Banners Carousel */}
      <SliderBanner onNavigate={onNavigate} />

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 text-white p-6 sm:p-10 border border-indigo-800/40 shadow-2xl shadow-indigo-950/30">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>{siteConfig.heroBadge || 'Firebase Realtime Database Powered'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            {siteConfig.heroTitle || 'Live Web Tools, Code Snippets & Output Hub'}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            {siteConfig.heroDescription ||
              'Explore live interactive web apps, tools, widgets, and scripts uploaded directly by administrators. View live outputs, test tools in real-time, and run components instantly.'}
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs text-indigo-200 bg-indigo-900/50 px-3.5 py-2 rounded-xl border border-indigo-700/40">
              <FolderCode className="w-4 h-4 text-cyan-400" />
              <span>{codes.length} Published Snippets</span>
            </div>
            {isAdmin && (
              <button
                onClick={() => onNavigate('#/admin/add')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold transition-all shadow-md shadow-indigo-500/30"
              >
                <PlusCircle className="w-4 h-4" />
                Add New Code
              </button>
            )}
          </div>
        </div>

        {/* Decorative Grid Lines */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 pointer-events-none hidden md:block bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-4">
        {/* Search Bar + Sort */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, description, language, tags, or code content..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="recent">Latest Updated</option>
              <option value="popular">Most Viewed</option>
              <option value="title">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {dynamicCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Language Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 dark:text-slate-500 font-semibold uppercase text-[10px] mr-1 shrink-0">
            Language:
          </span>
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all ${
                selectedLanguage === lang
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Content Section & Counter */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Showing <span className="text-slate-900 dark:text-white font-bold">{filteredCodes.length}</span>{' '}
            {filteredCodes.length === 1 ? 'item' : 'items'}
            {(selectedCategory !== 'All' || selectedLanguage !== 'All' || searchQuery) && (
              <span className="ml-1 text-indigo-600 dark:text-indigo-400 font-normal">
                (filtered from {codes.length} total)
              </span>
            )}
          </p>

          {(selectedCategory !== 'All' || selectedLanguage !== 'All' || searchQuery) && (
            <button
              onClick={clearFilters}
              className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1 font-medium"
            >
              <FilterX className="w-3.5 h-3.5" />
              Reset all filters
            </button>
          )}
        </div>

        {/* Loading Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <CardSkeleton key={n} />
            ))}
          </div>
        ) : filteredCodes.length > 0 ? (
          /* Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCodes.map((item) => (
              <CodeCard key={item.id} item={item} onOpen={onOpenCode} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500 flex items-center justify-center mx-auto">
              <Code2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                No code snippets found
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                {searchQuery || selectedCategory !== 'All' || selectedLanguage !== 'All'
                  ? 'No entries matched your current filters. Try changing search keywords or resetting filters.'
                  : 'No published codes exist in Firebase Realtime Database yet. Log in as admin to publish the first snippet!'}
              </p>
            </div>
            {searchQuery || selectedCategory !== 'All' || selectedLanguage !== 'All' ? (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl hover:bg-indigo-100 transition-colors"
              >
                Clear all filters
              </button>
            ) : isAdmin ? (
              <button
                onClick={() => onNavigate('#/admin/add')}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md transition-all"
              >
                Create first snippet
              </button>
            ) : null}
          </div>
        )}
      </div>

      {/* Featured Community Events & Workshops with Special Down Pricing */}
      <EventsSection onNavigate={onNavigate} />
    </div>
  );
};
