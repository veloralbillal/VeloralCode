import { initScreenProtection } from './screenProtection';
import { initContentProtection } from './contentProtection';

/**
 * Initializes full application security, screen zoom locking,
 * and content protection rules.
 */
export function initAllProtections(): () => void {
  const cleanupScreen = initScreenProtection();
  const cleanupContent = initContentProtection();

  return () => {
    cleanupScreen();
    cleanupContent();
  };
}

export * from './screenProtection';
export * from './contentProtection';
