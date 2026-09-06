export type EventStatus = 'active' | 'upcoming' | 'ended';
export type PopupType = 'warning' | 'alert' | 'info' | 'success';
export type TargetRole = 'all' | 'user' | 'creator' | 'seller';

export interface EventItem {
  id: string;
  title: string;
  description: string;
  price?: number | null;
  downPrice?: number | null;
  imageUrl?: string;
  currency?: string; // default: '৳' or 'BDT'
  eventDate?: string;
  eventLocation?: string;
  actionUrl?: string;
  actionLabel?: string;
  status: EventStatus;
  isPopup?: boolean;
  popupBadge?: string;
  popupType?: PopupType;
  targetRoles?: TargetRole[];
  createdAt: number;
  updatedAt?: number;
  createdBy?: string;
}
