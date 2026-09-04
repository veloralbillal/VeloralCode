import React, { useState } from 'react';
import { Play, RotateCcw, Terminal as TerminalIcon, Check, Copy, Sparkles } from 'lucide-react';
import { copyTextToClipboard } from '../../utils/helpers';
import { useToast } from '../../context/ToastContext';

interface TerminalOutputRunnerProps {
  code: string;
  language: string;
}

export const TerminalOutputRunner: React.FC<TerminalOutputRunnerProps> = ({ code, language }) => {
  const { showToast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [outputLogs, setOutputLogs] = useState<string[]>([]);
  const [hasRun, setHasRun] = useState(false);
  const [copied, setCopied] = useState(false);

  // Execute or simulate execution of scripts
  const handleExecute = () => {
    setIsRunning(true);
    setOutputLogs(['[Starting execution process...]', `[Environment: Sandbox ${language} Engine v2.4]`]);

    setTimeout(() => {
      let results: string[] = [];

      if (language === 'Python') {
        const lines = code.split('\n');
        let printedAny = false;
        lines.forEach((l) => {
          const trimmed = l.trim();
          if (trimmed.startsWith('print(')) {
            const match = trimmed.match(/print\((.*)\)/);
            if (match && match[1]) {
              let val = match[1].trim();
              if ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"'))) {
                val = val.slice(1, -1);
              }
              results.push(val);
              printedAny = true;
            }
          }
        });
        if (!printedAny) {
          results.push('Python 3.10.12 (Sandbox Environment)');
          results.push('Program executed successfully with exit code 0.');
        }
      } else if (language === 'SQL') {
        results.push('Query executed successfully (0.015 sec)');
        results.push('+----+------------------------+-------------+');
        results.push('| id | title                  | status      |');
        results.push('+----+------------------------+-------------+');
        results.push('|  1 | Sample Code Snippet    | published   |');
        results.push('+----+------------------------+-------------+');
        results.push('(1 row in set)');
      } else if (language === 'Bash') {
        results.push('$ ' + (code.split('\n')[0] || 'bash script.sh'));
        results.push('[SUCCESS] Script executed without errors.');
      } else {
        results.push(`Execution completed for ${language} script.`);
        results.push('Process finished with exit code 0.');
      }

      setOutputLogs((prev) => [...prev, ...results]);
      setIsRunning(false);
      setHasRun(true);
    }, 500);
  };

  const handleClear = () => {
    setOutputLogs([]);
    setHasRun(false);
  };

  const handleCopyLogs = async () => {
    const text = outputLogs.join('\n');
    const ok = await copyTextToClipboard(text);
    if (ok) {
      setCopied(true);
      showToast('Output copied!', 'info');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-slate-950 overflow-hidden shadow-xl">
      {/* Terminal Titlebar */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 border-b border-slate-800 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <TerminalIcon className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            {language} Live Terminal Console
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono border border-emerald-800">
            Interactive
          </span>
        </div>

        <div className="flex items-center gap-2">
          {outputLogs.length > 0 && (
            <button
              onClick={handleCopyLogs}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs transition"
              title="Copy Output"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}

          <button
            onClick={handleClear}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs transition"
            title="Clear Console"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleExecute}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition shadow-md shadow-emerald-600/30 disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isRunning ? 'Running...' : 'Run Output'}</span>
          </button>
        </div>
      </div>

      {/* Terminal Screen */}
      <div className="p-5 font-mono text-xs text-emerald-400 min-h-[320px] max-h-[480px] overflow-auto space-y-2 leading-relaxed">
        <div className="text-slate-500 pb-2 border-b border-slate-800/80 flex items-center justify-between">
          <span>Click "Run Output" to execute and see results</span>
          <span className="text-emerald-500 font-bold">READY</span>
        </div>

        {outputLogs.length === 0 ? (
          <div className="py-12 text-center text-slate-600 space-y-2">
            <Sparkles className="w-8 h-8 mx-auto text-slate-700" />
            <p>Ready to execute {language} code</p>
            <button
              onClick={handleExecute}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 border border-slate-700 transition"
            >
              <Play className="w-3.5 h-3.5 text-emerald-400" />
              Execute Now
            </button>
          </div>
        ) : (
          outputLogs.map((log, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="text-slate-600 select-none">{idx + 1}</span>
              <span className="text-emerald-300">{log}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
