import { PopupType } from '../../../types/event';

export interface PopupThemeConfig {
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  lightBg: string;
  defaultBadge: string;
}

export const POPUP_THEMES: Record<PopupType, PopupThemeConfig> = {
  warning: {
    accentColor: 'text-amber-500',
    badgeBg: 'bg-amber-500/90 shadow-amber-500/30',
    badgeText: 'text-white',
    borderColor: 'border-amber-500/30 dark:border-amber-500/20',
    lightBg: 'bg-amber-50/70 dark:bg-amber-950/30',
    defaultBadge: '⚠️ Warning Notice',
  },
  alert: {
    accentColor: 'text-rose-500',
    badgeBg: 'bg-rose-600/90 shadow-rose-600/30',
    badgeText: 'text-white',
    borderColor: 'border-rose-500/30 dark:border-rose-500/20',
    lightBg: 'bg-rose-50/70 dark:bg-rose-950/30',
    defaultBadge: '🚨 Urgent Alert',
  },
  info: {
    accentColor: 'text-sky-500',
    badgeBg: 'bg-sky-600/90 shadow-sky-600/30',
    badgeText: 'text-white',
    borderColor: 'border-sky-500/30 dark:border-sky-500/20',
    lightBg: 'bg-sky-50/70 dark:bg-sky-950/30',
    defaultBadge: '📢 Important Update',
  },
  success: {
    accentColor: 'text-emerald-500',
    badgeBg: 'bg-emerald-600/90 shadow-emerald-600/30',
    badgeText: 'text-white',
    borderColor: 'border-emerald-500/30 dark:border-emerald-500/20',
    lightBg: 'bg-emerald-50/70 dark:bg-emerald-950/30',
    defaultBadge: '🎉 Special Event',
  },
};
