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

export interface ResolvedSession {
  isAdmin: boolean;
  isSeller: boolean;
  isCreator: boolean;
  role: UserRole;
  profile: UserProfile;
}

export async function checkAdminStatus(uid: string, email?: string): Promise<boolean> {
  try {
    if (!uid) return false;
    // 1. Direct fast check in admins table index
    const adminRef = ref(database, `admins/${uid}`);
    const adminSnap = await get(adminRef);
    if (adminSnap.exists()) {
      const data = adminSnap.val() as AdminProfile;
      if (data.role === 'admin' && data.status !== 'suspended') {
        return true;
      }
    }

    // 2. Direct fast check in user profile
    const userRef = ref(database, `users/${uid}`);
    const userSnap = await get(userRef);
    if (userSnap.exists()) {
      const uData = userSnap.val();
      if (uData?.role === 'admin' && uData?.status !== 'suspended') {
        // Sync to admins index in background
        set(adminRef, {
          uid,
          email: uData.email || email || '',
          role: 'admin',
          status: 'active',
          updatedAt: Date.now(),
        }).catch(() => {});
        return true;
      }
    }

    return false;
  } catch (error) {
    console.warn('Admin status check failed:', error);
    return false;
  }
}

export async function checkCreatorStatus(uid: string, email?: string): Promise<boolean> {
  try {
    if (!uid) return false;
    // 1. Direct fast check in creators table index
    const creatorRef = ref(database, `creators/${uid}`);
    const creatorSnap = await get(creatorRef);
    if (creatorSnap.exists()) {
      const cData = creatorSnap.val();
      if (cData?.role === 'creator' && cData?.status !== 'suspended') {
        return true;
      }
    }

    // 2. Direct fast check in user profile
    const userRef = ref(database, `users/${uid}`);
    const userSnap = await get(userRef);
    if (userSnap.exists()) {
      const uData = userSnap.val();
      if (uData?.role === 'creator' && uData?.status !== 'suspended') {
        set(creatorRef, {
          uid,
          email: uData.email || email || '',
          role: 'creator',
          status: uData.status || 'active',
          updatedAt: Date.now(),
        }).catch(() => {});
        return true;
      }
    }

    return false;
  } catch (error) {
    console.warn('Creator status check failed:', error);
    return false;
  }
}

export async function checkSellerStatus(uid: string, email?: string): Promise<boolean> {
  try {
    if (!uid) return false;
    // 1. Direct fast check in sellers table index
    const sellerRef = ref(database, `sellers/${uid}`);
    const sellerSnap = await get(sellerRef);
    if (sellerSnap.exists()) {
      const sData = sellerSnap.val();
      if (sData?.role === 'seller' && sData?.status !== 'suspended') {
        return true;
      }
    }

    // 2. Direct fast check in user profile
    const userRef = ref(database, `users/${uid}`);
    const userSnap = await get(userRef);
    if (userSnap.exists()) {
      const uData = userSnap.val();
      if (uData?.role === 'seller' && uData?.status !== 'suspended') {
        set(sellerRef, {
          uid,
          email: uData.email || email || '',
          role: 'seller',
          status: uData.status || 'active',
          updatedAt: Date.now(),
        }).catch(() => {});
        return true;
      }
    }

    return false;
  } catch (error) {
    console.warn('Seller status check failed:', error);
    return false;
  }
}

/**
 * Fast atomic session resolver: queries users, admins, sellers, and creators indices in parallel
 * Resolves full permissions and profile within ~30ms without full-database scanning
 */
export async function resolveFullUserSession(user: User): Promise<ResolvedSession> {
  const uid = user.uid;
  const targetEmail = (user.email || '').toLowerCase().trim();

  try {
    // Run parallel point reads directly by UID
    const [userSnap, adminSnap, sellerSnap, creatorSnap] = await Promise.all([
      get(ref(database, `users/${uid}`)),
      get(ref(database, `admins/${uid}`)),
      get(ref(database, `sellers/${uid}`)),
      get(ref(database, `creators/${uid}`)),
    ]);

    const uData = userSnap.exists() ? userSnap.val() : null;
    const aData = adminSnap.exists() ? adminSnap.val() : null;
    const sData = sellerSnap.exists() ? sellerSnap.val() : null;
    const cData = creatorSnap.exists() ? creatorSnap.val() : null;

    const isAdmin = Boolean(
      (aData && aData.role === 'admin' && aData.status !== 'suspended') ||
      (uData && uData.role === 'admin' && uData.status !== 'suspended')
    );

    const isSeller = Boolean(
      !isAdmin &&
      ((sData && sData.role === 'seller' && sData.status !== 'suspended') ||
       (uData && uData.role === 'seller' && uData.status !== 'suspended'))
    );

    const isCreator = Boolean(
      !isAdmin && !isSeller &&
      ((cData && cData.role === 'creator' && cData.status !== 'suspended') ||
       (uData && uData.role === 'creator' && uData.status !== 'suspended'))
    );

    const role: UserRole = isAdmin ? 'admin' : isSeller ? 'seller' : isCreator ? 'creator' : (uData?.role || 'user');

    let numericUid = uData?.numericUid;
    if (!numericUid || typeof numericUid !== 'string' || numericUid.length !== 8) {
      numericUid = generate8DigitUID();
      update(ref(database, `users/${uid}`), { numericUid }).catch(() => {});
    }

    const defaultPlan: UserPlan = (isAdmin || isSeller) ? 'premium' : 'free';

    const profile: UserProfile = {
      ...(uData || {}),
      userId: uid,
      email: targetEmail || uData?.email || '',
      name: uData?.name || user.displayName || targetEmail.split('@')[0] || 'User',
      numericUid,
      role,
      plan: isAdmin ? 'premium' : (uData?.plan || defaultPlan),
      coinsBalance: uData?.coinsBalance !== undefined ? Number(uData.coinsBalance) : (role === 'seller' ? 50 : 0),
      totalCoinsEarned: uData?.totalCoinsEarned || (role === 'seller' ? 50 : 0),
      totalCoinsSpent: uData?.totalCoinsSpent || 0,
      status: uData?.status || 'active',
      createdAt: uData?.createdAt || Date.now(),
    };

    // If profile didn't exist in RTDB, create it cleanly
    if (!uData) {
      set(ref(database, `users/${uid}`), profile).catch(() => {});
    }

    return {
      isAdmin,
      isSeller,
      isCreator,
      role,
      profile,
    };
  } catch (err) {
    console.warn('Error resolving user session:', err);
    // Safe fallback
    const fallbackProfile: UserProfile = {
      userId: uid,
      numericUid: generate8DigitUID(),
      email: targetEmail,
      name: user.displayName || targetEmail.split('@')[0] || 'User',
      role: 'user',
      plan: 'free',
      status: 'active',
      createdAt: Date.now(),
    };
    return {
      isAdmin: false,
      isSeller: false,
      isCreator: false,
      role: 'user',
      profile: fallbackProfile,
    };
  }
}

export async function fetchUserProfile(uid: string, fallbackEmail?: string): Promise<UserProfile | null> {
  try {
    const userRef = ref(database, `users/${uid}`);
    const snapshot = await get(userRef);
    let val = snapshot.exists() ? snapshot.val() : null;

    const targetEmail = (fallbackEmail || val?.email || auth.currentUser?.email || '').toLowerCase().trim();
    const isUserAdmin = await checkAdminStatus(uid, targetEmail);

    if (val || isUserAdmin) {
      if (!val) {
        val = {
          userId: uid,
          email: targetEmail,
          name: targetEmail.split('@')[0] || 'Admin',
          role: 'admin',
          plan: 'premium',
          createdAt: Date.now(),
          status: 'active',
        };
        try {
          await set(userRef, val);
        } catch {}
      }

      let numericUid = val.numericUid;
      if (!numericUid || typeof numericUid !== 'string' || numericUid.length !== 8) {
        numericUid = generate8DigitUID();
        try {
          await update(userRef, { numericUid });
        } catch {}
      }

      const role: UserRole = isUserAdmin ? 'admin' : (val.role || 'user');
      const defaultPlan = (role === 'admin' || role === 'seller') ? 'premium' : 'free';

      return {
        ...val,
        userId: uid,
        numericUid: numericUid,
        role: role,
        coinsBalance: val.coinsBalance !== undefined ? Number(val.coinsBalance) : (role === 'seller' ? 50 : 0),
        plan: isUserAdmin ? 'premium' : (val.plan || defaultPlan),
        status: val.status || 'active',
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
  const emailLower = (user.email || email).toLowerCase().trim();

  // Check if a pre-existing profile exists under user.uid or matching email in RTDB (e.g. pre-created seller)
  let existingData: any = null;
  let oldKeyToDelete: string | null = null;
  try {
    const allUsersSnap = await get(ref(database, 'users'));
    if (allUsersSnap.exists()) {
      const allUsers = allUsersSnap.val();
      if (allUsers[user.uid]) {
        existingData = allUsers[user.uid];
      } else {
        for (const k of Object.keys(allUsers)) {
          if (allUsers[k]?.email?.toLowerCase()?.trim() === emailLower) {
            existingData = allUsers[k];
            oldKeyToDelete = k;
            break;
          }
        }
      }
    }
  } catch (checkErr) {
    console.warn('Error checking existing profile during registration:', checkErr);
  }

  const isSellerRole = existingData?.role === 'seller';
  const role: UserRole = isAdmin ? 'admin' : (isSellerRole ? 'seller' : 'user');
  const plan: UserPlan = (isAdmin || role === 'seller') ? 'premium' : (existingData?.plan || 'free');
  const numericUid = existingData?.numericUid || generate8DigitUID();
  const coinsBalance = existingData?.coinsBalance !== undefined ? existingData.coinsBalance : (role === 'seller' ? 50 : 0);

  const userProfile: UserProfile = {
    userId: user.uid,
    numericUid: numericUid,
    name: name.trim() || existingData?.name || email.split('@')[0],
    email: user.email || email,
    role: role,
    plan: plan,
    coinsBalance: coinsBalance,
    totalCoinsEarned: existingData?.totalCoinsEarned || coinsBalance,
    totalCoinsSpent: existingData?.totalCoinsSpent || 0,
    sellerNotes: existingData?.sellerNotes || '',
    createdAt: existingData?.createdAt || Date.now(),
    status: existingData?.status || 'active',
  };

  try {
    await set(ref(database, `users/${user.uid}`), userProfile);
    if (oldKeyToDelete && oldKeyToDelete !== user.uid) {
      await set(ref(database, `users/${oldKeyToDelete}`), null);
    }
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
  const userSnap = await get(userRef);
  const existingUser = userSnap.exists() ? userSnap.val() : {};

  const updates: any = { role, updatedAt: Date.now() };

  if (role === 'seller') {
    updates.plan = 'premium';
    if (existingUser.coinsBalance === undefined || existingUser.coinsBalance === null) {
      updates.coinsBalance = 50;
      updates.totalCoinsEarned = 50;
    }
  }

  await update(userRef, updates);

  const adminRef = ref(database, `admins/${uid}`);
  const sellerRef = ref(database, `sellers/${uid}`);
  const creatorRef = ref(database, `creators/${uid}`);

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

  if (role === 'seller') {
    await set(sellerRef, {
      uid,
      email,
      role: 'seller',
      status: 'active',
      createdAt: Date.now(),
    });
  } else {
    await set(sellerRef, null);
  }

  if (role === 'creator') {
    await set(creatorRef, {
      uid,
      email,
      role: 'creator',
      status: 'active',
      createdAt: Date.now(),
    });
  } else {
    await set(creatorRef, null);
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
