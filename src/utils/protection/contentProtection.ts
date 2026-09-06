/**
 * Content protection utilities against unauthorized copying, dragging,
 * context menu opening, and inspection shortcuts.
 */

export function initContentProtection(): () => void {
  // 1. Prevent context menu on protected UI (allows form inputs & code viewers)
  const handleContextMenu = (e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;

    // Allow right click inside text inputs, textareas, and code containers
    const isAllowed =
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable ||
      target.closest('.allow-context-menu') ||
      target.closest('.code-viewer-content');

    if (!isAllowed) {
      e.preventDefault();
    }
  };

  // 2. Prevent image and link dragging
  const handleDragStart = (e: DragEvent) => {
    const target = e.target as HTMLElement | null;
    if (target && (target.tagName === 'IMG' || target.tagName === 'A')) {
      e.preventDefault();
    }
  };

  // 3. Block developer inspection and source saving shortcuts
  const handleKeyProtection = (e: KeyboardEvent) => {
    // F12 key
    if (e.key === 'F12') {
      e.preventDefault();
      return;
    }

    // Ctrl/Cmd + Shift + I, J, C (DevTools)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
      const key = e.key.toUpperCase();
      if (key === 'I' || key === 'J' || key === 'C') {
        e.preventDefault();
        return;
      }
    }

    // Ctrl/Cmd + U (View Source), Ctrl/Cmd + S (Save Page), Ctrl/Cmd + P (Print)
    if (e.ctrlKey || e.metaKey) {
      const key = e.key.toLowerCase();
      if (key === 'u' || key === 's' || key === 'p') {
        e.preventDefault();
      }
    }
  };

  document.addEventListener('contextmenu', handleContextMenu);
  document.addEventListener('dragstart', handleDragStart);
  window.addEventListener('keydown', handleKeyProtection);

  return () => {
    document.removeEventListener('contextmenu', handleContextMenu);
    document.removeEventListener('dragstart', handleDragStart);
    window.removeEventListener('keydown', handleKeyProtection);
  };
}
