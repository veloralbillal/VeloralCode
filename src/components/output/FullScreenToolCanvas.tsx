import React from 'react';
import { JsonOutputRunner } from './JsonOutputRunner';
import { PythonHtmlFrame } from './PythonHtmlFrame';
import { generateJavaScriptHtmlRunner } from '../../utils/javascriptRunnerHelper';
import { generateUniversalHtmlPreview } from '../../utils/universalHtmlPreviewHelper';

interface FullScreenToolCanvasProps {
  code: string;
  language: string;
  title: string;
  reloadKey: number;
  deviceMode: 'desktop' | 'tablet' | 'mobile';
}

/**
 * FullScreenToolCanvas: Directly renders the live tool preview
 * full-bleed without redundant engine headers or wrappers.
 */
export const FullScreenToolCanvas: React.FC<FullScreenToolCanvasProps> = ({
  code,
  language,
  title,
  reloadKey,
  deviceMode,
}) => {
  const isJavaScriptOrTs = language === 'JavaScript' || language === 'TypeScript';
  const isJson = language === 'JSON';
  const isPython = language === 'Python';

  const getContainerWidth = () => {
    if (deviceMode === 'mobile') return 'max-w-[420px] shadow-2xl border-x border-slate-800 my-auto rounded-3xl h-[92%] overflow-hidden';
    if (deviceMode === 'tablet') return 'max-w-3xl shadow-2xl border-x border-slate-800 my-auto rounded-3xl h-[94%] overflow-hidden';
    return 'w-full h-full';
  };

  // JSON viewer
  if (isJson) {
    return (
      <div className="w-full h-full p-4 overflow-auto bg-slate-950">
        <JsonOutputRunner code={code} />
      </div>
    );
  }

  // Python Script: Direct Python Live Environment
  if (isPython) {
    return (
      <div className="w-full h-full overflow-hidden bg-slate-950">
        <PythonHtmlFrame
          code={code}
          title={title}
          reloadKey={reloadKey}
          deviceMode={deviceMode}
        />
      </div>
    );
  }

  // Direct iframe preview for HTML, CSS, JS, TS, SQL, Bash, Markdown, etc.
  const srcDoc = isJavaScriptOrTs
    ? generateJavaScriptHtmlRunner(code, title)
    : generateUniversalHtmlPreview(code, language, title);

  const isPureHtml = language === 'HTML' && (code.includes('<html') || code.includes('<!DOCTYPE') || code.includes('<body'));
  const bgColor = isPureHtml ? 'bg-white' : 'bg-slate-950';

  return (
    <div className="w-full h-full bg-slate-950 flex items-center justify-center overflow-hidden">
      <div className={`${getContainerWidth()} w-full ${bgColor} transition-all duration-300 relative`}>
        <iframe
          key={reloadKey}
          srcDoc={srcDoc}
          title={title}
          sandbox="allow-scripts allow-modals allow-forms allow-popups allow-same-origin"
          className={`w-full h-full border-0 ${bgColor}`}
        />
      </div>
    </div>
  );
};
