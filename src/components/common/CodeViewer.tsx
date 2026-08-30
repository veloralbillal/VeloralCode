import React, { useEffect, useState, useRef } from 'react';
import Prism from 'prismjs';

// Base Prism dependencies MUST be imported in exact dependency order
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markup-templating';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-yaml';

import {
  Copy,
  Check,
  Download,
  Maximize2,
  Minimize2,
  WrapText,
  FileCode,
  Sparkles,
} from 'lucide-react';
import { SupportedLanguage } from '../../types';
import {
  copyTextToClipboard,
  downloadCodeFile,
  getLanguagePrismClass,
} from '../../utils/helpers';
import { useToast } from '../../context/ToastContext';

interface CodeViewerProps {
  code: string;
  language: SupportedLanguage | string;
  title?: string;
  showLineNumbers?: boolean;
  maxHeight?: string;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  code,
  language,
  title = 'Snippet',
  showLineNumbers = true,
  maxHeight = '500px',
}) => {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [wrap, setWrap] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  const prismClass = getLanguagePrismClass(language);

  useEffect(() => {
    if (codeRef.current) {
      try {
        Prism.highlightElement(codeRef.current);
      } catch (err) {
        console.warn('Prism syntax highlighting failed:', err);
      }
    }
  }, [code, language]);

  const handleCopy = async () => {
    const ok = await copyTextToClipboard(code);
    if (ok) {
      setCopied(true);
      showToast('Code copied successfully!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } else {
      showToast('Failed to copy to clipboard', 'error');
    }
  };

  const handleDownload = () => {
    downloadCodeFile(title, code, language);
    showToast(`Downloaded ${title}`, 'info');
  };

  const lineCount = code ? code.split('\n').length : 0;
  const charCount = code ? code.length : 0;

  const content = (
    <div
      className={`rounded-2xl border border-slate-700/60 bg-slate-950 text-slate-100 shadow-xl overflow-hidden font-mono text-sm flex flex-col ${
        isFullscreen ? 'fixed inset-4 z-50 shadow-2xl border-indigo-500/50' : ''
      }`}
    >
      {/* Code Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs text-slate-400 select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="font-semibold text-slate-200 flex items-center gap-1.5">
            <FileCode className="w-3.5 h-3.5 text-indigo-400" />
            {language}
          </span>
          <span className="text-slate-600 dark:text-slate-500">•</span>
          <span>{lineCount} lines</span>
          <span className="text-slate-600 dark:text-slate-500">•</span>
          <span>{(charCount / 1024).toFixed(1)} KB</span>
        </div>

        {/* Toolbar actions */}
        <div className="flex items-center gap-1">
          {/* Wrap Code Button */}
          <button
            onClick={() => setWrap(!wrap)}
            title={wrap ? 'Disable line wrap' : 'Enable line wrap'}
            className={`p-1.5 rounded-md hover:text-white transition-colors ${
              wrap ? 'bg-indigo-600/30 text-indigo-300' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <WrapText className="w-3.5 h-3.5" />
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300 transition-all font-medium"
            title="Copy code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
            title="Download file"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Code'}
            className="p-1.5 rounded-md text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Code Content Box */}
      <div
        className="relative overflow-auto custom-scrollbar flex-1"
        style={{ maxHeight: isFullscreen ? 'calc(100vh - 100px)' : maxHeight }}
      >
        <div className="flex text-[13px] leading-relaxed p-4">
          {/* Optional Line Numbers */}
          {showLineNumbers && (
            <div className="select-none pr-4 text-right text-slate-600 font-mono border-r border-slate-800/80 mr-4 shrink-0">
              {code.split('\n').map((_, index) => (
                <div key={index} className="leading-relaxed">
                  {index + 1}
                </div>
              ))}
            </div>
          )}

          {/* Code Text Container */}
          <pre
            className={`flex-1 m-0 p-0 font-mono bg-transparent ${
              wrap ? 'whitespace-pre-wrap break-all' : 'whitespace-pre'
            }`}
          >
            <code ref={codeRef} className={prismClass}>
              {code}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isFullscreen && (
        <div
          className="fixed inset-0 bg-slate-950/80 z-40 backdrop-blur-sm"
          onClick={() => setIsFullscreen(false)}
        />
      )}
      {content}
    </>
  );
};
