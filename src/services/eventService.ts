import { ref, get, set, push, update, remove, Unsubscribe } from 'firebase/database';
import { database } from './firebase';
import { EventItem, PopupType, TargetRole } from '../types/event';
import { connectionPool } from './connectionPool';
import { sanitizeEventPayload } from './events/eventSanitizer';

const EVENTS_REF = 'events';

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'starter-event-1',
    title: 'Full-Stack Web Development Masterclass',
    description: 'Master React 19, TypeScript, and modern backend integration. Live project sessions with certificate of completion, real-world portfolio tool deployment, and priority code review.',
    price: 3500,
    downPrice: 1200,
    currency: '৳',
    imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
    eventDate: 'September 15, 2026 - 8:00 PM',
    eventLocation: 'Online Live (Google Meet & Discord)',
    actionUrl: 'https://t.me/BillalHossen',
    actionLabel: 'Buy',
    status: 'active',
    isPopup: true,
    popupBadge: '🔥 Special Masterclass',
    createdAt: Date.now() - 172800000,
  },
  {
    id: 'starter-event-2',
    title: 'Code Creators Bootcamp & Tool Monetization',
    description: 'Learn how to construct viral interactive web tools, optimize code performance, submit components to CodeToolkit, and generate recurring passive income via royalties.',
    price: 2500,
    downPrice: 800,
    currency: '৳',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    eventDate: 'September 22, 2026 - 9:00 PM',
    eventLocation: 'Private Creator Discord Room',
    actionUrl: 'https://t.me/BillalHossen',
    actionLabel: 'Buy',
    status: 'upcoming',
    createdAt: Date.now() - 86400000,
  },
  {
    id: 'starter-event-3',
    title: 'Algorithmic Problem Solving & System Design Sprint',
    description: 'Hands-on live problem solving, data structures optimization, time-complexity refactoring, and software architectural design patterns for professional developers.',
    price: 4500,
    downPrice: 1500,
    currency: '৳',
    imageUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80',
    eventDate: 'October 05, 2026 - 7:30 PM',
    eventLocation: 'Interactive Virtual Lab',
    actionUrl: 'https://t.me/BillalHossen',
    actionLabel: 'Buy',
    status: 'upcoming',
    createdAt: Date.now() - 3600000,
  },
];

/**
 * Normalizes raw event objects to prevent undefined or malformed fields from crashing the app
 */
export function normalizeEvent(id: string, raw: any): EventItem {
  const price = typeof raw?.price === 'number' ? raw.price : (raw?.price !== undefined && raw?.price !== '' ? Number(raw.price) : undefined);
  const downPrice = typeof raw?.downPrice === 'number' ? raw.downPrice : (raw?.downPrice !== undefined && raw?.downPrice !== '' ? Number(raw.downPrice) : undefined);

  let targetRoles: TargetRole[] = ['all'];
  if (Array.isArray(raw?.targetRoles) && raw.targetRoles.length > 0) {
    targetRoles = raw.targetRoles;
  } else if (typeof raw?.targetRole === 'string') {
    targetRoles = [raw.targetRole as TargetRole];
  }

  return {
    id,
    title: raw?.title || 'Notice / Event',
    description: raw?.description || '',
    price,
    downPrice,
    currency: raw?.currency || '৳',
    imageUrl: raw?.imageUrl || '',
    eventDate: raw?.eventDate || '',
    eventLocation: raw?.eventLocation || '',
    actionUrl: raw?.actionUrl || '',
    actionLabel: raw?.actionLabel || '',
    status: raw?.status === 'upcoming' || raw?.status === 'ended' ? raw.status : 'active',
    isPopup: Boolean(raw?.isPopup),
    popupBadge: raw?.popupBadge || '⚠️ Important Notice',
    popupType: (raw?.popupType as PopupType) || 'warning',
    targetRoles,
    createdAt: Number(raw?.createdAt) || Date.now(),
    updatedAt: Number(raw?.updatedAt) || Date.now(),
  };
}

/**
 * Fetch all events from RTDB (Tier-1 memory cached to protect against 10,000+ users spikes)
 */
export async function fetchEvents(): Promise<EventItem[]> {
  try {
    const cached = connectionPool.getCached<EventItem[]>('events_list');
    if (cached) return cached;

    const eventsRef = ref(database, EVENTS_REF);
    const snap = await get(eventsRef);
    if (!snap.exists()) {
      return INITIAL_EVENTS;
    }
    const val = snap.val();
    const list = Object.keys(val)
      .map((k) => normalizeEvent(k, val[k]))
      .sort((a, b) => b.createdAt - a.createdAt);
    
    connectionPool.setCache('events_list', list, 10000);
    return list;
  } catch (err) {
    console.error('Error fetching events:', err);
    return INITIAL_EVENTS;
  }
}

/**
 * Subscribe to all events using Connection Pooling.
 * Multiplexes single socket listener across all active components.
 */
export function subscribeToAllEvents(
  onUpdate: (events: EventItem[]) => void,
  onError?: (err: any) => void
): Unsubscribe {
  return connectionPool.subscribe(
    EVENTS_REF,
    (val) => {
      if (val) {
        const list: EventItem[] = Object.keys(val)
          .map((k) => normalizeEvent(k, val[k]))
          .sort((a, b) => b.createdAt - a.createdAt);
        connectionPool.setCache('events_list', list, 15000);
        onUpdate(list);
      } else {
        onUpdate(INITIAL_EVENTS);
      }
    },
    (err) => {
      console.error('Error in events subscription:', err);
      if (onError) onError(err);
      onUpdate(INITIAL_EVENTS);
    }
  );
}

/**
 * Subscribe to active/upcoming events for public users
 */
export function subscribeToActiveEvents(
  onUpdate: (events: EventItem[]) => void,
  onError?: (err: any) => void
): Unsubscribe {
  return subscribeToAllEvents(
    (all) => {
      const active = all.filter((e) => e.status !== 'ended');
      onUpdate(active.length > 0 ? active : INITIAL_EVENTS);
    },
    onError
  );
}

/**
 * Create a new event (Admin)
 */
export async function createEvent(data: Omit<EventItem, 'id' | 'createdAt'>): Promise<EventItem> {
  const eventsRef = ref(database, EVENTS_REF);
  const newRef = push(eventsRef);

  const eventId = newRef.key || Date.now().toString();
  const now = Date.now();

  const cleanPayload = sanitizeEventPayload(data, false);
  const fullPayload = {
    ...cleanPayload,
    id: eventId,
    createdAt: now,
    updatedAt: now,
  };

  await set(newRef, fullPayload);
  return normalizeEvent(eventId, fullPayload);
}

/**
 * Update an existing event (Admin)
 */
export async function updateEvent(id: string, data: Partial<EventItem>): Promise<void> {
  const eventRef = ref(database, `${EVENTS_REF}/${id}`);
  const cleanPayload = sanitizeEventPayload(data, true);

  await update(eventRef, {
    ...cleanPayload,
    updatedAt: Date.now(),
  });
}

/**
 * Set an event as active popup (Admin)
 * Can deactivate other popups to ensure only 1 primary popup displays to users
 */
export async function setEventAsPopup(id: string, isPopup: boolean): Promise<void> {
  const eventsRef = ref(database, EVENTS_REF);
  const snap = await get(eventsRef);
  if (snap.exists()) {
    const val = snap.val();
    const updates: Record<string, any> = {};

    // If activating this popup, deactivate others so only one primary popup shows
    if (isPopup) {
      Object.keys(val).forEach((k) => {
        if (val[k].isPopup && k !== id) {
          updates[`${k}/isPopup`] = false;
        }
      });
    }

    updates[`${id}/isPopup`] = isPopup;
    updates[`${id}/updatedAt`] = Date.now();
    await update(eventsRef, updates);
  } else {
    const singleRef = ref(database, `${EVENTS_REF}/${id}`);
    await update(singleRef, { isPopup, updatedAt: Date.now() });
  }
}

/**
 * Delete an event (Admin)
 */
export async function deleteEvent(id: string): Promise<void> {
  const eventRef = ref(database, `${EVENTS_REF}/${id}`);
  await remove(eventRef);
}
