import React from 'react';
import { Monitor, Tablet, Smartphone } from 'lucide-react';

export type DeviceMode = 'desktop' | 'tablet' | 'mobile';

interface DevicePreviewFrameProps {
  mode: DeviceMode;
  onModeChange: (mode: DeviceMode) => void;
  children: React.ReactNode;
}

export const DevicePreviewFrame: React.FC<DevicePreviewFrameProps> = ({ mode, onModeChange, children }) => {
  return (
    <div className="flex flex-col h-full w-full">
      {/* Device Mode Switcher Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-1.5 font-medium">
          <span>Viewport:</span>
          <span className="text-slate-200 capitalize font-semibold">{mode}</span>
          <span className="text-[10px] text-slate-500">
            {mode === 'desktop' && '(100% Full Width)'}
            {mode === 'tablet' && '(768px × 1024px)'}
            {mode === 'mobile' && '(375px × 667px)'}
          </span>
        </div>

        <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800">
          <button
            onClick={() => onModeChange('desktop')}
            title="Desktop View (100%)"
            className={`p-1.5 rounded-md transition ${
              mode === 'desktop' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onModeChange('tablet')}
            title="Tablet View (768px)"
            className={`p-1.5 rounded-md transition ${
              mode === 'tablet' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onModeChange('mobile')}
            title="Mobile View (375px)"
            className={`p-1.5 rounded-md transition ${
              mode === 'mobile' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex-1 overflow-auto bg-slate-950/60 p-2 sm:p-4 flex items-center justify-center">
        <div
          className={`h-full transition-all duration-300 rounded-xl overflow-hidden shadow-2xl ${
            mode === 'desktop'
              ? 'w-full'
              : mode === 'tablet'
              ? 'w-[768px] max-w-full border-4 border-slate-800'
              : 'w-[375px] max-w-full border-8 border-slate-800 rounded-3xl'
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
