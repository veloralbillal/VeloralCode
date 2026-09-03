import React, { useState } from 'react';
import {
  FileCode,
  Calendar,
  Eye,
  ArrowRight,
  Copy,
  Check,
  Tag,
  Layers,
  Play,
  Lock,
} from 'lucide-react';
import { CodeItem } from '../../types';
import {
  formatDate,
  getCategoryBadgeClass,
  copyTextToClipboard,
} from '../../utils/helpers';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { trackToolCodeAction } from '../../services/distributionService';

interface CodeCardProps {
  item: CodeItem;
  onOpen: (id: string) => void;
}

export const CodeCard: React.FC<CodeCardProps> = ({ item, onOpen }) => {
  const { showToast } = useToast();
  const { isPremium, currentUser } = useAuth();
  const [copied, setCopied] = useState(false);

  const handleQuickCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isPremium) {
      showToast('🔒 Source code access is a Premium feature. You can run and test all tools freely!', 'info');
      return;
    }
    const ok = await copyTextToClipboard(item.code);
    if (ok) {
      setCopied(true);
      showToast('Code snippet copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);

      if (item.id) {
        trackToolCodeAction({
          codeId: item.id,
          toolTitle: item.title,
          creatorUid: item.creatorUid,
          creatorEmail: item.authorEmail,
          userUid: currentUser?.uid,
          userEmail: currentUser?.email || undefined,
          isPremium,
          actionType: 'copy',
        });
      }
    }
  };

  const categoryStyle = getCategoryBadgeClass(item.category);

  return (
    <div
      onClick={() => item.id && onOpen(item.id)}
      className="group relative bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 rounded-2xl p-5 shadow-xs hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-200 flex flex-col justify-between cursor-pointer"
    >
      <div className="space-y-3">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${categoryStyle}`}
            >
              {item.category}
            </span>
            <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
              {item.language}
            </span>
          </div>

          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 px-2 py-0.5 rounded border border-slate-200/50 dark:border-slate-800">
            v{item.version || '1.0.0'}
          </span>
        </div>

        {/* Title & Description */}
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
            {item.title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {item.description || 'No description provided.'}
          </p>
        </div>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            {item.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md"
              >
                #{tag.trim()}
              </span>
            ))}
            {item.tags.length > 3 && (
              <span className="text-[10px] text-slate-400">+{item.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>

      {/* Footer Meta */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            {formatDate(item.updatedAt || item.createdAt)}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            {item.views || 0}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleQuickCopy}
            title="Quick copy code"
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-lg border border-indigo-200/50 dark:border-indigo-800/50">
            <Play className="w-3 h-3 fill-current text-emerald-500" />
            <span>Output</span>
            <ArrowRight className="w-3 h-3 ml-0.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
