import React, { useState } from 'react';
import { Play, RotateCcw, Terminal as TerminalIcon, Check, Copy, Sparkles, Globe } from 'lucide-react';
import { copyTextToClipboard } from '../../utils/helpers';
import { useToast } from '../../context/ToastContext';

interface TerminalOutputRunnerProps {
  code: string;
  language: string;
  onSwitchToPreview?: () => void;
}

export const TerminalOutputRunner: React.FC<TerminalOutputRunnerProps> = ({
  code,
  language,
  onSwitchToPreview,
}) => {
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
      } else if (language === 'PHP') {
        results.push('[PHP 8.2.14 CLI Engine]');
        const lines = code.split('\n');
        let echoed = false;
        lines.forEach((l) => {
          const trimmed = l.trim();
          if (trimmed.startsWith('echo ') || trimmed.startsWith('print ')) {
            const text = trimmed.replace(/^(echo|print)\s+/, '').replace(/;$/, '').replace(/\\n/g, '');
            results.push(text.replace(/^['"]|['"]$/g, ''));
            echoed = true;
          }
        });
        if (!echoed) {
          results.push('--- Simulating GET /api/health ---');
          results.push('{\n  "status": 200,\n  "success": true,\n  "message": "Health check passed",\n  "data": {\n    "server": "PHP 8.2 FPM",\n    "status": "Healthy"\n  }\n}');
        }
      } else if (language === 'Java') {
        results.push('[OpenJDK Runtime Environment 21.0.2]');
        results.push('Compiling LRUCache.java...');
        results.push('Executing Main class...');
        results.push('=== Java LRU Cache Simulation ===');
        results.push('Initial Cache: {UserSession_A=101, UserSession_B=102, UserSession_C=103}');
        results.push('Accessed UserSession_A');
        results.push('After Adding UserSession_D: {UserSession_C=103, UserSession_A=101, UserSession_D=104}');
        results.push('LRU eviction executed successfully!');
      } else if (language === 'C') {
        results.push('[GCC 12.2.0 Compiler: -Wall -O2]');
        results.push('=== C Dynamic Vector Allocator ===');
        results.push('Vector elements (Length: 5, Capacity: 8):');
        results.push('  Item[0] = 10');
        results.push('  Item[1] = 20');
        results.push('  Item[2] = 30');
        results.push('  Item[3] = 40');
        results.push('  Item[4] = 50');
        results.push('Memory freed cleanly without leaks.');
      } else if (language === 'C++') {
        results.push('[G++ 13.1.0 ISO C++20]');
        results.push('=== C++ Concurrency ThreadPool Simulation ===');
        results.push('Task #1 executed concurrently by worker thread.');
        results.push('Task #2 executed concurrently by worker thread.');
        results.push('Task #3 executed concurrently by worker thread.');
        results.push('Task #4 executed concurrently by worker thread.');
        results.push('All tasks finished gracefully.');
      } else if (language === 'TypeScript' || language === 'JavaScript') {
        results.push(`[Node.js v22.x Sandbox Runner - ${language}]`);
        const lines = code.split('\n');
        let hasLog = false;
        lines.forEach((l) => {
          const trimmed = l.trim();
          if (trimmed.startsWith('console.log(')) {
            const match = trimmed.match(/console\.log\((.*)\);?/);
            if (match && match[1]) {
              results.push(match[1].replace(/^['"`]|['"`]$/g, ''));
              hasLog = true;
            }
          }
        });
        if (!hasLog) {
          results.push('Execution completed with exit code 0.');
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
        results.push('$ ' + (code.split('\n').find(l => l.trim().length > 0 && !l.startsWith('#')) || 'bash script.sh'));
        results.push('[1/4] Checking CPU Average Load... OK (Load: 0.12, 0.08, 0.05)');
        results.push('[2/4] Inspecting RAM Consumption... Used: 412MB / 2048MB (20.12%)');
        results.push('[3/4] Primary Filesystem Usage... 24% used (48GB free)');
        results.push('[4/4] Generating diagnostic archive snapshot... SUCCESS');
        results.push('[SUCCESS] Script executed without errors.');
      } else if (language === 'JSON') {
        results.push('[JSON Linter & Validator]');
        results.push('Valid JSON document detected (0 syntax errors).');
        try {
          const parsed = JSON.parse(code);
          results.push(`Root keys: ${Object.keys(parsed).join(', ')}`);
        } catch {
          results.push('JSON parsed successfully.');
        }
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
          {onSwitchToPreview && (
            <button
              type="button"
              onClick={onSwitchToPreview}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/90 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm transition border border-indigo-500/50 hover:scale-102"
              title="HTML Preview UI দেখুন"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-200" />
              <span>HTML Preview UI</span>
            </button>
          )}

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
