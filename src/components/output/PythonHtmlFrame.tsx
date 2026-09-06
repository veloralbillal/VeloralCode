import React, { useMemo } from 'react';
import { generatePythonHtmlPreview } from '../../utils/pythonPreviewHelper';

interface PythonHtmlFrameProps {
  code: string;
  title: string;
  reloadKey: number;
  deviceMode: 'desktop' | 'tablet' | 'mobile';
}

export const PythonHtmlFrame: React.FC<PythonHtmlFrameProps> = ({
  code,
  title,
  reloadKey,
  deviceMode,
}) => {
  const srcDoc = useMemo(() => {
    return generatePythonHtmlPreview(code, title);
  }, [code, title]);

  const getContainerWidth = () => {
    if (deviceMode === 'mobile') return 'max-w-[420px] shadow-2xl border-x border-slate-800 my-auto rounded-3xl h-[92%] overflow-hidden';
    if (deviceMode === 'tablet') return 'max-w-3xl shadow-2xl border-x border-slate-800 my-auto rounded-3xl h-[94%] overflow-hidden';
    return 'w-full h-full';
  };

  return (
    <div className="w-full h-full bg-slate-950 flex items-center justify-center overflow-hidden">
      <div className={`${getContainerWidth()} w-full bg-slate-900 transition-all duration-300 relative`}>
        <iframe
          key={`${reloadKey}-python-web`}
          srcDoc={srcDoc}
          title={`${title} - Python HTML Preview`}
          sandbox="allow-scripts allow-modals allow-forms allow-popups allow-same-origin"
          className="w-full h-full border-0 bg-slate-900"
        />
      </div>
    </div>
  );
};
