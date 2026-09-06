import React, { useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { SiteConfigProvider } from './context/SiteConfigContext';
import { AppRouter } from './router/AppRouter';
import { initAllProtections } from './utils/protection';
import { subscribePwaConfig } from './utils/pwa';

export default function App() {
  useEffect(() => {
    let cleanupProtections = () => {};
    let cleanupPwa = () => {};
    try {
      cleanupProtections = initAllProtections();
    } catch (err) {
      console.warn('Protections init bypassed:', err);
    }
    try {
      cleanupPwa = subscribePwaConfig(() => {});
    } catch (err) {
      console.warn('Pwa config bypassed:', err);
    }
    return () => {
      cleanupProtections();
      cleanupPwa();
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
