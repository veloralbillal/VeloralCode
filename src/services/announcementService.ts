import { ref, get, set, push, remove } from 'firebase/database';
import { database } from './firebase';
import { AdminAnnouncement } from '../types';

/**
 * Fetch all active site announcements
 */
export async function fetchAnnouncements(): Promise<AdminAnnouncement[]> {
  try {
    const annRef = ref(database, 'announcements');
    const snap = await get(annRef);
    if (!snap.exists()) return [];

    const val = snap.val();
    return Object.keys(val)
      .map((k) => ({ id: k, ...val[k] }))
      .sort((a, b) => b.createdAt - a.createdAt);
  } catch (err) {
    console.error('Error fetching announcements:', err);
    return [];
  }
}

/**
 * Create a new announcement (Admin)
 */
export async function createAnnouncement(data: Omit<AdminAnnouncement, 'id' | 'createdAt'>): Promise<AdminAnnouncement> {
  const annRef = ref(database, 'announcements');
  const newRef = push(annRef);

  const announcement: AdminAnnouncement = {
    id: newRef.key || Date.now().toString(),
    ...data,
    createdAt: Date.now(),
  };

  await set(newRef, announcement);
  return announcement;
}

/**
 * Delete an announcement (Admin)
 */
export async function deleteAnnouncement(id: string): Promise<void> {
  const itemRef = ref(database, `announcements/${id}`);
  await remove(itemRef);
}
