import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
} from 'firebase/auth';
import { ref, set, get, update, serverTimestamp } from 'firebase/database';
import { auth, database } from './firebase';
import { UserProfile, AdminProfile, UserPlan, UserRole } from '../types';
import { generate8DigitUID } from '../utils/helpers';

export async function checkAdminStatus(uid: string): Promise<boolean> {
  try {
    const adminRef = ref(database, `admins/${uid}`);
    const snapshot = await get(adminRef);
    if (snapshot.exists()) {
      const data = snapshot.val() as AdminProfile;
      return data.role === 'admin' && data.status === 'active';
    }
    return false;
  } catch (error) {
    console.warn('Admin status check failed:', error);
    return false;
  }
}

export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userRef = ref(database, `users/${uid}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const val = snapshot.val();
      let numericUid = val.numericUid;

      // Automatically generate & persist 8-digit numeric UID if not present
      if (!numericUid || typeof numericUid !== 'string' || numericUid.length !== 8) {
        numericUid = generate8DigitUID();
        try {
          await update(userRef, { numericUid });
        } catch {
          // ignore background update error
        }
      }

      return {
        ...val,
        userId: uid,
        numericUid: numericUid,
        plan: val.plan || (val.role === 'admin' ? 'premium' : 'free'),
      } as UserProfile;
    }
    return null;
  } catch (error) {
    console.warn('Error fetching user profile:', error);
    return null;
  }
}

export async function registerNewUser(
  email: string,
  pass: string,
  name: string
): Promise<{ user: User; isAdmin: boolean }> {
  const credential = await createUserWithEmailAndPassword(auth, email, pass);
  const user = credential.user;

  if (name.trim()) {
    await updateProfile(user, { displayName: name.trim() });
  }

  const isAdmin = await checkAdminStatus(user.uid);
  const role: UserRole = isAdmin ? 'admin' : 'user';
  const plan: UserPlan = isAdmin ? 'premium' : 'free';
  const numericUid = generate8DigitUID();

  const userProfile: UserProfile = {
    userId: user.uid,
    numericUid: numericUid,
    name: name.trim() || email.split('@')[0],
    email: user.email || email,
    role: role,
    plan: plan,
    createdAt: Date.now(),
    status: 'active',
  };

  try {
    await set(ref(database, `users/${user.uid}`), userProfile);
  } catch (err) {
    console.warn('Note: Writing user profile to RTDB failed or rules prevented:', err);
  }

  return { user, isAdmin };
}

export async function updateUserProfileData(
  uid: string,
  data: { name?: string; bio?: string; phone?: string }
): Promise<void> {
  const userRef = ref(database, `users/${uid}`);
  const updates: any = {
    ...data,
    updatedAt: Date.now(),
  };
  await update(userRef, updates);

  if (auth.currentUser && data.name) {
    await updateProfile(auth.currentUser, { displayName: data.name });
  }
}

export async function updateUserPlan(uid: string, plan: UserPlan): Promise<void> {
  const userRef = ref(database, `users/${uid}`);
  await update(userRef, { plan, updatedAt: Date.now() });
}

export async function updateUserStatus(uid: string, status: 'active' | 'suspended'): Promise<void> {
  const userRef = ref(database, `users/${uid}`);
  await update(userRef, { status, updatedAt: Date.now() });
}

export async function updateUserRole(uid: string, role: UserRole, email: string): Promise<void> {
  const userRef = ref(database, `users/${uid}`);
  await update(userRef, { role, updatedAt: Date.now() });

  const adminRef = ref(database, `admins/${uid}`);
  if (role === 'admin') {
    await set(adminRef, {
      uid,
      email,
      role: 'admin',
      status: 'active',
      createdAt: Date.now(),
    });
  } else {
    await set(adminRef, null);
  }
}

export async function loginUserWithEmail(
  email: string,
  pass: string
): Promise<{ user: User; isAdmin: boolean }> {
  const credential = await signInWithEmailAndPassword(auth, email, pass);
  const user = credential.user;
  const isAdmin = await checkAdminStatus(user.uid);
  return { user, isAdmin };
}

export async function logoutCurrentUser(): Promise<void> {
  await signOut(auth);
}

export async function sendUserPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

export async function fetchAllUsers(): Promise<UserProfile[]> {
  const usersRef = ref(database, 'users');
  const snapshot = await get(usersRef);
  if (!snapshot.exists()) return [];

  const data = snapshot.val();
  return Object.keys(data).map((key) => {
    const item = data[key];
    return {
      ...item,
      userId: key,
      plan: item.plan || (item.role === 'admin' ? 'premium' : 'free'),
      status: item.status || 'active',
    };
  });
}
