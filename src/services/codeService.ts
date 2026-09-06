import {
  ref,
  push,
  set,
  get,
  remove,
  update,
  runTransaction,
} from 'firebase/database';
import { database } from './firebase';
import { CodeItem, DashboardStats } from '../types';
import { connectionPool } from './connectionPool';

const VIEWED_SESSION_KEY = 'codetoolkit_viewed_';

export function subscribeToPublishedCodes(
  callback: (codes: CodeItem[]) => void,
  onError?: (error: Error) => void
): () => void {
  return connectionPool.subscribe(
    'codes',
    (val) => {
      if (!val) {
        callback([]);
        return;
      }
      const items: CodeItem[] = Object.keys(val)
        .map((key) => ({
          id: key,
          ...val[key],
        }))
        .filter((item) => item.status === 'published')
        .sort((a, b) => (b.updatedAt || b.createdAt || 0) - (a.updatedAt || a.createdAt || 0));

      callback(items);
    },
    onError
  );
}

export function subscribeToAllCodes(
  callback: (codes: CodeItem[]) => void,
  onError?: (error: Error) => void
): () => void {
  return connectionPool.subscribe(
    'codes',
    (val) => {
      if (!val) {
        callback([]);
        return;
      }
      const items: CodeItem[] = Object.keys(val)
        .map((key) => ({
          id: key,
          ...val[key],
        }))
        .sort((a, b) => (b.updatedAt || b.createdAt || 0) - (a.updatedAt || a.createdAt || 0));

      callback(items);
    },
    onError
  );
}

export async function getCodeItemById(id: string): Promise<CodeItem | null> {
  const codeRef = ref(database, `codes/${id}`);
  const snapshot = await get(codeRef);
  if (!snapshot.exists()) return null;
  return {
    id,
    ...snapshot.val(),
  };
}

export async function createNewCode(
  item: Omit<CodeItem, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'createdBy' | 'creatorEmail'>,
  userId: string,
  userEmail: string
): Promise<string> {
  const codesRef = ref(database, 'codes');
  const newCodeRef = push(codesRef);
  const now = Date.now();

  const codeData: Omit<CodeItem, 'id'> = {
    ...item,
    createdAt: now,
    updatedAt: now,
    createdBy: userId,
    creatorEmail: userEmail,
    views: 0,
  };

  await set(newCodeRef, codeData);
  return newCodeRef.key as string;
}

export async function updateExistingCode(
  id: string,
  updates: Partial<CodeItem>
): Promise<void> {
  const codeRef = ref(database, `codes/${id}`);
  const now = Date.now();
  await update(codeRef, {
    ...updates,
    updatedAt: now,
  });
}

export async function deleteExistingCode(id: string): Promise<void> {
  const codeRef = ref(database, `codes/${id}`);
  await remove(codeRef);
}

export async function incrementCodeViewCount(id: string): Promise<void> {
  // Prevent flooding views within the same session
  try {
    const sessionKey = `${VIEWED_SESSION_KEY}${id}`;
    if (sessionStorage.getItem(sessionKey)) {
      return;
    }
    sessionStorage.setItem(sessionKey, '1');

    // Throttled high-concurrency write through connection pool to absorb spikes
    await connectionPool.enqueueWrite(`view_${id}`, async () => {
      const viewsRef = ref(database, `codes/${id}/views`);
      await runTransaction(viewsRef, (currentViews) => {
        return (currentViews || 0) + 1;
      });
    });
  } catch (err) {
    // If permission or network prevents transaction, silently ignore view count update
    console.warn('View count increment error:', err);
  }
}

export function subscribeToDashboardStats(
  callback: (stats: DashboardStats) => void
): () => void {
  let currentCodes: CodeItem[] = [];
  let userCount = 0;

  const updateStats = () => {
    const totalCodes = currentCodes.length;
    const publishedCodes = currentCodes.filter((c) => c.status === 'published').length;
    const draftCodes = currentCodes.filter((c) => c.status === 'draft').length;
    const totalViews = currentCodes.reduce((sum, c) => sum + (c.views || 0), 0);

    callback({
      totalUsers: userCount,
      totalCodes,
      publishedCodes,
      draftCodes,
      totalViews,
    });
  };

  const unsubCodes = connectionPool.subscribe('codes', (val) => {
    if (val) {
      currentCodes = Object.keys(val).map((k) => val[k]);
    } else {
      currentCodes = [];
    }
    updateStats();
  });

  const unsubUsers = connectionPool.subscribe('users', (val) => {
    if (val) {
      userCount = Object.keys(val).length;
    } else {
      userCount = 0;
    }
    updateStats();
  });

  return () => {
    unsubCodes();
    unsubUsers();
  };
}

export async function fetchAllCodes(): Promise<CodeItem[]> {
  const codesRef = ref(database, 'codes');
  const snapshot = await get(codesRef);
  if (!snapshot.exists()) return [];
  const val = snapshot.val();
  return Object.keys(val).map((k) => ({
    id: k,
    ...val[k],
  }));
}

