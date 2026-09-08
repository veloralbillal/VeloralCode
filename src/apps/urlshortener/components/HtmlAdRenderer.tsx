import React, { useEffect, useRef } from 'react';

interface HtmlAdRendererProps {
  html: string;
  className?: string;
}

export const HtmlAdRenderer: React.FC<HtmlAdRendererProps> = ({ html, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !html) return;
    const container = containerRef.current;
    container.innerHTML = '';

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const scripts = tempDiv.getElementsByTagName('script');
    const scriptCloneArray: HTMLScriptElement[] = [];

    for (let i = 0; i < scripts.length; i++) {
      const script = scripts[i];
      const scriptClone = document.createElement('script');
      if (script.src) {
        scriptClone.src = script.src;
        scriptClone.async = true;
      } else {
        scriptClone.textContent = script.textContent;
      }
      scriptCloneArray.push(scriptClone);
    }

    Array.from(tempDiv.getElementsByTagName('script')).forEach(s => s.remove());
    while (tempDiv.firstChild) {
      container.appendChild(tempDiv.firstChild);
    }

    scriptCloneArray.forEach(script => {
      container.appendChild(script);
    });
  }, [html]);

  return <div ref={containerRef} className={className} />;
};
