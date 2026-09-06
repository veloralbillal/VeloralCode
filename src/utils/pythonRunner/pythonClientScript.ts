/**
 * Client-side script injected into the Python iframe runner.
 * Manages execution, logs, user input handling, and output formatting.
 */

export function getPythonClientScript(initialOutputs: string[]): string {
  const initialJson = JSON.stringify(initialOutputs);

  return `
    let outputCount = 0;
    const initialLogs = ${initialJson};

    window.onload = function() {
      if (initialLogs && initialLogs.length > 0) {
        initialLogs.forEach(log => appendOutput(log, 'print'));
      } else {
        appendOutput('Python 3.12 Web Sandbox initialized and ready.', 'system');
      }

      // Enter key shortcut on parameter input
      const inputEl = document.getElementById('py-param-input');
      if (inputEl) {
        inputEl.addEventListener('keydown', function(e) {
          if (e.key === 'Enter') {
            executePythonTool();
          }
        });
      }
    };

    function appendOutput(text, type = 'print') {
      const container = document.getElementById('output-terminal');
      if (!container) return;

      outputCount++;
      const line = document.createElement('div');
      line.className = 'flex items-start gap-2.5 text-xs font-mono leading-relaxed py-0.5';

      let textClass = 'text-emerald-300';
      let icon = '&gt;';

      if (type === 'system') {
        textClass = 'text-slate-400 italic';
        icon = '#';
      } else if (type === 'error') {
        textClass = 'text-rose-400 font-semibold bg-rose-950/40 p-2 rounded-lg border border-rose-900/60 w-full';
        icon = '!';
      } else if (type === 'success') {
        textClass = 'text-emerald-400 font-bold';
        icon = '✓';
      } else if (type === 'input') {
        textClass = 'text-cyan-300 font-medium';
        icon = '➜';
      }

      line.innerHTML = '<span class="text-slate-600 select-none text-[11px] w-5 text-right shrink-0">' + outputCount + '</span>' +
                       '<span class="text-slate-500 select-none shrink-0">' + icon + '</span>' +
                       '<span class="' + textClass + ' break-words flex-1">' + escapeHtml(text) + '</span>';

      container.appendChild(line);
      container.scrollTop = container.scrollHeight;
    }

    function escapeHtml(str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    function clearConsole() {
      const container = document.getElementById('output-terminal');
      if (container) {
        container.innerHTML = '';
        outputCount = 0;
        appendOutput('Console cleared. Ready for next execution.', 'system');
      }
    }

    function copyOutput() {
      const container = document.getElementById('output-terminal');
      if (!container) return;
      const text = container.innerText;
      navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById('btn-copy');
        if (btn) {
          btn.innerHTML = '<i class="fa-solid fa-check text-emerald-400 mr-1"></i> Copied!';
          setTimeout(() => {
            btn.innerHTML = '<i class="fa-regular fa-copy mr-1"></i> Copy';
          }, 2000);
        }
      });
    }

    function executePythonTool() {
      const inputEl = document.getElementById('py-param-input');
      const paramVal = inputEl ? inputEl.value.trim() : '';
      const runBtn = document.getElementById('btn-run');
      const statusBadge = document.getElementById('status-badge');

      if (statusBadge) {
        statusBadge.textContent = 'RUNNING';
        statusBadge.className = 'px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-amber-950 text-amber-300 border border-amber-800';
      }

      if (runBtn) {
        runBtn.disabled = true;
        runBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1.5"></i> Running...';
      }

      if (paramVal) {
        appendOutput('User Input: ' + paramVal, 'input');
      }

      setTimeout(() => {
        try {
          if (window.runPyLogic) {
            window.runPyLogic(paramVal);
          } else {
            appendOutput('Process finished with exit code 0.', 'success');
          }
        } catch (err) {
          appendOutput('Execution error: ' + err.message, 'error');
        }

        if (statusBadge) {
          statusBadge.textContent = 'READY';
          statusBadge.className = 'px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-950 text-emerald-300 border border-emerald-800';
        }

        if (runBtn) {
          runBtn.disabled = false;
          runBtn.innerHTML = '<i class="fa-solid fa-play text-xs mr-1.5"></i> Run Script';
        }
      }, 350);
    }
  `;
}
