import { EventItem } from '../../types/event';

export const formatActionLabel = (label?: string): string => {
  if (!label || !label.trim()) return 'Buy';
  const lower = label.toLowerCase();
  if (lower.includes('enroll') || lower.includes('down price') || lower.includes('down payment')) {
    return 'Buy';
  }
  return label;
};

export const calculateSavings = (price: number, downPrice: number): number => {
  if (!downPrice || price <= downPrice) return 0;
  return Math.round(((price - downPrice) / price) * 100);
};
