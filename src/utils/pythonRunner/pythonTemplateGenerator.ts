import { PythonMetadata } from './pythonExtractor';
import { PYTHON_PREVIEW_STYLES } from './pythonUiStyles';
import { getPythonClientScript } from './pythonClientScript';

/**
 * Builds the complete HTML page with default interactive UI for Python scripts.
 */
export function buildPythonHtmlDocument(
  code: string,
  title: string,
  metadata: PythonMetadata
): string {
  // If author provided an embedded HTML page directly
  if (metadata.extractedHtml && (metadata.extractedHtml.includes('<html') || metadata.extractedHtml.includes('<!DOCTYPE'))) {
    return metadata.extractedHtml;
  }

  const safeTitle = title || 'Python Interactive Tool';
  const detectedLibs = metadata.imports.filter((p) => !['sys', 'os', 'math', 'time', 'json'].includes(p));
  const pipCommand = detectedLibs.length > 0 ? `pip install ${detectedLibs.join(' ')}` : 'pip install requests';
  const inputPlaceholder = metadata.inputPrompts[0] || 'Enter test parameter, query, or arguments...';

  const clientScript = getPythonClientScript(metadata.prints);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle} - Web Live Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>${PYTHON_PREVIEW_STYLES}</style>
</head>
<body class="min-h-screen p-3 sm:p-4 flex flex-col bg-slate-950 text-slate-100">
  <div class="max-w-4xl w-full mx-auto flex-1 flex flex-col space-y-3">
    
    <!-- Top Header Bar -->
    <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 px-4 flex items-center justify-between shadow-lg backdrop-blur-md">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-lg shadow-inner">
          <i class="fa-brands fa-python"></i>
        </div>
        <div>
          <h1 class="text-sm font-bold text-slate-100 flex items-center gap-2 leading-none">
            <span>${safeTitle}</span>
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-indigo-950 border border-indigo-800 text-indigo-300 font-medium hidden sm:inline">
              Web Preview UI
            </span>
          </h1>
          <p class="text-[11px] text-slate-400 mt-1">Python 3.12 Browser Execution Sandbox</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span id="status-badge" class="px-2.5 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
          READY
        </span>
      </div>
    </div>

    <!-- Interactive Controls Bar -->
    <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 shadow-md space-y-2.5">
      <div class="flex items-center gap-2">
        <div class="relative flex-1">
          <i class="fa-solid fa-terminal absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
          <input
            id="py-param-input"
            type="text"
            placeholder="${inputPlaceholder}"
            class="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-indigo-500 transition"
          />
        </div>
        <button
          id="btn-run"
          onclick="executePythonTool()"
          class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/30 transition flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <i class="fa-solid fa-play text-xs"></i>
          <span>Run Script</span>
        </button>
      </div>

      <!-- Quick Action Buttons -->
      <div class="flex items-center justify-between text-xs text-slate-400 pt-0.5 px-1">
        <span class="text-[11px] flex items-center gap-1.5 text-slate-500">
          <i class="fa-solid fa-bolt text-amber-400/80"></i>
          <span>Press Enter to execute</span>
        </span>
        <div class="flex items-center gap-2">
          <button
            id="btn-copy"
            onclick="copyOutput()"
            class="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] transition flex items-center gap-1 cursor-pointer"
          >
            <i class="fa-regular fa-copy"></i>
            <span>Copy</span>
          </button>
          <button
            onclick="clearConsole()"
            class="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] transition flex items-center gap-1 cursor-pointer"
          >
            <i class="fa-solid fa-rotate-right text-[10px]"></i>
            <span>Clear</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Output Terminal Screen -->
    <div class="flex-1 min-h-[220px] bg-slate-950 border border-slate-800/90 rounded-2xl p-3.5 shadow-inner flex flex-col">
      <div class="flex items-center justify-between pb-2 mb-2 border-b border-slate-900 text-[11px] text-slate-500 font-mono">
        <span class="flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Live Standard Output (stdout)
        </span>
        <span>UTF-8</span>
      </div>
      <div id="output-terminal" class="flex-1 overflow-y-auto max-h-[360px] space-y-1 select-text"></div>
    </div>

    <!-- Terminal & Termux CLI Guide -->
    <div class="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 text-xs text-slate-300">
      <div class="flex items-center justify-between">
        <span class="font-bold flex items-center gap-1.5 text-slate-300 text-[11px]">
          <i class="fa-solid fa-laptop-code text-indigo-400"></i>
          <span>Run in PC / Termux CLI</span>
        </span>
        <span class="text-[10px] text-slate-500 font-mono">Terminal Instructions</span>
      </div>
      <div class="mt-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 font-mono text-[11px] text-indigo-300 flex items-center justify-between gap-2 overflow-x-auto">
        <code>${pipCommand} &amp;&amp; python main.py</code>
        <button
          onclick="navigator.clipboard.writeText('${pipCommand} &amp;&amp; python main.py'); this.innerText='Copied!';"
          class="px-2 py-0.5 bg-indigo-950 text-indigo-300 border border-indigo-800 hover:bg-indigo-900 rounded text-[10px] font-sans font-semibold shrink-0 cursor-pointer"
        >
          Copy
        </button>
      </div>
    </div>

  </div>

  <script>${clientScript}</script>
</body>
</html>`;
}
