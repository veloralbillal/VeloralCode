import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';
import rawConfig from '../../firebase-applet-config.json';

export const firebaseConfig = {
  apiKey: rawConfig.apiKey,
  authDomain: rawConfig.authDomain,
  databaseURL: `https://${rawConfig.projectId}-default-rtdb.firebaseio.com`,
  projectId: rawConfig.projectId,
  storageBucket: rawConfig.storageBucket,
  messagingSenderId: rawConfig.messagingSenderId,
  appId: rawConfig.appId,
  measurementId: rawConfig.measurementId || ""
};

// Initialize Firebase safely
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const firestoreDb = rawConfig.firestoreDatabaseId
  ? getFirestore(app, rawConfig.firestoreDatabaseId)
  : getFirestore(app);

// Initialize analytics only if an explicit valid measurementId exists in config
export let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== 'undefined' && rawConfig.measurementId && rawConfig.measurementId.trim().length > 0) {
  try {
    isSupported()
      .then((supported) => {
        if (supported && rawConfig.measurementId && rawConfig.measurementId.trim().length > 0) {
          try {
            analytics = getAnalytics(app);
          } catch {
            // Analytics blocked by privacy settings (e.g. Brave shields)
          }
        }
      })
      .catch(() => {
        // Analytics initialization failed or not supported in environment
      });
  } catch {
    // Safe fallback
  }
}

