import React, { useState } from 'react';
import { Terminal, Trash2, ChevronDown, ChevronUp, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export interface ConsoleLogEntry {
  type: 'log' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: number;
}

interface ToolConsoleDrawerProps {
  logs: ConsoleLogEntry[];
  onClear: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const ToolConsoleDrawer: React.FC<ToolConsoleDrawerProps> = ({ logs, onClear, isOpen, onToggle }) => {
  const [filter, setFilter] = useState<'all' | 'error' | 'warn'>('all');

  const filteredLogs = logs.filter((l) => {
    if (filter === 'error') return l.type === 'error';
    if (filter === 'warn') return l.type === 'warn';
    return true;
  });

  const errorCount = logs.filter((l) => l.type === 'error').length;
  const warnCount = logs.filter((l) => l.type === 'warn').length;

  return (
    <div className="border-t border-slate-800 bg-slate-950 flex flex-col transition-all">
      {/* Console Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800/80 bg-slate-900/60 text-xs">
        <button
          onClick={onToggle}
          className="flex items-center gap-2 font-mono font-semibold text-slate-300 hover:text-white"
        >
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span>Console</span>
          {logs.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-slate-400 font-sans">
              {logs.length}
            </span>
          )}
          {errorCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-950/80 text-[10px] text-rose-400 font-sans font-bold flex items-center gap-1">
              <AlertCircle className="w-2.5 h-2.5" /> {errorCount}
            </span>
          )}
          {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>

        {isOpen && (
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-950 rounded-lg p-0.5 border border-slate-800 text-[10px]">
              <button
                onClick={() => setFilter('all')}
                className={`px-2 py-0.5 rounded-md ${filter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('error')}
                className={`px-2 py-0.5 rounded-md ${filter === 'error' ? 'bg-rose-900/60 text-rose-300' : 'text-slate-400'}`}
              >
                Errors ({errorCount})
              </button>
              <button
                onClick={() => setFilter('warn')}
                className={`px-2 py-0.5 rounded-md ${filter === 'warn' ? 'bg-amber-900/60 text-amber-300' : 'text-slate-400'}`}
              >
                Warns ({warnCount})
              </button>
            </div>

            <button
              onClick={onClear}
              className="p-1 text-slate-400 hover:text-rose-400 rounded-md hover:bg-slate-800"
              title="Clear Console"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Logs Output Area */}
      {isOpen && (
        <div className="h-44 overflow-y-auto p-3 font-mono text-[11px] space-y-1 bg-slate-950/90 select-text">
          {filteredLogs.length === 0 ? (
            <p className="text-slate-600 italic py-4 text-center">No console output recorded yet...</p>
          ) : (
            filteredLogs.map((log, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-2 py-1 px-2 rounded-md ${
                  log.type === 'error'
                    ? 'bg-rose-950/30 text-rose-300 border-l-2 border-rose-500'
                    : log.type === 'warn'
                    ? 'bg-amber-950/30 text-amber-300 border-l-2 border-amber-500'
                    : 'text-slate-300 hover:bg-slate-900/50'
                }`}
              >
                <span className="text-slate-500 text-[9px] shrink-0 pt-0.5">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <span className="shrink-0 pt-0.5">
                  {log.type === 'error' && <AlertCircle className="w-3 h-3 text-rose-400" />}
                  {log.type === 'warn' && <AlertTriangle className="w-3 h-3 text-amber-400" />}
                  {log.type === 'info' && <Info className="w-3 h-3 text-sky-400" />}
                </span>
                <span className="whitespace-pre-wrap break-all flex-1">{log.message}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
