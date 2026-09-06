import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import './index.css';

const rootEl = document.getElementById('root')!;
try {
  createRoot(rootEl).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
} catch (err: any) {
  console.error('Fatal initialization error:', err);
  rootEl.innerHTML = `
    <div style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; font-family: system-ui, -apple-system, sans-serif; background: #090d16; color: #f8fafc; text-align: center;">
      <div style="width: 48px; height: 48px; border-radius: 16px; background: rgba(239,68,68,0.15); color: #ef4444; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; margin-bottom: 16px;">!</div>
      <h2 style="font-size: 18px; font-weight: 700; margin-bottom: 8px;">Application Loading Issue</h2>
      <p style="font-size: 13px; color: #94a3b8; max-width: 340px; margin-bottom: 20px; line-height: 1.5;">${err?.message || 'Error mounting application'}</p>
      <button onclick="window.location.reload()" style="padding: 10px 24px; background: #6366f1; color: #fff; border: none; border-radius: 12px; font-weight: 600; font-size: 14px; cursor: pointer; box-shadow: 0 4px 14px rgba(99,102,241,0.4);">Reload Application</button>
    </div>
  `;
}

