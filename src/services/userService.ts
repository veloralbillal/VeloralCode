import { ref, get, set, push, query, orderByChild, equalTo } from 'firebase/database';
import { database } from './firebase';
import {
  UserBookmarkItem,
  UserRecentActivityItem,
  UserLicenseHistoryItem,
  AdminAnnouncement,
  FeatureRequest,
  UserSessionInfo,
} from '../types';

// ==================== 1. BOOKMARKS SERVICE ====================
export async function getUserBookmarks(userId: string): Promise<UserBookmarkItem[]> {
  try {
    const bookmarkRef = ref(database, `user_bookmarks/${userId}`);
    const snapshot = await get(bookmarkRef);
    if (!snapshot.exists()) return [];
    const data = snapshot.val();
    return Object.keys(data).map((k) => ({
      codeId: k,
      ...data[k],
    })).sort((a, b) => b.bookmarkedAt - a.bookmarkedAt);
  } catch (err) {
    console.warn('Error fetching bookmarks:', err);
    return [];
  }
}

export async function toggleBookmark(
  userId: string,
  code: { id: string; title: string; category: string; language: string }
): Promise<boolean> {
  try {
    const bookmarkItemRef = ref(database, `user_bookmarks/${userId}/${code.id}`);
    const snapshot = await get(bookmarkItemRef);
    if (snapshot.exists()) {
      await set(bookmarkItemRef, null); // remove
      return false;
    } else {
      await set(bookmarkItemRef, {
        codeId: code.id,
        title: code.title,
        category: code.category,
        language: code.language,
        bookmarkedAt: Date.now(),
      });
      return true;
    }
  } catch (err) {
    console.error('Error toggling bookmark:', err);
    throw err;
  }
}

export async function checkIsBookmarked(userId: string, codeId: string): Promise<boolean> {
  try {
    const bookmarkItemRef = ref(database, `user_bookmarks/${userId}/${codeId}`);
    const snapshot = await get(bookmarkItemRef);
    return snapshot.exists();
  } catch {
    return false;
  }
}

// ==================== 2. RECENT ACTIVITY SERVICE ====================
const LOCAL_ACTIVITY_KEY = 'user_recent_activity_logs';

export function recordRecentActivity(item: Omit<UserRecentActivityItem, 'timestamp'>) {
  try {
    const existing = getRecentActivities();
    const filtered = existing.filter((x) => !(x.codeId === item.codeId && x.action === item.action));
    const updated: UserRecentActivityItem[] = [
      { ...item, timestamp: Date.now() },
      ...filtered,
    ].slice(0, 30); // keep up to 30 items
    localStorage.setItem(LOCAL_ACTIVITY_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Could not save recent activity:', err);
  }
}

export function getRecentActivities(): UserRecentActivityItem[] {
  try {
    const data = localStorage.getItem(LOCAL_ACTIVITY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function clearRecentActivities() {
  try {
    localStorage.removeItem(LOCAL_ACTIVITY_KEY);
  } catch {
    // ignore
  }
}

// ==================== 3. USER LICENSE REDEEM HISTORY ====================
export async function getUserLicenseHistory(userId: string): Promise<UserLicenseHistoryItem[]> {
  try {
    const licensesRef = ref(database, 'licenses');
    const snapshot = await get(licensesRef);
    if (!snapshot.exists()) return [];

    const data = snapshot.val();
    const history: UserLicenseHistoryItem[] = [];

    Object.keys(data).forEach((id) => {
      const item = data[id];
      if (item.usedBy === userId && item.status === 'used') {
        history.push({
          id,
          key: item.key,
          plan: item.plan,
          durationDays: item.durationDays !== undefined ? item.durationDays : 30,
          redeemedAt: item.usedAt || item.createdAt,
          expiresAt: item.expiresAt,
          isLifetime: item.durationDays === 0,
        });
      }
    });

    return history.sort((a, b) => b.redeemedAt - a.redeemedAt);
  } catch (err) {
    console.warn('Error fetching license history:', err);
    return [];
  }
}

// ==================== 4. ADMIN ANNOUNCEMENTS SERVICE ====================
export async function getAnnouncements(): Promise<AdminAnnouncement[]> {
  try {
    const annRef = ref(database, 'announcements');
    const snapshot = await get(annRef);
    if (!snapshot.exists()) {
      // Return default sample announcement if none exists in db
      return [
        {
          id: 'default-welcome',
          title: '🎉 Welcome to New Version & License Timer Engine',
          content: 'We have enabled real-time license key validity countdown, 8-digit unique user identifiers (UID), and instant source code preview!',
          type: 'update',
          isPinned: true,
          createdAt: Date.now() - 3600000 * 24,
          authorEmail: 'admin@platform.io',
        },
      ];
    }
    const data = snapshot.val();
    return Object.keys(data).map((id) => ({
      id,
      ...data[id],
    })).sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0) || b.createdAt - a.createdAt);
  } catch (err) {
    console.warn('Error fetching announcements:', err);
    return [];
  }
}

// ==================== 5. FEATURE REQUESTS SERVICE ====================
export async function submitFeatureRequest(params: {
  userId: string;
  userEmail: string;
  userNumericUid?: string;
  title: string;
  description: string;
  category: string;
}): Promise<string> {
  try {
    const reqRef = ref(database, 'feature_requests');
    const newRef = push(reqRef);
    await set(newRef, {
      ...params,
      status: 'pending',
      createdAt: Date.now(),
    });
    return newRef.key || '';
  } catch (err) {
    console.error('Error submitting feature request:', err);
    throw err;
  }
}

export async function getUserFeatureRequests(userId: string): Promise<FeatureRequest[]> {
  try {
    const reqRef = ref(database, 'feature_requests');
    const snapshot = await get(reqRef);
    if (!snapshot.exists()) return [];

    const data = snapshot.val();
    const list: FeatureRequest[] = [];
    Object.keys(data).forEach((id) => {
      const item = data[id];
      if (item.userId === userId) {
        list.push({ id, ...item });
      }
    });
    return list.sort((a, b) => b.createdAt - a.createdAt);
  } catch (err) {
    console.warn('Error fetching user feature requests:', err);
    return [];
  }
}

// ==================== 6. ACTIVE SESSIONS DETECTOR ====================
export function getCurrentSessionInfo(): UserSessionInfo {
  const ua = navigator.userAgent;
  let browser = 'Unknown Browser';
  let os = 'Unknown OS';
  let deviceType: 'desktop' | 'mobile' | 'tablet' = 'desktop';

  // Browser detection
  if (ua.includes('Firefox')) browser = 'Mozilla Firefox';
  else if (ua.includes('SamsungBrowser')) browser = 'Samsung Internet';
  else if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Google Chrome';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Apple Safari';
  else if (ua.includes('Edg')) browser = 'Microsoft Edge';
  else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera';

  // OS detection
  if (ua.includes('Win')) os = 'Windows OS';
  else if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) {
    os = 'Android';
    deviceType = 'mobile';
  } else if (ua.includes('iPhone') || ua.includes('iPad')) {
    os = 'iOS';
    deviceType = ua.includes('iPad') ? 'tablet' : 'mobile';
  }

  if (/Mobi|Android/i.test(ua) && deviceType === 'desktop') {
    deviceType = 'mobile';
  }

  return {
    id: 'current-active-session',
    browser,
    os,
    deviceType,
    lastActive: Date.now(),
    isCurrent: true,
  };
}
