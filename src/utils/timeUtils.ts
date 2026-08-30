export interface RemainingTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isExpired: boolean;
  formatted: string;
}

export function calculateRemainingTime(targetTimestamp: number | null | undefined): RemainingTime {
  if (!targetTimestamp) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      isExpired: false,
      formatted: 'Lifetime',
    };
  }

  const now = Date.now();
  const diff = targetTimestamp - now;

  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      isExpired: true,
      formatted: 'Expired',
    };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  let formatted = '';
  if (days > 0) {
    formatted = `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    formatted = `${hours}h ${minutes}m ${seconds}s`;
  } else {
    formatted = `${minutes}m ${seconds}s`;
  }

  return {
    days,
    hours,
    minutes,
    seconds,
    totalSeconds,
    isExpired: false,
    formatted,
  };
}

export function getDurationLabel(days: number | undefined): string {
  if (days === undefined || days === 0) return 'Lifetime (Unlimited)';
  if (days === 1) return '24 Hours (1 Day)';
  if (days === 7) return '7 Days (1 Week)';
  if (days === 15) return '15 Days';
  if (days === 30) return '30 Days (1 Month)';
  if (days === 60) return '60 Days (2 Months)';
  if (days === 90) return '90 Days (3 Months)';
  if (days === 180) return '180 Days (6 Months)';
  if (days === 365) return '365 Days (1 Year)';
  return `${days} Days`;
}
