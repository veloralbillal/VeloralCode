/**
 * Direct CSS Preview Generator.
 * Directly renders styled components in a clean live sandbox without banners.
 */

export function generateCssPreview(code: string, title: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - CSS Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    body { font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    ${code}
  </style>
</head>
<body class="p-4 sm:p-6 bg-slate-950 text-slate-100 min-h-screen flex flex-col items-center justify-center">
  <div class="w-full max-w-2xl space-y-6">
    <!-- Live Styled Component Sandbox -->
    <div class="p-8 sm:p-12 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl flex flex-col items-center justify-center text-center space-y-5">
      <div class="demo-box glass-card space-y-3 p-6 rounded-2xl">
        <h2 class="text-xl sm:text-2xl font-bold text-white tracking-tight">Active CSS Styled Component</h2>
        <p class="text-sm text-slate-300 max-w-md">Your CSS rules, animations, and class declarations are live and rendered below.</p>
        
        <div class="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg transition active:scale-95">
            Primary Action
          </button>
          <button class="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition">
            Secondary Button
          </button>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
}
