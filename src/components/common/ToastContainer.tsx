import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { ToastType } from '../../types';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-indigo-500 shrink-0" />;
    }
  };

  const getBorderColor = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'border-emerald-500/30 bg-emerald-50/95 dark:bg-slate-900/95 dark:border-emerald-500/40 text-emerald-950 dark:text-emerald-200';
      case 'error':
        return 'border-rose-500/30 bg-rose-50/95 dark:bg-slate-900/95 dark:border-rose-500/40 text-rose-950 dark:text-rose-200';
      case 'warning':
        return 'border-amber-500/30 bg-amber-50/95 dark:bg-slate-900/95 dark:border-amber-500/40 text-amber-950 dark:text-amber-200';
      default:
        return 'border-indigo-500/30 bg-indigo-50/95 dark:bg-slate-900/95 dark:border-indigo-500/40 text-indigo-950 dark:text-indigo-200';
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full px-3 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg backdrop-blur-md text-sm font-medium transition-all animate-in slide-in-from-bottom-5 duration-200 ${getBorderColor(
            toast.type
          )}`}
        >
          {getIcon(toast.type)}
          <p className="flex-1 leading-snug break-words">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-0.5 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
