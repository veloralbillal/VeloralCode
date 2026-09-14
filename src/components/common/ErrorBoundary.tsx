import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error captured by ErrorBoundary:", error, errorInfo);

    // Auto-recover from dynamic module import failures (e.g., during deploys or network hiccups)
    const isChunkFailure =
      error?.message?.includes('Failed to fetch dynamically imported module') ||
      error?.message?.includes('Loading chunk') ||
      error?.message?.includes('dynamically imported');

    if (isChunkFailure && typeof window !== 'undefined') {
      try {
        const reloadKey = 'chunk_reload_last_ts';
        const last = sessionStorage.getItem(reloadKey);
        const now = Date.now();
        if (!last || now - Number(last) > 8000) {
          sessionStorage.setItem(reloadKey, String(now));
          window.location.reload();
        }
      } catch {
        // storage disabled fallback
      }
    }
  }

  public handleReload = () => {
    try {
      if (typeof window !== 'undefined' && 'caches' in window) {
        caches.keys().then((names) => {
          names.forEach((name) => caches.delete(name));
        });
      }
    } catch {
      // safe fallback
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      const isChunkFailure =
        this.state.error?.message?.includes('Failed to fetch dynamically imported module') ||
        this.state.error?.message?.includes('dynamically imported');

      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold">
              !
            </div>
            <h1 className="text-xl font-bold text-white">
              {isChunkFailure ? 'Application Updating' : 'Something went wrong'}
            </h1>
            <p className="text-sm text-slate-400">
              {isChunkFailure
                ? 'A new version or module was updated. Click below to refresh and load the latest application assets.'
                : this.state.error?.message || 'An unexpected error occurred while loading the application.'}
            </p>
            <button
              onClick={this.handleReload}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
            >
              {isChunkFailure ? 'Refresh & Load Latest' : 'Reload Application'}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
