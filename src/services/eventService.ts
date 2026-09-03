import { ref, get, set, push, update, remove, onValue, Unsubscribe } from 'firebase/database';
import { database } from './firebase';
import { EventItem } from '../types/event';

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
 * Fetch all events from RTDB
 */
export async function fetchEvents(): Promise<EventItem[]> {
  try {
    const eventsRef = ref(database, EVENTS_REF);
    const snap = await get(eventsRef);
    if (!snap.exists()) {
      return INITIAL_EVENTS;
    }
    const val = snap.val();
    return Object.keys(val)
      .map((k) => ({ id: k, ...val[k] }))
      .sort((a, b) => b.createdAt - a.createdAt);
  } catch (err) {
    console.error('Error fetching events:', err);
    return INITIAL_EVENTS;
  }
}

/**
 * Subscribe to all events for admin management
 */
export function subscribeToAllEvents(
  onUpdate: (events: EventItem[]) => void,
  onError?: (err: any) => void
): Unsubscribe {
  const eventsRef = ref(database, EVENTS_REF);
  return onValue(
    eventsRef,
    (snap) => {
      if (snap.exists()) {
        const val = snap.val();
        const list: EventItem[] = Object.keys(val)
          .map((k) => ({ id: k, ...val[k] }))
          .sort((a, b) => b.createdAt - a.createdAt);
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

  const event: EventItem = {
    id: newRef.key || Date.now().toString(),
    ...data,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  await set(newRef, event);
  return event;
}

/**
 * Update an existing event (Admin)
 */
export async function updateEvent(id: string, data: Partial<EventItem>): Promise<void> {
  const eventRef = ref(database, `${EVENTS_REF}/${id}`);
  await update(eventRef, {
    ...data,
    updatedAt: Date.now(),
  });
}

/**
 * Delete an event (Admin)
 */
export async function deleteEvent(id: string): Promise<void> {
  const eventRef = ref(database, `${EVENTS_REF}/${id}`);
  await remove(eventRef);
}
