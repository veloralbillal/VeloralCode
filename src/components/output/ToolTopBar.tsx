import React from 'react';
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
  Check,
  Sparkles,
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ToolTopBarProps {
  title: string;
  category: string;
  language: string;
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
  copiedShare: boolean;
}

export const ToolTopBar: React.FC<ToolTopBarProps> = ({
  title,
  category,
  language,
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
  copiedShare,
}) => {
  const { theme, toggleTheme } = useTheme();

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
          <h1 className="text-xs sm:text-sm font-bold text-white truncate" title={title}>
            {title}
          </h1>
          <span className="hidden md:inline-block text-[11px] px-2 py-0.5 rounded-md bg-indigo-950/80 text-indigo-300 font-medium border border-indigo-800/60 shrink-0">
            {category}
          </span>
        </div>
      </div>

      {/* Center: Device Mode Switcher (Web Tools) */}
      <div className="hidden lg:flex items-center bg-slate-800/90 p-0.5 rounded-xl border border-slate-700/80 text-slate-400">
        <button
          onClick={() => setDeviceMode('desktop')}
          title="Desktop Resolution"
          className={`p-1.5 rounded-lg transition text-xs flex items-center gap-1 ${
            deviceMode === 'desktop' ? 'bg-indigo-600 text-white font-bold' : 'hover:text-white'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Desktop</span>
        </button>
        <button
          onClick={() => setDeviceMode('tablet')}
          title="Tablet View"
          className={`p-1.5 rounded-lg transition text-xs flex items-center gap-1 ${
            deviceMode === 'tablet' ? 'bg-indigo-600 text-white font-bold' : 'hover:text-white'
          }`}
        >
          <Tablet className="w-3.5 h-3.5" />
          <span>Tablet</span>
        </button>
        <button
          onClick={() => setDeviceMode('mobile')}
          title="Mobile View"
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

        {/* Share Button */}
        <button
          onClick={onShare}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          title="Share Tool Link"
        >
          {copiedShare ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Share2 className="w-3.5 h-3.5" />
          )}
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
