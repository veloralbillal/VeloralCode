import React from 'react';
import { Terminal, Globe } from 'lucide-react';

interface PythonViewSwitcherProps {
  viewMode: 'terminal' | 'preview';
  onChangeMode: (mode: 'terminal' | 'preview') => void;
  className?: string;
}

export const PythonViewSwitcher: React.FC<PythonViewSwitcherProps> = ({
  viewMode,
  onChangeMode,
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-center p-2 z-20 select-none ${className}`}>
      <div className="inline-flex items-center p-1 rounded-2xl bg-slate-900/95 border border-slate-700/80 shadow-2xl backdrop-blur-md">
        {/* Terminal Option */}
        <button
          type="button"
          onClick={() => onChangeMode('terminal')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            viewMode === 'terminal'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/40 scale-100'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Terminal Console</span>
        </button>

        {/* HTML Preview UI Option */}
        <button
          type="button"
          onClick={() => onChangeMode('preview')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            viewMode === 'preview'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/40 scale-100'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Globe className="w-3.5 h-3.5 text-indigo-300" />
          <span>HTML Preview UI</span>
          <span className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 font-normal">
            Web
          </span>
        </button>
      </div>
    </div>
  );
};
