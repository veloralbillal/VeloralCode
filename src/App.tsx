import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { SiteConfigProvider } from './context/SiteConfigContext';
import { AppRouter } from './router/AppRouter';

export default function App() {
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
