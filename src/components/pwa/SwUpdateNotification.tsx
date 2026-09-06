import React, { useEffect, useState } from 'react';
import { RefreshCw, X, Sparkles } from 'lucide-react';
import { triggerSwUpdate } from '../../utils/pwa/swManager';

export const SwUpdateNotification: React.FC = () => {
  const [needRefresh, setNeedRefresh] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    const handleControllerChange = () => {
      // Worker updated and claimed clients
    };

    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);

    // Listen for custom sw-update event or waiting workers
    navigator.serviceWorker.getRegistration().then((reg) => {
      if (reg) {
        if (reg.waiting) {
          setNeedRefresh(true);
        }
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setNeedRefresh(true);
              }
            });
          }
        });
      }
    });

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
    };
  }, []);

  const handleUpdate = async () => {
    await triggerSwUpdate();
    window.location.reload();
  };

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xl border border-slate-700 dark:border-slate-200 animate-in slide-in-from-bottom-5 duration-200 max-w-sm">
      <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 dark:text-indigo-600 flex items-center justify-center shrink-0">
        <Sparkles className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0 text-xs">
        <p className="font-bold leading-tight">App Update Available</p>
        <p className="opacity-80 text-[11px] truncate">New features are ready to install</p>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={handleUpdate}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all active:scale-95"
        >
          <RefreshCw className="w-3 h-3 animate-spin" />
          <span>Update</span>
        </button>
        <button
          onClick={() => setNeedRefresh(false)}
          className="p-1.5 rounded-lg opacity-60 hover:opacity-100 transition-opacity"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
