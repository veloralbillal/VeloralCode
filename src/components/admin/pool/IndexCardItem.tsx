import React, { useState } from 'react';
import { Database, CheckCircle2, Copy, Check, FastForward, KeyRound } from 'lucide-react';
import { IndexRuleItem } from '../../../services/pool/connectionPoolTypes';
import { copyTextToClipboard } from '../../../utils/helpers';
import { useToast } from '../../../context/ToastContext';

interface IndexCardItemProps {
  rule: IndexRuleItem;
}

export const IndexCardItem: React.FC<IndexCardItemProps> = ({ rule }) => {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopyRule = async () => {
    const jsonSnippet = `"${rule.collection.replace(/^\//, '')}": {\n  ".indexOn": ${JSON.stringify(rule.indexes)}\n}`;
    const ok = await copyTextToClipboard(jsonSnippet);
    if (ok) {
      setCopied(true);
      showToast(`Copied .indexOn rule for ${rule.collection}`, 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const priorityConfig = {
    critical: {
      label: 'Top Priority',
      style: 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    },
    high: {
      label: 'High Priority',
      style: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900',
    },
    medium: {
      label: 'Standard',
      style: 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-900',
    },
  }[rule.priority];

  return (
    <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-300 dark:hover:border-indigo-700 transition space-y-3">
      {/* Header with collection & priority */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 font-bold">
            <Database className="w-4 h-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs sm:text-sm font-black text-indigo-600 dark:text-indigo-400">
                {rule.collection}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${priorityConfig.style}`}>
                {priorityConfig.label}
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 font-bold">
                <CheckCircle2 className="w-3 h-3" />
                <span>O(log N) Active</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {rule.purpose}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopyRule}
          className="self-start sm:self-center flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition cursor-pointer shrink-0"
          title="Copy this snippet"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-slate-400" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Query pattern & frequency */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] bg-white dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
          <FastForward className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span className="font-semibold text-slate-400">Pattern:</span>
          <code className="font-mono text-[10px] text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.5 rounded">
            {rule.queryPattern}
          </code>
        </div>
        <div className="text-slate-500 dark:text-slate-400">
          <span className="font-semibold">Traffic:</span> {rule.frequency}
        </div>
      </div>

      {/* Indexed keys tags */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Indexed Fields:</span>
        {rule.indexes.map((idxKey) => (
          <span
            key={idxKey}
            className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono text-[10px] font-medium shadow-2xs"
          >
            .{idxKey}
          </span>
        ))}
      </div>
    </div>
  );
};
