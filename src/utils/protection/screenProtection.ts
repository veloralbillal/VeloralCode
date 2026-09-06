/**
 * Fixed screen and zoom prevention utilities.
 * Prevents mobile pinch-to-zoom, double-tap zoom, and desktop zoom shortcuts.
 */

export function initScreenProtection(): () => void {
  // 1. Enforce strict viewport constraints
  let meta = document.querySelector('meta[name="viewport"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'viewport');
    document.head.appendChild(meta);
  }
  meta.setAttribute(
    'content',
    'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover'
  );

  // 2. Prevent pinch-to-zoom on touchscreens
  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  };

  // 3. Prevent double-tap zoom on iOS Safari & mobile browsers
  let lastTouchEnd = 0;
  const handleTouchEnd = (e: TouchEvent) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      // If tapped element is not a form input/button, block double-tap zoom
      const target = e.target as HTMLElement;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA');
      if (!isInput) {
        e.preventDefault();
      }
    }
    lastTouchEnd = now;
  };

  // 4. Prevent Ctrl + MouseWheel desktop zoom
  const handleWheel = (e: WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
    }
  };

  // 5. Prevent browser zoom keyboard shortcuts (Ctrl +, Ctrl -, Ctrl 0)
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === '+' || e.key === '-' || e.key === '=' || e.key === '_' || e.key === '0') {
        e.preventDefault();
      }
    }
  };

  // 6. iOS gesture prevention
  const preventGesture = (e: Event) => e.preventDefault();

  document.addEventListener('touchmove', handleTouchMove, { passive: false });
  document.addEventListener('touchend', handleTouchEnd, { passive: false });
  window.addEventListener('wheel', handleWheel, { passive: false });
  window.addEventListener('keydown', handleKeyDown);
  document.addEventListener('gesturestart', preventGesture);
  document.addEventListener('gesturechange', preventGesture);
  document.addEventListener('gestureend', preventGesture);

  return () => {
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
    window.removeEventListener('wheel', handleWheel);
    window.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('gesturestart', preventGesture);
    document.removeEventListener('gesturechange', preventGesture);
    document.removeEventListener('gestureend', preventGesture);
  };
}
