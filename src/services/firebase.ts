import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getAnalytics, isSupported } from 'firebase/analytics';

export const firebaseConfig = {
  apiKey: "AIzaSyD6X4-KjTb521bDzZjQFd-jbphNil7XAjo",
  authDomain: "veloralbillal.firebaseapp.com",
  databaseURL: "https://veloralbillal-default-rtdb.firebaseio.com",
  projectId: "veloralbillal",
  storageBucket: "veloralbillal.firebasestorage.app",
  messagingSenderId: "657968912821",
  appId: "1:657968912821:web:83d69a4ffb20536dcb61fc",
  measurementId: "G-XFDC6ZJC8B"
};

// Initialize Firebase safely
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);

// Initialize analytics if supported in browser environment
export let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Analytics initialization failed or not supported in environment
  });
}
