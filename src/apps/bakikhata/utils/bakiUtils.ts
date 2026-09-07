/**
 * Utility functions for Bakir Khata
 */

export function formatTaka(amount: number): string {
  return `৳${Number(amount || 0).toLocaleString('en-IN')}`;
}

export function formatDateTime(timestamp: number): string {
  if (!timestamp) return '—';
  const d = new Date(timestamp);
  return d.toLocaleDateString('bn-BD', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatTimeOnly(timestamp: number): string {
  if (!timestamp) return '';
  const d = new Date(timestamp);
  return d.toLocaleTimeString('bn-BD', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateOnly(timestamp: number): string {
  if (!timestamp) return '';
  const d = new Date(timestamp);
  return d.toLocaleDateString('bn-BD', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Returns information about the next upcoming Tuesday (Tuesday)
 */
export function getNextTuesdayInfo(): { dateStr: string; daysLeft: number; isTodayTuesday: boolean } {
  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sun, 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri, 6 = Sat
  const isTodayTuesday = currentDay === 2;
  
  let daysUntilTuesday = (2 - currentDay + 7) % 7;
  if (daysUntilTuesday === 0 && !isTodayTuesday) {
    daysUntilTuesday = 7;
  }

  const nextTue = new Date(now);
  nextTue.setDate(now.getDate() + daysUntilTuesday);

  const dateStr = nextTue.toLocaleDateString('bn-BD', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return {
    dateStr,
    daysLeft: daysUntilTuesday,
    isTodayTuesday,
  };
}
