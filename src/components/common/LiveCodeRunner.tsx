import React, { useState } from 'react';
import { Play, RefreshCw, Eye, AlertCircle, CheckCircle } from 'lucide-react';
import { SupportedLanguage } from '../../types';

interface LiveCodeRunnerProps {
  code: string;
  language: SupportedLanguage | string;
}

export const LiveCodeRunner: React.FC<LiveCodeRunnerProps> = ({ code, language }) => {
  const [key, setKey] = useState(0);
  const [jsonOutput, setJsonOutput] = useState<{ formatted?: string; error?: string } | null>(null);

  const canRunLive = ['HTML', 'JavaScript', 'CSS', 'JSON', 'Markdown'].includes(language);

  if (!canRunLive) return null;

  const handleRefresh = () => {
    setKey((prev) => prev + 1);
  };

  if (language === 'JSON') {
    const formatJson = () => {
      try {
        const parsed = JSON.parse(code);
        setJsonOutput({ formatted: JSON.stringify(parsed, null, 2) });
      } catch (err: any) {
        setJsonOutput({ error: err.message || 'Invalid JSON syntax' });
      }
    };

    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Play className="w-3.5 h-3.5 text-indigo-500" />
            JSON Validator & Parser
          </span>
          <button
            onClick={formatJson}
            className="px-3 py-1 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
          >
            Validate & Parse
          </button>
        </div>

        {jsonOutput && (
          <div className="text-xs">
            {jsonOutput.error ? (
              <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{jsonOutput.error}</span>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>Valid JSON structure parsed successfully.</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // HTML / JS / CSS Preview Runner
  let srcDoc = code;
  if (language === 'CSS') {
    srcDoc = `<!DOCTYPE html><html><head><style>${code}</style></head><body style="font-family: sans-serif; padding: 20px;"><h2>CSS Style Preview</h2><p>This is a live preview test container demonstrating your CSS styles.</p><button class="btn" style="padding: 8px 16px; cursor: pointer;">Test Button</button></body></html>`;
  } else if (language === 'JavaScript') {
    srcDoc = `<!DOCTYPE html><html><head><style>body { font-family: monospace; background: #0f172a; color: #38bdf8; padding: 16px; font-size: 13px; margin: 0; }</style></head><body><div id="log-output"></div><script>
      const logBox = document.getElementById('log-output');
      const originalLog = console.log;
      console.log = function(...args) {
        originalLog.apply(console, args);
        const p = document.createElement('div');
        p.textContent = '> ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ');
        p.style.marginBottom = '4px';
        logBox.appendChild(p);
      };
      try {
        ${code}
      } catch(err) {
        const p = document.createElement('div');
        p.textContent = 'Error: ' + err.message;
        p.style.color = '#f87171';
        logBox.appendChild(p);
      }
    </script></body></html>`;
  }

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-indigo-500" />
          Interactive Live Output Preview
        </span>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reload</span>
        </button>
      </div>
      <div className="h-64 w-full bg-white dark:bg-slate-950">
        <iframe
          key={key}
          srcDoc={srcDoc}
          title="Live Code Output"
          sandbox="allow-scripts"
          className="w-full h-full border-0"
        />
      </div>
    </div>
  );
};
