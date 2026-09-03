import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  RefreshCw,
  Maximize2,
  Minimize2,
  Info,
  Code,
  Share2,
  Monitor,
  Tablet,
  Smartphone,
  Heart,
  GitFork,
  Terminal,
  Download,
  Bookmark,
} from 'lucide-react';
import { ExportToolButton } from './ExportToolButton';
import { CodeItem } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { toggleBookmark, checkIsBookmarked } from '../../services/userService';

interface ToolTopBarProps {
  item: CodeItem;
  deviceMode: 'desktop' | 'tablet' | 'mobile';
  isPremium: boolean;
  setDeviceMode: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  onBack: () => void;
  onReload: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
  onOpenInfo: () => void;
  onOpenCode: () => void;
  onShare: () => void;
  onOpenTip: () => void;
  onOpenRemix: () => void;
  onToggleConsole: () => void;
  consoleOpen: boolean;
  logCount: number;
}

export const ToolTopBar: React.FC<ToolTopBarProps> = ({
  item,
  deviceMode,
  isPremium,
  setDeviceMode,
  onBack,
  onReload,
  onToggleFullscreen,
  isFullscreen,
  onOpenInfo,
  onOpenCode,
  onShare,
  onOpenTip,
  onOpenRemix,
  onToggleConsole,
  consoleOpen,
  logCount,
}) => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    async function checkMark() {
      if (currentUser?.uid && item.id) {
        const marked = await checkIsBookmarked(currentUser.uid, item.id);
        setIsBookmarked(marked);
      }
    }
    checkMark();
  }, [currentUser?.uid, item.id]);

  const handleToggleBookmark = async () => {
    if (!currentUser) {
      showToast('বুকমার্ক করতে প্রথমে লগইন করুন', 'info');
      window.location.hash = '#/login';
      return;
    }
    if (!item.id) return;

    try {
      const nowMarked = await toggleBookmark(currentUser.uid, {
        id: item.id,
        title: item.title,
        category: item.category,
        language: item.language,
      });
      setIsBookmarked(nowMarked);
      showToast(nowMarked ? 'টুলটি আপনার বুকমার্কে সেভ করা হয়েছে!' : 'বুকমার্ক থেকে সরিয়ে ফেলা হয়েছে', 'success');
    } catch (err) {
      showToast('বুকমার্ক আপডেট করতে সমস্যা হয়েছে', 'error');
    }
  };
  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 px-3 sm:px-4 flex items-center justify-between text-slate-200 z-40 select-none">
      {/* Left: Back button & Title */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition shrink-0"
          title="Back to all tools"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-400" />
          <span className="hidden sm:inline">Back</span>
        </button>

        <div className="flex items-center gap-2 min-w-0 truncate">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <h1 className="text-xs sm:text-sm font-bold text-white truncate" title={item.title}>
            {item.title}
          </h1>
          <span className="hidden md:inline-block text-[11px] px-2 py-0.5 rounded-md bg-indigo-950/80 text-indigo-300 font-medium border border-indigo-800/60 shrink-0">
            {item.category}
          </span>
        </div>
      </div>

      {/* Center: Device Mode Switcher (Web Tools) */}
      <div className="hidden lg:flex items-center bg-slate-800/90 p-0.5 rounded-xl border border-slate-700/80 text-slate-400">
        <button
          onClick={() => setDeviceMode('desktop')}
          title="Desktop Resolution (100%)"
          className={`p-1.5 rounded-lg transition text-xs flex items-center gap-1 ${
            deviceMode === 'desktop' ? 'bg-indigo-600 text-white font-bold' : 'hover:text-white'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Desktop</span>
        </button>
        <button
          onClick={() => setDeviceMode('tablet')}
          title="Tablet View (768px)"
          className={`p-1.5 rounded-lg transition text-xs flex items-center gap-1 ${
            deviceMode === 'tablet' ? 'bg-indigo-600 text-white font-bold' : 'hover:text-white'
          }`}
        >
          <Tablet className="w-3.5 h-3.5" />
          <span>Tablet</span>
        </button>
        <button
          onClick={() => setDeviceMode('mobile')}
          title="Mobile View (375px)"
          className={`p-1.5 rounded-lg transition text-xs flex items-center gap-1 ${
            deviceMode === 'mobile' ? 'bg-indigo-600 text-white font-bold' : 'hover:text-white'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Mobile</span>
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Tip / Support Creator */}
        <button
          onClick={onOpenTip}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition"
          title="Tip & Support Creator"
        >
          <Heart className="w-3.5 h-3.5 fill-rose-500/30" />
          <span className="hidden xl:inline">Tip Creator</span>
        </button>

        {/* Fork / Remix */}
        <button
          onClick={onOpenRemix}
          className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition"
          title="Fork & Remix this Tool"
        >
          <GitFork className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">Remix</span>
        </button>

        {/* Export HTML */}
        <div className="hidden sm:block">
          <ExportToolButton code={item} />
        </div>

        {/* Console toggle */}
        <button
          onClick={onToggleConsole}
          className={`p-2 rounded-xl border transition flex items-center gap-1 ${
            consoleOpen
              ? 'bg-emerald-600 text-white border-emerald-500'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
          }`}
          title="Toggle Debug Console"
        >
          <Terminal className="w-3.5 h-3.5" />
          {logCount > 0 && <span className="text-[10px] font-bold">{logCount}</span>}
        </button>

        {/* Reload tool */}
        <button
          onClick={onReload}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          title="Reload Tool Output"
        >
          <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
        </button>

        {/* View Code Modal with Premium Indicator */}
        <button
          onClick={onOpenCode}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
            isPremium
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30'
          }`}
          title={isPremium ? 'Inspect Source Code' : 'Source Code (Premium Feature)'}
        >
          <Code className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Code</span>
          {!isPremium && <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1 rounded">PRO</span>}
        </button>

        {/* Tool Info Modal */}
        <button
          onClick={onOpenInfo}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          title="Tool Details & Information"
        >
          <Info className="w-3.5 h-3.5 text-sky-400" />
        </button>

        {/* Bookmark Toggle */}
        <button
          onClick={handleToggleBookmark}
          className={`p-2 rounded-xl border transition ${
            isBookmarked
              ? 'bg-amber-500 text-white border-amber-400 shadow-sm shadow-amber-500/30'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
          }`}
          title={isBookmarked ? 'Remove from bookmarks' : 'Bookmark this tool'}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>

        {/* Share & Embed Button */}
        <button
          onClick={onShare}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          title="Share & Embed Widget"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>

        {/* Fullscreen Browser Toggle */}
        <button
          onClick={onToggleFullscreen}
          className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm shadow-indigo-600/30"
          title={isFullscreen ? 'Exit Fullscreen' : 'Open Full Screen'}
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>
    </header>
  );
};

