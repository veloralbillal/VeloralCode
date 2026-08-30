import React from 'react';
import { JsonOutputRunner } from './JsonOutputRunner';
import { TerminalOutputRunner } from './TerminalOutputRunner';

interface FullScreenToolCanvasProps {
  code: string;
  language: string;
  title: string;
  reloadKey: number;
  deviceMode: 'desktop' | 'tablet' | 'mobile';
}

export const FullScreenToolCanvas: React.FC<FullScreenToolCanvasProps> = ({
  code,
  language,
  title,
  reloadKey,
  deviceMode,
}) => {
  const isWebLanguage = ['HTML', 'JavaScript', 'TypeScript', 'CSS', 'Markdown'].includes(language);
  const isJson = language === 'JSON';

  const generateSrcDoc = () => {
    if (language === 'CSS') {
      return `<!DOCTYPE html>
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
    <div class="p-6 bg-white rounded-2xl shadow-sm border border-slate-200 space-y-3">
      <h2 class="text-xl font-bold text-slate-800">CSS Component Live Test</h2>
      <p class="text-slate-600 text-sm">Your custom CSS styles are active and rendered below.</p>
      <button class="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold shadow-md hover:bg-indigo-700 transition">Sample Styled Button</button>
    </div>
  </div>
</body>
</html>`;
    }

    if (language === 'JavaScript' || language === 'TypeScript') {
      // Check if it's already a full HTML or web script
      if (code.includes('<html') || code.includes('<body') || code.includes('document.createElement') || code.includes('addEventListener')) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 16px; }
  </style>
</head>
<body>
  <div id="app"></div>
  <script>
    try {
      ${code}
    } catch (err) {
      console.error(err);
      document.body.innerHTML += '<div style="color:red;padding:12px;background:#ffebee;border-radius:8px;margin-top:12px;"><b>Runtime Error:</b> ' + err.message + '</div>';
    }
  </script>
</body>
</html>`;
      }

      // Standalone script
      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; }
  </style>
</head>
<body class="p-4 sm:p-6 bg-slate-950 text-emerald-400 font-mono text-xs sm:text-sm min-h-screen">
  <div class="mb-4 pb-3 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
    <div class="flex items-center gap-2">
      <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
      <span class="font-bold text-slate-200">Interactive Execution Console</span>
    </div>
    <span class="text-indigo-400 font-bold">● Active Sandbox</span>
  </div>
  <div id="output-screen" class="space-y-2 leading-relaxed"></div>
  
  <script>
    const screen = document.getElementById('output-screen');
    function appendLog(msg, type = 'log') {
      const line = document.createElement('div');
      line.className = type === 'error' ? 'text-rose-400 bg-rose-950/40 p-2 rounded' : (type === 'warn' ? 'text-amber-400' : 'text-emerald-300');
      line.textContent = '> ' + (typeof msg === 'object' ? JSON.stringify(msg, null, 2) : msg);
      screen.appendChild(line);
    }

    const _log = console.log;
    const _error = console.error;
    const _warn = console.warn;

    console.log = (...args) => {
      _log.apply(console, args);
      args.forEach(a => appendLog(a, 'log'));
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
    }

    // HTML / Web Application
    const isCompleteDoc = code.includes('<html') || code.includes('<!DOCTYPE') || code.includes('<body');
    if (isCompleteDoc) {
      return code;
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    body { margin: 0; padding: 0; min-height: 100vh; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; }
  </style>
</head>
<body>
  ${code}
</body>
</html>`;
  };

  const getContainerWidth = () => {
    if (deviceMode === 'mobile') return 'max-w-[420px] shadow-2xl border-x border-slate-800 my-auto rounded-3xl h-[92%] overflow-hidden';
    if (deviceMode === 'tablet') return 'max-w-3xl shadow-2xl border-x border-slate-800 my-auto rounded-3xl h-[94%] overflow-hidden';
    return 'w-full h-full';
  };

  if (isJson) {
    return (
      <div className="h-full p-4 overflow-auto bg-slate-950">
        <JsonOutputRunner code={code} />
      </div>
    );
  }

  if (!isWebLanguage) {
    return (
      <div className="h-full p-4 overflow-auto bg-slate-950">
        <TerminalOutputRunner code={code} language={language} />
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-slate-950 flex items-center justify-center overflow-hidden">
      <div className={`${getContainerWidth()} w-full bg-white transition-all duration-300 relative`}>
        <iframe
          key={reloadKey}
          srcDoc={generateSrcDoc()}
          title={title}
          sandbox="allow-scripts allow-modals allow-forms allow-popups allow-same-origin"
          className="w-full h-full border-0 bg-white"
        />
      </div>
    </div>
  );
};
