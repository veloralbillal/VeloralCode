import React, { useState, useEffect } from 'react';
import { RefreshCw, Maximize2, Minimize2, Smartphone, Tablet, Monitor, Terminal, AlertCircle } from 'lucide-react';

interface IframeOutputRunnerProps {
  code: string;
  language: string;
  title: string;
}

export const IframeOutputRunner: React.FC<IframeOutputRunnerProps> = ({ code, language, title }) => {
  const [reloadKey, setReloadKey] = useState(0);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [showConsole, setShowConsole] = useState(false);

  // Generate safe sandboxed HTML content
  const generateSrcDoc = () => {
    let htmlContent = '';

    if (language === 'CSS') {
      htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    ${code}
  </style>
</head>
<body class="p-6 bg-slate-50 text-slate-900 min-h-screen font-sans">
  <div class="max-w-xl mx-auto space-y-4">
    <div class="p-5 bg-white rounded-2xl shadow-sm border border-slate-200">
      <h2 class="text-xl font-bold mb-2">CSS Live Component Output</h2>
      <p class="text-slate-600 text-sm mb-4">The CSS rules uploaded by admin are active in this container.</p>
      <button class="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium shadow hover:bg-indigo-700 transition">Sample Styled Button</button>
    </div>
  </div>
</body>
</html>`;
    } else if (language === 'JavaScript' || language === 'TypeScript') {
      htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; }
  </style>
</head>
<body class="p-4 bg-slate-950 text-emerald-400 font-mono text-sm min-h-screen">
  <div class="mb-3 pb-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
    <span>Console / App Execution Output</span>
    <span class="text-indigo-400 font-bold">● Running Live</span>
  </div>
  <div id="output-screen" class="space-y-1.5 leading-relaxed"></div>
  
  <script>
    const screen = document.getElementById('output-screen');
    function appendLog(msg, type = 'log') {
      const line = document.createElement('div');
      line.className = type === 'error' ? 'text-rose-400' : (type === 'warn' ? 'text-amber-400' : 'text-emerald-300');
      line.textContent = '> ' + (typeof msg === 'object' ? JSON.stringify(msg, null, 2) : msg);
      screen.appendChild(line);
    }

    const _log = console.log;
    const _error = console.error;
    const _warn = console.warn;

    console.log = (...args) => {
      _log.apply(console, args);
      args.forEach(a => appendLog(a, 'log'));
      window.parent.postMessage({ type: 'LOG', data: args.join(' ') }, '*');
    };
    console.error = (...args) => {
      _error.apply(console, args);
      args.forEach(a => appendLog(a, 'error'));
    };
    console.warn = (...args) => {
      _warn.apply(console, args);
      args.forEach(a => appendLog(a, 'warn'));
    };

    window.onerror = (msg, url, line) => {
      appendLog('Runtime Error: ' + msg + ' (Line ' + line + ')', 'error');
      return false;
    };

    try {
      ${code}
    } catch(err) {
      appendLog('Script Error: ' + err.message, 'error');
    }
  </script>
</body>
</html>`;
    } else {
      // HTML, Markdown or rich web document
      const isCompleteDoc = code.includes('<html') || code.includes('<!DOCTYPE') || code.includes('<body');
      if (isCompleteDoc) {
        htmlContent = code;
      } else {
        htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    body { margin: 0; padding: 16px; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; }
  </style>
</head>
<body>
  ${code}
</body>
</html>`;
      }
    }

    return htmlContent;
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const getDeviceWidth = () => {
    if (deviceMode === 'mobile') return 'max-w-sm';
    if (deviceMode === 'tablet') return 'max-w-2xl';
    return 'w-full';
  };

  return (
    <div className={`rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-slate-900 overflow-hidden shadow-xl transition-all ${
      isFullscreen ? 'fixed inset-0 z-50 rounded-none bg-slate-950 flex flex-col' : ''
    }`}>
      {/* Output Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-white tracking-wide uppercase">
            Live Output View
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-mono border border-indigo-800/50">
            {language}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Device Switcher */}
          <div className="hidden sm:flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-700 text-slate-400">
            <button
              onClick={() => setDeviceMode('desktop')}
              title="Desktop View"
              className={`p-1.5 rounded-md transition ${deviceMode === 'desktop' ? 'bg-indigo-600 text-white' : 'hover:text-white'}`}
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceMode('tablet')}
              title="Tablet View"
              className={`p-1.5 rounded-md transition ${deviceMode === 'tablet' ? 'bg-indigo-600 text-white' : 'hover:text-white'}`}
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              title="Mobile View"
              className={`p-1.5 rounded-md transition ${deviceMode === 'mobile' ? 'bg-indigo-600 text-white' : 'hover:text-white'}`}
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setReloadKey((prev) => prev + 1)}
            title="Reload Output"
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
            <span>Reload</span>
          </button>

          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Open Fullscreen'}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div className={`w-full bg-slate-950 flex items-center justify-center p-2 sm:p-4 ${isFullscreen ? 'flex-1 overflow-auto' : ''}`}>
        <div className={`${getDeviceWidth()} w-full transition-all duration-300 ${isFullscreen ? 'h-full' : 'h-[480px] sm:h-[550px]'} bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-800`}>
          <iframe
            key={reloadKey}
            srcDoc={generateSrcDoc()}
            title={title}
            sandbox="allow-scripts allow-modals allow-forms allow-popups allow-same-origin"
            className="w-full h-full border-0 bg-white"
          />
        </div>
      </div>
    </div>
  );
};
