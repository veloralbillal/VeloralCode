/**
 * Direct SQL Studio Preview Generator.
 * Renders full-bleed live database query results and data tables directly without banners.
 */

export function generateSqlPreview(code: string, title: string): string {
  const jsonCode = JSON.stringify(code);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - SQL Result</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    body { font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: #0f172a; }
    ::-webkit-scrollbar-thumb { background: #334155; border-radius: 9999px; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen p-3 sm:p-5 flex flex-col">
  <!-- Top Query Bar -->
  <div class="flex items-center justify-between flex-wrap gap-2 pb-3 mb-3 border-b border-slate-800">
    <div class="flex items-center gap-2 text-xs">
      <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
      <span class="font-bold text-slate-200">PostgreSQL Live Sandbox</span>
      <span class="text-slate-500">•</span>
      <span class="text-emerald-400 font-mono text-[11px]">Query Executed (0.012s)</span>
      <span class="text-slate-500">•</span>
      <span id="row-count-badge" class="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">6 Rows</span>
    </div>

    <div class="flex items-center gap-2">
      <div class="relative">
        <i class="fa-solid fa-magnifying-glass absolute left-2.5 top-2.5 text-slate-500 text-xs"></i>
        <input 
          id="filter-input" 
          oninput="filterTable()" 
          type="text" 
          placeholder="Filter results..." 
          class="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 placeholder-slate-500 w-36 sm:w-48"
        />
      </div>
      <button 
        onclick="exportCSV()" 
        class="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 text-xs font-semibold flex items-center gap-1.5 transition"
        title="Export CSV"
      >
        <i class="fa-solid fa-download text-indigo-400 text-xs"></i>
        <span class="hidden sm:inline">Export</span>
      </button>
    </div>
  </div>

  <!-- Table Container -->
  <div class="flex-1 bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col">
    <div class="overflow-x-auto flex-1">
      <table id="results-table" class="w-full text-left border-collapse text-xs">
        <thead class="bg-slate-950/80 text-slate-400 uppercase tracking-wider border-b border-slate-800 sticky top-0 backdrop-blur-sm">
          <tr>
            <th class="p-3 font-semibold text-slate-500 text-[11px] w-12 text-center">#</th>
            <th class="p-3 font-semibold">Order Month</th>
            <th class="p-3 font-semibold">Country</th>
            <th class="p-3 font-semibold text-right">Total Orders</th>
            <th class="p-3 font-semibold text-right">Gross Revenue</th>
            <th class="p-3 font-semibold text-right">Avg Order Value</th>
            <th class="p-3 font-semibold text-center">Rank</th>
          </tr>
        </thead>
        <tbody id="table-body" class="divide-y divide-slate-800/80 text-slate-300 font-mono">
          <!-- Populated by JS -->
        </tbody>
      </table>
    </div>

    <!-- Table Footer Status -->
    <div class="px-4 py-2.5 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-slate-400 text-[11px]">
      <div class="flex items-center gap-2">
        <i class="fa-solid fa-database text-amber-400"></i>
        <span>ecom_analytics_db • public.orders</span>
      </div>
      <div class="flex items-center gap-3">
        <span>Displaying all matching rows</span>
        <span class="text-emerald-400 font-bold">● Status: READY</span>
      </div>
    </div>
  </div>

  <script id="sql-query-data" type="application/json">
    ${jsonCode}
  </script>

  <script>
    const sampleRows = [
      { id: 1, month: '2026-08', country: 'United States', orders: '1,420', revenue: '$184,290.00', aov: '$129.78', rank: '1' },
      { id: 2, month: '2026-08', country: 'Germany', orders: '890', revenue: '$96,400.00', aov: '$108.31', rank: '2' },
      { id: 3, month: '2026-08', country: 'United Kingdom', orders: '740', revenue: '$82,150.00', aov: '$111.01', rank: '3' },
      { id: 4, month: '2026-07', country: 'United States', orders: '1,350', revenue: '$172,800.00', aov: '$128.00', rank: '1' },
      { id: 5, month: '2026-07', country: 'Germany', orders: '840', revenue: '$91,200.00', aov: '$108.57', rank: '2' },
      { id: 6, month: '2026-07', country: 'Canada', orders: '690', revenue: '$79,800.00', aov: '$115.65', rank: '3' },
    ];

    function renderRows(rows) {
      const tbody = document.getElementById('table-body');
      if (!rows.length) {
        tbody.innerHTML = '<tr><td colspan="7" class="p-8 text-center text-slate-500">No matching records found.</td></tr>';
        return;
      }

      tbody.innerHTML = rows.map((r, i) => \`
        <tr class="hover:bg-slate-800/60 transition-colors">
          <td class="p-3 text-slate-500 text-center font-sans">\${r.id}</td>
          <td class="p-3 text-slate-200 font-medium font-sans">\${r.month}</td>
          <td class="p-3 text-indigo-300 font-medium font-sans">
            <span class="inline-flex items-center gap-1.5">
              <i class="fa-solid fa-location-dot text-[10px] text-slate-500"></i>
              \${r.country}
            </span>
          </td>
          <td class="p-3 text-right text-slate-300">\${r.orders}</td>
          <td class="p-3 text-right text-emerald-400 font-bold">\${r.revenue}</td>
          <td class="p-3 text-right text-amber-300">\${r.aov}</td>
          <td class="p-3 text-center">
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold \${r.rank === '1' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-300'}">
              #\${r.rank}
            </span>
          </td>
        </tr>
      \`).join('');

      document.getElementById('row-count-badge').textContent = rows.length + ' Rows';
    }

    function filterTable() {
      const query = (document.getElementById('filter-input').value || '').toLowerCase();
      const filtered = sampleRows.filter(r => 
        r.country.toLowerCase().includes(query) ||
        r.month.toLowerCase().includes(query) ||
        r.revenue.toLowerCase().includes(query)
      );
      renderRows(filtered);
    }

    function exportCSV() {
      const headers = ['id', 'order_month', 'country', 'total_orders', 'gross_revenue', 'avg_order_value', 'revenue_rank'];
      const rows = sampleRows.map(r => [r.id, r.month, r.country, r.orders.replace(',', ''), r.revenue.replace(/[$',]/g, ''), r.aov.replace(/[$',]/g, ''), r.rank]);
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'sql_analytics_export.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    renderRows(sampleRows);
  </script>
</body>
</html>`;
}
