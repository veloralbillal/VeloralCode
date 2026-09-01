import React from 'react';
import { Download } from 'lucide-react';
import { CodeItem } from '../../types';
import { useToast } from '../../context/ToastContext';

interface ExportToolButtonProps {
  code: CodeItem;
}

export const ExportToolButton: React.FC<ExportToolButtonProps> = ({ code }) => {
  const { showToast } = useToast();

  const handleExport = () => {
    try {
      const htmlPart = code.html || '';
      const cssPart = code.css ? `<style>\n${code.css}\n</style>` : '';
      const jsPart = code.js ? `<script>\n${code.js}\n</script>` : '';
      const singleCode = code.code || '';

      const fullHtmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${code.title || 'Exported Tool'}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  ${cssPart}
</head>
<body class="bg-slate-50 text-slate-900">
  ${htmlPart || singleCode}
  ${jsPart}
</body>
</html>`;

      const blob = new Blob([fullHtmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const filename = `${(code.title || 'tool').toLowerCase().replace(/[^a-z0-9]/g, '_')}.html`;
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast(`Downloaded ${filename}!`, 'success');
    } catch (err: any) {
      showToast('Failed to export tool file', 'error');
    }
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition border border-slate-700"
      title="Download standalone HTML file"
    >
      <Download className="w-3.5 h-3.5" />
      <span>Export HTML</span>
    </button>
  );
};
