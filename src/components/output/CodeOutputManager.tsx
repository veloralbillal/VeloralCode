import React, { useState } from 'react';
import { Play, Code, Eye, Sparkles, Layers, Download, Copy, Check } from 'lucide-react';
import { IframeOutputRunner } from './IframeOutputRunner';
import { JsonOutputRunner } from './JsonOutputRunner';
import { TerminalOutputRunner } from './TerminalOutputRunner';
import { CodeViewer } from '../common/CodeViewer';
import { copyTextToClipboard, downloadCodeFile } from '../../utils/helpers';
import { useToast } from '../../context/ToastContext';

interface CodeOutputManagerProps {
  code: string;
  language: string;
  title: string;
}

export const CodeOutputManager: React.FC<CodeOutputManagerProps> = ({ code, language, title }) => {
  const { showToast } = useToast();
  // Default to 'output' view so user directly sees the live result/working output!
  const [activeTab, setActiveTab] = useState<'output' | 'source'>('output');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await copyTextToClipboard(code);
    if (ok) {
      setCopied(true);
      showToast('Source code copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    downloadCodeFile(code, title, language);
    showToast(`Downloaded ${title} code file`, 'info');
  };

  const isWebLanguage = ['HTML', 'JavaScript', 'TypeScript', 'CSS', 'Markdown'].includes(language);
  const isJson = language === 'JSON';

  return (
    <div className="space-y-4">
      {/* Top View Selector Switcher */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-white dark:bg-slate-900 p-2 sm:p-2.5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
        {/* Output vs Source Code Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab('output')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'output'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current text-emerald-300" />
            <span>Live Output (ফলাফল)</span>
          </button>

          <button
            onClick={() => setActiveTab('source')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'source'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>View Source Code</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium hover:bg-slate-100 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Copy Code</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium hover:bg-slate-100 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </div>

      {/* Main Content Area: Default shows Live Output directly! */}
      {activeTab === 'output' ? (
        <div>
          {isWebLanguage ? (
            <IframeOutputRunner code={code} language={language} title={title} />
          ) : isJson ? (
            <JsonOutputRunner code={code} />
          ) : (
            <TerminalOutputRunner code={code} language={language} />
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <CodeViewer
            code={code}
            language={language}
            title={title}
            showLineNumbers={true}
            maxHeight="650px"
          />
        </div>
      )}
    </div>
  );
};
