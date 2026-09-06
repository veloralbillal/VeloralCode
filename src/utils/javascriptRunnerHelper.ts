/**
 * Dedicated preview generator for JavaScript and TypeScript.
 * Renders web components and executed scripts in a clean, high-fidelity
 * HTML UI Preview by default—just like an HTML web page.
 *
 * If the code contains HTML tags or is a full web app, it renders directly.
 * If it contains DOM operations or React/JSX, it mounts seamlessly into the document.
 * If it's a script/data logic, it displays a polished web application UI showing
 * real-time execution results, return values, and interactive controls.
 */

export function extractHtmlFromJs(code: string): string | null {
  // Check if JavaScript assigns HTML template to a string variable (e.g. const html = `...`)
  const htmlVarMatch = code.match(/(?:html|template|markup|render)\s*=\s*[`"']([\s\S]*?(?:<!DOCTYPE|<html|<body|<div|<main|<section|<table|<h[1-6]|<form)[\s\S]*?)[`"']/i);
  if (htmlVarMatch && htmlVarMatch[1] && htmlVarMatch[1].includes('<')) {
    return htmlVarMatch[1].trim();
  }

  // Check for document.write or element.innerHTML with HTML
  const innerHtmlMatch = code.match(/innerHTML\s*=\s*[`"']([\s\S]*?(?:<div|<main|<table|<section|<h[1-6]|<p|<button)[\s\S]*?)[`"']/i);
  if (innerHtmlMatch && innerHtmlMatch[1]) {
    return innerHtmlMatch[1].trim();
  }

  return null;
}

export function generateJavaScriptHtmlRunner(code: string, title: string = 'JavaScript App'): string {
  // 1. Full HTML Web Page (User uploaded HTML or complete document inside JS/TS)
  if (code.includes('<html') || code.includes('<!DOCTYPE') || (code.includes('<body') && code.includes('</body>'))) {
    return code;
  }

  // 2. Extracted HTML Template string within JS code
  const extractedTemplate = extractHtmlFromJs(code);
  if (extractedTemplate && (extractedTemplate.includes('<!DOCTYPE') || extractedTemplate.includes('<html'))) {
    return extractedTemplate;
  }

  // 3. React or JSX Detection
  const hasReact = code.includes('React.') || code.includes('useState') || code.includes('useEffect') || code.includes('ReactDOM') || /<[A-Z][A-Za-z0-9]*[\s\/>]/.test(code);

  // Safe JSON serialization of the user's code
  const jsonCode = JSON.stringify(code);
  const safeTitle = (title || 'Interactive Web Application').replace(/"/g, '&quot;');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle} - HTML Preview UI</title>
  <!-- Tailwind CSS & FontAwesome for rich modern web UI -->
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  
  ${hasReact ? `
  <!-- Babel standalone for React / JSX transpilation -->
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  ` : ''}

  <style>
    body {
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      margin: 0;
      padding: 0;
      min-height: 100vh;
      background-color: #0b0f19;
      color: #f1f5f9;
    }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-thumb { background: #334155; border-radius: 9999px; }
  </style>
</head>
<body class="p-3 sm:p-6 flex flex-col items-center">
  <div class="w-full h-full flex flex-col p-2 sm:p-4 space-y-3">
    <!-- Live DOM / Web Viewport Direct Mount -->
    <div id="web-viewport" class="w-full text-slate-100 flex-1">
      ${extractedTemplate ? extractedTemplate : ''}
      <div id="app"></div>
      <div id="root"></div>
    </div>

    <!-- Interactive Console & Output Logs Card -->
    <div class="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
      <div class="flex items-center justify-between border-b border-slate-800 pb-3">
        <div class="flex items-center gap-2 text-xs font-bold text-slate-200">
          <i class="fa-solid fa-terminal text-emerald-400"></i>
          <span>Console & Execution Output</span>
        </div>
        <div class="flex items-center gap-2">
          <span id="log-count-badge" class="text-[11px] text-slate-400 font-mono">0 logs</span>
          <button onclick="clearConsole()" class="text-xs text-slate-400 hover:text-slate-200 underline">Clear</button>
        </div>
      </div>

      <!-- Terminal Output Screen -->
      <div id="output-screen" class="bg-slate-950 border border-slate-800 rounded-2xl p-4 min-h-[160px] max-h-[360px] overflow-y-auto font-mono text-xs text-emerald-300 space-y-1">
        <div class="text-slate-500">// Script loaded. Executing automatically...</div>
      </div>

      <!-- Quick Interactive REPL Evaluator -->
      <div class="flex items-center gap-2 pt-1">
        <div class="relative flex-1">
          <span class="absolute left-3 top-2.5 text-slate-500 font-mono text-xs">&gt;</span>
          <input 
            id="repl-input" 
            type="text" 
            placeholder="Evaluate JavaScript expression (e.g. 2 + 2, typeof myVar, Math.PI)..." 
            onkeydown="if(event.key === 'Enter') evalRepl()"
            class="w-full pl-7 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>
        <button onclick="evalRepl()" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-md transition active:scale-95">
          Eval
        </button>
      </div>
    </div>

  </div>

  <!-- Raw user code embedded safely as JSON -->
  <script id="user-code-storage" type="application/json">
    ${jsonCode}
  </script>

  <script>
    const screen = document.getElementById('output-screen');
    let totalLogs = 0;

    function updateLogCount() {
      const b = document.getElementById('log-count-badge');
      if (b) b.textContent = totalLogs + (totalLogs === 1 ? ' log' : ' logs');
    }

    function clearConsole() {
      screen.innerHTML = '<div class="text-slate-500">// Console cleared.</div>';
      totalLogs = 0;
      updateLogCount();
    }

    function formatVal(v) {
      if (v === null) return 'null';
      if (v === undefined) return 'undefined';
      if (typeof v === 'function') return v.toString();
      if (typeof v === 'object') {
        try {
          return JSON.stringify(v, null, 2);
        } catch(e) {
          return String(v);
        }
      }
      return String(v);
    }

    function appendLog(val, type = 'log', label) {
      totalLogs++;
      updateLogCount();

      const line = document.createElement('div');
      line.className = 'flex items-start gap-2 py-0.5 leading-relaxed';

      const chevron = document.createElement('span');
      chevron.className = 'text-slate-600 select-none font-mono';
      chevron.textContent = '>';

      const content = document.createElement('span');
      content.className = 'font-mono whitespace-pre-wrap break-all';

      if (type === 'error') {
        content.className += ' text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-900/50';
      } else if (type === 'warn') {
        content.className += ' text-amber-300';
      } else if (type === 'return') {
        content.className += ' text-cyan-300 font-bold';
      } else if (type === 'info') {
        content.className += ' text-indigo-300';
      } else {
        content.className += ' text-emerald-300';
      }

      const text = (label ? label + ': ' : '') + formatVal(val);
      content.textContent = text;

      line.appendChild(chevron);
      line.appendChild(content);
      screen.appendChild(line);
      screen.scrollTop = screen.scrollHeight;
    }

    // Intercept standard console methods
    const _log = console.log;
    const _error = console.error;
    const _warn = console.warn;
    const _info = console.info;

    console.log = function(...args) {
      _log.apply(console, args);
      args.forEach(a => appendLog(a, 'log'));
    };
    console.error = function(...args) {
      _error.apply(console, args);
      args.forEach(a => appendLog(a, 'error'));
    };
    console.warn = function(...args) {
      _warn.apply(console, args);
      args.forEach(a => appendLog(a, 'warn'));
    };
    console.info = function(...args) {
      _info.apply(console, args);
      args.forEach(a => appendLog(a, 'info'));
    };

    window.onerror = function(msg, url, line) {
      appendLog(msg + (line ? ' (Line ' + line + ')' : ''), 'error', 'Uncaught Error');
      return false;
    };

    function evalRepl() {
      const inp = document.getElementById('repl-input');
      const val = inp.value.trim();
      if (!val) return;
      appendLog(val, 'info', 'Eval');
      try {
        const res = (0, eval)(val);
        appendLog(res, 'return', 'Result');
      } catch(err) {
        appendLog(err.message, 'error');
      }
      inp.value = '';
    }

    function runCode() {
      screen.innerHTML = '';
      totalLogs = 0;
      updateLogCount();

      const badge = document.getElementById('ui-badge');
      if (badge) {
        badge.textContent = 'Executing...';
        badge.className = 'px-2.5 py-0.5 rounded-full bg-amber-950 border border-amber-800 text-amber-400 text-[10px] font-mono font-bold';
      }

      try {
        const storageEl = document.getElementById('user-code-storage');
        if (!storageEl) return;
        let codeToRun = JSON.parse(storageEl.textContent || '""').trim();

        if (!codeToRun) {
          appendLog('No code provided to execute.', 'warn');
          return;
        }

        // Clean module exports if present (e.g. export default, export const)
        codeToRun = codeToRun
          .replace(/export\\s+default\\s+/g, 'const __default_export__ = ')
          .replace(/export\\s+(const|let|var|function|class)\\s+/g, '$1 ');

        // Check if Babel is available (for JSX / React / TypeScript)
        if (typeof Babel !== 'undefined') {
          try {
            codeToRun = Babel.transform(codeToRun, { presets: ['env', 'react'] }).code;
          } catch(transpileErr) {
            console.warn('Babel transpile notice:', transpileErr);
          }
        }

        let result;
        try {
          result = (0, eval)(codeToRun);
        } catch(directErr) {
          try {
            const fn = new Function(codeToRun);
            result = fn();
          } catch(fnErr) {
            throw directErr;
          }
        }

        if (totalLogs === 0) {
          if (result !== undefined) {
            appendLog(result, 'return', 'Return Value');
          } else {
            appendLog('JavaScript executed successfully with 0 errors.', 'log');
          }
        }

        if (badge) {
          badge.textContent = 'Active (Live)';
          badge.className = 'px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-[10px] font-mono font-bold';
        }
      } catch(err) {
        appendLog(err.message, 'error', 'Execution Error');
        if (badge) {
          badge.textContent = 'Failed';
          badge.className = 'px-2.5 py-0.5 rounded-full bg-rose-950 border border-rose-800 text-rose-400 text-[10px] font-mono font-bold';
        }
      }
    }

    // Automatically run on load
    window.addEventListener('DOMContentLoaded', () => {
      setTimeout(runCode, 50);
    });
  </script>
</body>
</html>`;
}
