import React from 'react';
import { GitFork, Sparkles, X, ArrowRight } from 'lucide-react';
import { CodeItem } from '../../types';

interface CreatorRemixModalProps {
  code: CodeItem;
  isOpen: boolean;
  onClose: () => void;
  onConfirmRemix: (code: CodeItem) => void;
}

export const CreatorRemixModal: React.FC<CreatorRemixModalProps> = ({ code, isOpen, onClose, onConfirmRemix }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-white space-y-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <GitFork className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Fork & Remix Tool</h3>
              <p className="text-xs text-slate-400">Build on top of existing community code</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span>Base Tool:</span>
            <span className="font-bold text-slate-200">{code.title}</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Original Author:</span>
            <span className="font-semibold text-cyan-400">{code.creatorName || code.creatorEmail || 'CodeHub Community'}</span>
          </div>
          <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800/80">
            💡 Remixing clones the HTML, CSS, and JS into your Creator Studio so you can add features, customize styling, and publish your own version with automatic attribution!
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirmRemix(code)}
            className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-600/30 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open in Remix Editor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
