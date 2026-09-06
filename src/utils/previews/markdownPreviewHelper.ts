/**
 * Direct Markdown Preview Generator.
 * Renders formatted Markdown documentation with typography styling directly.
 */

export function generateMarkdownPreview(code: string, title: string): string {
  const jsonCode = JSON.stringify(code);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Markdown Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.5.0/github-markdown-dark.min.css">
  <style>
    body { background-color: #0b0f19; }
    .markdown-body { background-color: transparent !important; color: #e2e8f0; font-family: ui-sans-serif, system-ui, sans-serif; }
    .markdown-body pre { background-color: #030712 !important; border: 1px solid #1f2937; border-radius: 12px; }
    .markdown-body table { border-collapse: collapse; }
    .markdown-body table th, .markdown-body table td { border: 1px solid #334155; }
    .markdown-body table tr { background-color: transparent !important; }
    .markdown-body table tr:nth-child(2n) { background-color: #0f172a !important; }
  </style>
</head>
<body class="p-4 sm:p-8 min-h-screen text-slate-100 flex justify-center">
  <div class="w-full max-w-4xl">
    <div id="content" class="markdown-body"></div>
  </div>

  <script id="raw-markdown" type="application/json">
    ${jsonCode}
  </script>

  <script>
    const md = JSON.parse(document.getElementById('raw-markdown').textContent || '""');
    document.getElementById('content').innerHTML = marked.parse(md);
  </script>
</body>
</html>`;
}
