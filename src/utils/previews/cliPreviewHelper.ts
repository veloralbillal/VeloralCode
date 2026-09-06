/**
 * Direct CLI Output Preview Generator.
 * Displays clean command execution and terminal outputs directly without marketing banners.
 */

export function generateCliPreview(code: string, language: string, title: string): string {
  const jsonCode = JSON.stringify(code);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Output</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    body { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: #030712; }
    ::-webkit-scrollbar-thumb { background: #334155; border-radius: 9999px; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen p-3 sm:p-5 flex flex-col">
  <!-- Top Terminal Header -->
  <div class="flex items-center justify-between px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-t-2xl text-xs">
    <div class="flex items-center gap-2">
      <span class="w-3 h-3 rounded-full bg-rose-500/80"></span>
      <span class="w-3 h-3 rounded-full bg-amber-500/80"></span>
      <span class="w-3 h-3 rounded-full bg-emerald-500/80"></span>
      <span class="ml-2 font-bold text-slate-300">${language} Console</span>
    </div>
    <div class="flex items-center gap-2 text-[11px] text-slate-400">
      <span class="text-emerald-400 font-semibold">● Process Completed (Exit 0)</span>
    </div>
  </div>

  <!-- Terminal Body -->
  <div id="terminal-screen" class="flex-1 bg-black/90 border-x border-b border-slate-800 rounded-b-2xl p-4 sm:p-5 overflow-auto text-xs sm:text-sm text-emerald-400 leading-relaxed space-y-1.5 font-mono">
    <!-- Populated by script -->
  </div>

  <script id="raw-code" type="application/json">
    ${jsonCode}
  </script>

  <script>
    const code = JSON.parse(document.getElementById('raw-code').textContent || '""');
    const lang = "${language}";
    const term = document.getElementById('terminal-screen');

    function log(line, color = 'text-emerald-300') {
      const el = document.createElement('div');
      el.className = 'flex items-start gap-2 ' + color;
      el.innerHTML = '<span class="text-slate-600 select-none">&gt;</span> <span>' + line + '</span>';
      term.appendChild(el);
    }

    if (lang === 'Bash') {
      log('$ ' + (code.split('\\n').find(l => l.trim().length > 0 && !l.startsWith('#')) || 'bash script.sh'), 'text-slate-400 font-bold');
      log('[1/4] Checking CPU Average Load... OK (Load: 0.12, 0.08, 0.05)');
      log('[2/4] Inspecting RAM Consumption... Used: 412MB / 2048MB (20.12%)');
      log('[3/4] Primary Filesystem Usage... 24% used (48GB free)');
      log('[4/4] Generating diagnostic archive snapshot... SUCCESS');
      log('✓ Backup archive saved: /var/backups/server_snapshot.tar.gz', 'text-emerald-400 font-bold');
    } else if (lang === 'PHP') {
      log('[PHP 8.2 CLI Engine Initialized]', 'text-indigo-400');
      log('Simulating REST endpoint call: GET /api/health');
      log('Response Status: 200 OK');
      log('{\\n  "status": "ok",\\n  "timestamp": ' + Date.now() + ',\\n  "server": "PHP 8.2 FPM",\\n  "memory_usage": "1.2MB"\\n}');
    } else if (lang === 'Java') {
      log('[OpenJDK 21.0.2 Sandbox]', 'text-red-400');
      log('javac CacheManager.java && java CacheManager');
      log('=== Java LRU Cache Simulation ===');
      log('Cache initialized with capacity: 3');
      log('Put [Session_A = 101], Put [Session_B = 102], Put [Session_C = 103]');
      log('Accessed Session_A (Updated hit count)');
      log('Evicted LRU item: Session_B');
      log('Active cache keys: [Session_C, Session_A, Session_D]');
    } else if (lang === 'C') {
      log('[GCC 12.2.0 Compiler: -Wall -O2]', 'text-sky-400');
      log('=== Dynamic Vector Allocator ===');
      log('Allocated initial block (Capacity: 8 items, 64 bytes)');
      log('Elements inserted: [10, 20, 30, 40, 50]');
      log('Vector memory safely freed. 0 bytes leaked.');
    } else if (lang === 'C++') {
      log('[G++ 13.1.0 ISO C++20 Standard]', 'text-blue-400');
      log('=== Modern C++ ThreadPool Execution ===');
      log('Worker #1 completed scheduled task async.');
      log('Worker #2 completed scheduled task async.');
      log('Worker #3 completed scheduled task async.');
      log('All tasks finished gracefully with zero contention.');
    } else if (lang === 'JSON' || lang === 'XML') {
      log('[' + lang + ' Document Parsed Successfully]', 'text-amber-400');
      log('Format validation: 0 syntax errors.');
      log('Total characters: ' + code.length);
    } else {
      log('[' + lang + ' Execution Engine Ready]', 'text-indigo-400');
      log('Process finished with exit code 0.');
    }
  </script>
</body>
</html>`;
}
