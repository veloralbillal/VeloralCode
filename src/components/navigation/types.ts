import { LucideIcon } from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  badgeColor?: string;
  description?: string;
  isExternal?: boolean;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}
