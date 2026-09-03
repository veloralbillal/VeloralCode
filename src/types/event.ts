export type EventStatus = 'active' | 'upcoming' | 'ended';

export interface EventItem {
  id: string;
  title: string;
  description: string;
  price: number;
  downPrice: number;
  imageUrl: string;
  currency?: string; // default: '৳' or 'BDT'
  eventDate?: string;
  eventLocation?: string;
  actionUrl?: string;
  actionLabel?: string;
  status: EventStatus;
  createdAt: number;
  updatedAt?: number;
  createdBy?: string;
}
