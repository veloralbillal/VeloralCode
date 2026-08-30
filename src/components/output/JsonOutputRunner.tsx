import React, { useState } from 'react';
import { Check, Copy, AlertCircle, CheckCircle2, Search, Braces } from 'lucide-react';
import { copyTextToClipboard } from '../../utils/helpers';
import { useToast } from '../../context/ToastContext';

interface JsonOutputRunnerProps {
  code: string;
}

export const JsonOutputRunner: React.FC<JsonOutputRunnerProps> = ({ code }) => {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  let parsedData: any = null;
  let parseError: string | null = null;

  try {
    parsedData = JSON.parse(code);
  } catch (err: any) {
    parseError = err.message || 'Invalid JSON syntax';
  }

  const handleCopyFormatted = async () => {
    if (!parsedData) return;
    const ok = await copyTextToClipboard(JSON.stringify(parsedData, null, 2));
    if (ok) {
      setCopied(true);
      showToast('Formatted JSON copied!', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 border-b border-slate-800 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Braces className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Parsed JSON Data Output
          </span>
          {parseError ? (
            <span className="text-[11px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
              Invalid Format
            </span>
          ) : (
            <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              Valid JSON Object
            </span>
          )}
        </div>

        <button
          onClick={handleCopyFormatted}
          disabled={!!parseError}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition disabled:opacity-50"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>Copy Data</span>
        </button>
      </div>

      {/* Body */}
      <div className="p-4 sm:p-6 bg-slate-950 min-h-[350px]">
        {parseError ? (
          <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>JSON Parse Error:</span>
            </div>
            <p className="font-mono">{parseError}</p>
          </div>
        ) : (
          <pre className="text-emerald-400 font-mono text-xs overflow-auto max-h-[500px] leading-relaxed p-4 bg-slate-900/80 rounded-2xl border border-slate-800">
            {JSON.stringify(parsedData, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};
