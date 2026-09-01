import { ref, get, set, update, push, remove } from 'firebase/database';
import { database, auth, firebaseConfig } from './firebase';
import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import {
  UserProfile,
  SellerPricingConfig,
  SellerCoinTransaction,
  SellerReportStats,
  LicenseKey,
  UserPlan,
} from '../types';
import { generate8DigitUID, generateFormattedLicenseKey } from '../utils/helpers';

/**
 * Creates an auth user in Firebase without signing out the currently logged in admin user
 */
export async function createSecondaryAuthUser(email: string, pass: string): Promise<string> {
  const secondaryAppName = `SecondaryAuth_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const secondaryApp = initializeApp(firebaseConfig, secondaryAppName);
  const secondaryAuth = getAuth(secondaryApp);
  try {
    const cred = await createUserWithEmailAndPassword(secondaryAuth, email, pass);
    const uid = cred.user.uid;
    await signOut(secondaryAuth);
    await deleteApp(secondaryApp);
    return uid;
  } catch (err) {
    try {
      await deleteApp(secondaryApp);
    } catch {}
    throw err;
  }
}

export const createAuthUserWithoutSignout = createSecondaryAuthUser;

export const DEFAULT_PRICING_CONFIG: SellerPricingConfig = {
  days7: 5,
  days30: 10,
  days90: 25,
  days180: 45,
  days365: 80,
  lifetime: 150,
};

const PRICING_CONFIG_REF = 'sellerPricingConfig';

/**
 * Get the global coin cost per license key
 */
export async function getSellerPricingConfig(): Promise<SellerPricingConfig> {
  try {
    const configRef = ref(database, PRICING_CONFIG_REF);
    const snapshot = await get(configRef);
    if (snapshot.exists()) {
      return { ...DEFAULT_PRICING_CONFIG, ...snapshot.val() };
    }
    return DEFAULT_PRICING_CONFIG;
  } catch (error) {
    console.error('Error fetching seller pricing config:', error);
    return DEFAULT_PRICING_CONFIG;
  }
}

/**
 * Admin: Update coin pricing for key durations
 */
export async function updateSellerPricingConfig(
  newPricing: Partial<SellerPricingConfig>,
  adminEmail?: string
): Promise<void> {
  const configRef = ref(database, PRICING_CONFIG_REF);
  const current = await getSellerPricingConfig();
  const updated: SellerPricingConfig = {
    ...current,
    ...newPricing,
    updatedAt: Date.now(),
    updatedBy: adminEmail || 'Admin',
  };
  await set(configRef, updated);
}

/**
 * Fetch all users who have the 'seller' role
 */
export async function fetchAllSellers(): Promise<UserProfile[]> {
  try {
    const usersRef = ref(database, 'users');
    const snapshot = await get(usersRef);
    if (!snapshot.exists()) return [];

    const data = snapshot.val();
    const sellers: UserProfile[] = [];

    Object.keys(data).forEach((uid) => {
      const user = data[uid];
      if (user.role === 'seller') {
        sellers.push({
          ...user,
          userId: uid,
          coinsBalance: user.coinsBalance !== undefined ? Number(user.coinsBalance) : 0,
          totalCoinsEarned: user.totalCoinsEarned !== undefined ? Number(user.totalCoinsEarned) : 0,
          totalCoinsSpent: user.totalCoinsSpent !== undefined ? Number(user.totalCoinsSpent) : 0,
        });
      }
    });

    return sellers.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  } catch (error) {
    console.error('Error fetching sellers:', error);
    return [];
  }
}

/**
 * Admin: Create a new Seller account with initial coin allocation
 */
export async function createSellerAccount(params: {
  name: string;
  email: string;
  password?: string;
  initialCoins?: number;
  notes?: string;
  adminEmail?: string;
}): Promise<UserProfile> {
  const { name, email, password, initialCoins = 0, notes = '', adminEmail = 'Admin' } = params;
  const cleanEmail = email.trim().toLowerCase();

  // 1. Check if user already exists in RTDB by email
  const usersRef = ref(database, 'users');
  const snapshot = await get(usersRef);
  let existingUid: string | null = null;
  let existingUser: any = null;

  if (snapshot.exists()) {
    const allUsers = snapshot.val();
    for (const key of Object.keys(allUsers)) {
      if (allUsers[key]?.email?.toLowerCase() === cleanEmail) {
        existingUid = key;
        existingUser = allUsers[key];
        break;
      }
    }
  }

  let uid = existingUid || `seller_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // 2. If password provided and user doesn't have an auth UID yet (or new user), create via secondary auth without logging out admin
  if (password && password.length >= 6) {
    try {
      const createdAuthUid = await createAuthUserWithoutSignout(cleanEmail, password);
      // If we had a temporary key or existing record with different ID, we will migrate to createdAuthUid
      if (existingUid && existingUid !== createdAuthUid) {
        try {
          await remove(ref(database, `users/${existingUid}`));
        } catch {}
      }
      uid = createdAuthUid;
    } catch (authErr: any) {
      console.warn('Auth user creation warning:', authErr);
      if (authErr.code === 'auth/email-already-in-use') {
        // If already in auth and we found existing RTDB record, use that existing UID
        if (!existingUid) {
          // If not in RTDB but in Auth, we can still proceed with placeholder or search
          console.info('Email already exists in Firebase Auth. Updating/Creating RTDB profile as seller.');
        }
      } else {
        throw new Error(authErr.message || 'Failed to create seller authentication.');
      }
    }
  }

  const numericUid = existingUser?.numericUid || generate8DigitUID();
  const currentCoins = existingUser?.coinsBalance !== undefined ? Number(existingUser.coinsBalance) : 0;
  const newCoinsBalance = currentCoins + initialCoins;
  const totalEarned = (existingUser?.totalCoinsEarned || 0) + initialCoins;

  const sellerProfile: UserProfile = {
    userId: uid,
    numericUid,
    name: name.trim() || existingUser?.name || cleanEmail.split('@')[0],
    email: cleanEmail,
    role: 'seller', // Explicit seller role
    plan: 'premium',
    coinsBalance: newCoinsBalance,
    totalCoinsEarned: totalEarned,
    totalCoinsSpent: existingUser?.totalCoinsSpent || 0,
    sellerNotes: notes.trim() || existingUser?.sellerNotes || '',
    createdAt: existingUser?.createdAt || Date.now(),
    updatedAt: Date.now(),
    status: 'active',
  };

  await set(ref(database, `users/${uid}`), sellerProfile);
  try {
    await set(ref(database, `sellers/${uid}`), {
      uid,
      email: cleanEmail,
      role: 'seller',
      status: 'active',
      createdAt: Date.now(),
    });
  } catch {}

  // Log initial coin credit if greater than 0
  if (initialCoins > 0) {
    await recordCoinTransaction({
      sellerUid: uid,
      sellerEmail: cleanEmail,
      type: 'credit',
      amount: initialCoins,
      balanceAfter: newCoinsBalance,
      description: `Initial wallet allocation on account creation by ${adminEmail}`,
      createdBy: adminEmail,
    });
  }

  return sellerProfile;
}

/**
 * Admin: Add or Deduct Coins from a Seller
 */
export async function adjustSellerCoins(params: {
  sellerUid: string;
  sellerEmail: string;
  type: 'credit' | 'debit';
  amount: number;
  reason: string;
  adminEmail?: string;
}): Promise<{ newBalance: number }> {
  const { sellerUid, sellerEmail, type, amount, reason, adminEmail = 'Admin' } = params;
  const userRef = ref(database, `users/${sellerUid}`);
  const snapshot = await get(userRef);

  if (!snapshot.exists()) {
    throw new Error('Seller account not found in database.');
  }

  const userData = snapshot.val();
  const currentBalance = userData.coinsBalance !== undefined ? Number(userData.coinsBalance) : 0;
  const totalEarned = userData.totalCoinsEarned !== undefined ? Number(userData.totalCoinsEarned) : currentBalance;
  const totalSpent = userData.totalCoinsSpent !== undefined ? Number(userData.totalCoinsSpent) : 0;

  let newBalance = currentBalance;
  let newEarned = totalEarned;

  if (type === 'credit') {
    newBalance = currentBalance + amount;
    newEarned = totalEarned + amount;
  } else {
    if (currentBalance < amount) {
      throw new Error(`Insufficient coins! Seller only has ${currentBalance} coins.`);
    }
    newBalance = currentBalance - amount;
  }

  await update(userRef, {
    coinsBalance: newBalance,
    totalCoinsEarned: newEarned,
    updatedAt: Date.now(),
  });

  await recordCoinTransaction({
    sellerUid,
    sellerEmail,
    type,
    amount,
    balanceAfter: newBalance,
    description: reason || `${type === 'credit' ? 'Points added' : 'Points deducted'} by ${adminEmail}`,
    createdBy: adminEmail,
  });

  return { newBalance };
}

/**
 * Record a coin transaction in RTDB
 */
export async function recordCoinTransaction(
  tx: Omit<SellerCoinTransaction, 'id' | 'createdAt'>
): Promise<SellerCoinTransaction> {
  const txListRef = ref(database, 'sellerTransactions');
  const newTxRef = push(txListRef);
  const txId = newTxRef.key || `tx_${Date.now()}`;

  const item: SellerCoinTransaction = {
    ...tx,
    id: txId,
    createdAt: Date.now(),
  };

  await set(newTxRef, item);
  return item;
}

/**
 * Fetch all transaction records for a specific seller (or all for admin)
 */
export async function fetchSellerTransactions(sellerUid?: string): Promise<SellerCoinTransaction[]> {
  try {
    const txRef = ref(database, 'sellerTransactions');
    const snapshot = await get(txRef);
    if (!snapshot.exists()) return [];

    const data = snapshot.val();
    let list: SellerCoinTransaction[] = Object.keys(data).map((k) => ({
      ...data[k],
      id: k,
    }));

    if (sellerUid) {
      list = list.filter((tx) => tx.sellerUid === sellerUid);
    }

    return list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
}

/**
 * Get coin cost for a given duration in days based on config
 */
export function calculateKeyCoinCost(
  durationDays: number,
  pricingConfig: SellerPricingConfig
): number {
  if (durationDays === 7) return pricingConfig.days7 || 5;
  if (durationDays === 30) return pricingConfig.days30 || 10;
  if (durationDays === 90) return pricingConfig.days90 || 25;
  if (durationDays === 180) return pricingConfig.days180 || 45;
  if (durationDays === 365) return pricingConfig.days365 || 80;
  if (durationDays === 0) return pricingConfig.lifetime || 150; // Lifetime
  // Dynamic calculation fallback
  if (durationDays > 0) {
    return Math.max(Math.ceil((durationDays / 30) * (pricingConfig.days30 || 10)), 1);
  }
  return pricingConfig.lifetime || 150;
}

/**
 * Seller generates license keys using their point/coin balance
 */
export async function sellerGenerateLicenseKeys(params: {
  seller: UserProfile;
  plan: UserPlan;
  durationDays: number;
  count: number;
  prefix?: string;
  note?: string;
}): Promise<{ keys: LicenseKey[]; totalCost: number; newBalance: number }> {
  const { seller, plan, durationDays, count, prefix = 'SLR', note = '' } = params;

  if (count < 1 || count > 20) {
    throw new Error('You can generate between 1 and 20 keys per batch.');
  }

  // 1. Get latest pricing config
  const pricing = await getSellerPricingConfig();
  const perKeyCost = calculateKeyCoinCost(durationDays, pricing);
  const totalCost = perKeyCost * count;

  // 2. Fetch fresh seller coin balance from DB to prevent race conditions
  const userRef = ref(database, `users/${seller.userId}`);
  const userSnap = await get(userRef);
  if (!userSnap.exists()) {
    throw new Error('Seller profile not found.');
  }

  const freshUser = userSnap.val();
  const currentBalance = freshUser.coinsBalance !== undefined ? Number(freshUser.coinsBalance) : 0;
  const currentSpent = freshUser.totalCoinsSpent !== undefined ? Number(freshUser.totalCoinsSpent) : 0;

  if (currentBalance < totalCost) {
    throw new Error(
      `Insufficient points! You need ${totalCost} coins for ${count} key(s), but your current balance is ${currentBalance} coins.`
    );
  }

  const newBalance = currentBalance - totalCost;
  const newSpent = currentSpent + totalCost;

  // 3. Deduct points from seller
  await update(userRef, {
    coinsBalance: newBalance,
    totalCoinsSpent: newSpent,
    updatedAt: Date.now(),
  });

  // 4. Generate the License Keys
  const generatedKeys: LicenseKey[] = [];
  for (let i = 0; i < count; i++) {
    const keyStr = generateFormattedLicenseKey(prefix.toUpperCase() || 'SLR');
    const licensesRef = ref(database, 'licenses');
    const newKeyRef = push(licensesRef);
    const keyId = newKeyRef.key || `key_${Date.now()}_${i}`;

    const licenseItem: LicenseKey = {
      id: keyId,
      key: keyStr,
      plan: plan || 'premium',
      durationDays: durationDays,
      status: 'active',
      createdAt: Date.now(),
      createdBy: seller.userId,
      creatorEmail: seller.email,
      creatorRole: 'seller',
      coinsCost: perKeyCost,
      note: note.trim() || undefined,
    };

    await set(newKeyRef, licenseItem);
    generatedKeys.push(licenseItem);
  }

  // 5. Record transaction log
  const durationLabel = durationDays === 0 ? 'Lifetime' : `${durationDays} Days`;
  await recordCoinTransaction({
    sellerUid: seller.userId,
    sellerEmail: seller.email,
    type: 'debit',
    amount: totalCost,
    balanceAfter: newBalance,
    description: `Generated ${count}x ${durationLabel} Premium Key(s) (Cost: ${totalCost} Coins)`,
    createdBy: seller.email,
    referenceId: generatedKeys[0]?.id,
  });

  return { keys: generatedKeys, totalCost, newBalance };
}

/**
 * Fetch license keys created by a specific seller
 */
export async function fetchKeysBySeller(sellerUid: string): Promise<LicenseKey[]> {
  try {
    const licensesRef = ref(database, 'licenses');
    const snapshot = await get(licensesRef);
    if (!snapshot.exists()) return [];

    const data = snapshot.val();
    const list: LicenseKey[] = [];

    Object.keys(data).forEach((id) => {
      const item = data[id];
      if (item.createdBy === sellerUid) {
        list.push({ ...item, id });
      }
    });

    return list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  } catch (error) {
    console.error('Error fetching seller keys:', error);
    return [];
  }
}

/**
 * Calculate Seller Analytics and Reports
 */
export async function getSellerReportStats(sellerUid: string): Promise<SellerReportStats> {
  const keys = await fetchKeysBySeller(sellerUid);
  const userRef = ref(database, `users/${sellerUid}`);
  const userSnap = await get(userRef);
  const userData = userSnap.exists() ? userSnap.val() : {};

  const activeKeys = keys.filter((k) => k.status === 'active').length;
  const redeemedKeys = keys.filter((k) => k.status === 'used').length;
  const revokedKeys = keys.filter((k) => k.status === 'revoked').length;

  return {
    totalKeysGenerated: keys.length,
    activeKeys,
    redeemedKeys,
    revokedKeys,
    totalCoinsSpent: userData.totalCoinsSpent || 0,
    currentCoinsBalance: userData.coinsBalance || 0,
  };
}
