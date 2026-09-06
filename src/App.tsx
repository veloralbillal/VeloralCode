import React, { useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { SiteConfigProvider } from './context/SiteConfigContext';
import { AppRouter } from './router/AppRouter';
import { initAllProtections } from './utils/protection';

export default function App() {
  useEffect(() => {
    const cleanup = initAllProtections();
    return () => {
      cleanup();
    };
  }, []);

  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <SiteConfigProvider>
            <AppRouter />
          </SiteConfigProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
