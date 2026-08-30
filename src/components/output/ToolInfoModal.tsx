import React from 'react';
import { X, Calendar, Eye, Tag, User, Shield, Layers, FileCode } from 'lucide-react';
import { CodeItem } from '../../types';
import { formatDate, getCategoryBadgeClass } from '../../utils/helpers';

interface ToolInfoModalProps {
  item: CodeItem;
  isOpen: boolean;
  onClose: () => void;
  onOpenCode: () => void;
}

export const ToolInfoModal: React.FC<ToolInfoModalProps> = ({ item, isOpen, onClose, onOpenCode }) => {
  if (!isOpen) return null;

  const categoryStyle = getCategoryBadgeClass(item.category);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 text-slate-200 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${categoryStyle}`}>
              {item.category}
            </span>
            <h3 className="text-lg font-bold text-white">{item.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Description */}
        {item.description ? (
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
            {item.description}
          </p>
        ) : (
          <p className="text-xs text-slate-500 italic">No description provided for this tool.</p>
        )}

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Tags</span>
            <div className="flex flex-wrap gap-1.5">
              {item.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700/60"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Meta Stats Grid */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800 text-xs">
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 flex items-center gap-1 text-[11px]">
              <Eye className="w-3.5 h-3.5" /> Total Views
            </span>
            <span className="font-bold text-white">{item.views || 0}</span>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 flex items-center gap-1 text-[11px]">
              <Calendar className="w-3.5 h-3.5" /> Updated Date
            </span>
            <span className="font-bold text-white">{formatDate(item.updatedAt || item.createdAt)}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <button
            onClick={() => {
              onClose();
              onOpenCode();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            <FileCode className="w-4 h-4 text-amber-400" />
            <span>Inspect Code</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-indigo-600/30"
          >
            Return to Tool
          </button>
        </div>
      </div>
    </div>
  );
};
