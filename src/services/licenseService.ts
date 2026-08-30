import { ref, set, get, update, remove, push } from 'firebase/database';
import { database } from './firebase';
import { LicenseKey, UserPlan } from '../types';
import { generateFormattedLicenseKey } from '../utils/helpers';

export interface CreateLicenseParams {
  plan?: UserPlan;
  durationDays?: number; // 0 = Lifetime, > 0 = days
  count?: number;
  prefix?: string;
  note?: string;
  createdBy: string;
}

export async function generateAndSaveLicenseKeys(
  params: CreateLicenseParams
): Promise<LicenseKey[]> {
  const count = Math.min(Math.max(params.count || 1, 1), 50);
  const plan = params.plan || 'premium';
  const durationDays = params.durationDays !== undefined ? Number(params.durationDays) : 30;
  const prefix = params.prefix || 'PRO';
  const createdBy = params.createdBy;
  const note = params.note || '';

  const createdKeys: LicenseKey[] = [];

  for (let i = 0; i < count; i++) {
    const keyStr = generateFormattedLicenseKey(prefix);
    const licensesRef = ref(database, 'licenses');
    const newKeyRef = push(licensesRef);
    const keyId = newKeyRef.key || `key_${Date.now()}_${i}`;

    const licenseItem: LicenseKey = {
      id: keyId,
      key: keyStr,
      plan: plan,
      durationDays: durationDays,
      status: 'active',
      createdAt: Date.now(),
      createdBy: createdBy,
      note: note.trim() || undefined,
    };

    await set(newKeyRef, licenseItem);
    createdKeys.push(licenseItem);
  }

  return createdKeys;
}

export async function fetchLicenseKeys(): Promise<LicenseKey[]> {
  try {
    const licensesRef = ref(database, 'licenses');
    const snapshot = await get(licensesRef);
    if (!snapshot.exists()) return [];

    const data = snapshot.val();
    const list: LicenseKey[] = Object.keys(data).map((k) => ({
      ...data[k],
      id: k,
    }));

    return list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  } catch (error) {
    console.warn('Error fetching license keys:', error);
    return [];
  }
}

export async function redeemLicenseKey(
  rawKey: string,
  user: { uid: string; email?: string; numericUid?: string }
): Promise<{ success: boolean; message: string; plan?: UserPlan; key?: LicenseKey }> {
  if (!rawKey || !rawKey.trim()) {
    return { success: false, message: 'Please enter a valid license key.' };
  }

  const cleanKey = rawKey.trim().toUpperCase();

  try {
    const licensesRef = ref(database, 'licenses');
    const snapshot = await get(licensesRef);

    if (!snapshot.exists()) {
      return { success: false, message: 'Invalid license key. Key does not exist.' };
    }

    const data = snapshot.val();
    let foundKeyId: string | null = null;
    let foundKeyData: LicenseKey | null = null;

    for (const id of Object.keys(data)) {
      if (data[id]?.key?.toUpperCase() === cleanKey) {
        foundKeyId = id;
        foundKeyData = { ...data[id], id };
        break;
      }
    }

    if (!foundKeyId || !foundKeyData) {
      return { success: false, message: 'Invalid license key. Please check for typos and try again.' };
    }

    if (foundKeyData.status === 'used') {
      return {
        success: false,
        message: `This license key has already been redeemed${
          foundKeyData.usedByEmail ? ` by ${foundKeyData.usedByEmail}` : ''
        }.`,
      };
    }

    if (foundKeyData.status === 'revoked') {
      return { success: false, message: 'This license key has been revoked by an administrator.' };
    }

    const now = Date.now();
    const targetPlan = foundKeyData.plan || 'premium';
    const durationDays = foundKeyData.durationDays !== undefined ? Number(foundKeyData.durationDays) : 30;
    const expiresAt = durationDays > 0 ? now + durationDays * 24 * 60 * 60 * 1000 : null;
    const isLifetime = durationDays === 0;

    // 1. Mark license as used & start countdown timer
    const licenseRef = ref(database, `licenses/${foundKeyId}`);
    await update(licenseRef, {
      status: 'used',
      usedBy: user.uid,
      usedByEmail: user.email || '',
      usedByNumericUid: user.numericUid || '',
      usedAt: now,
      expiresAt: expiresAt,
    });

    // 2. Upgrade user profile to target plan (Premium Pro) with expiration timer
    const userRef = ref(database, `users/${user.uid}`);
    await update(userRef, {
      plan: targetPlan,
      redeemedKey: foundKeyData.key,
      redeemedAt: now,
      planExpiresAt: expiresAt,
      isLifetime: isLifetime,
      updatedAt: now,
    });

    const durationText = isLifetime ? 'Lifetime Access' : `${durationDays} Days Access`;

    return {
      success: true,
      message: `Congratulations! Your account has been activated with ${targetPlan.toUpperCase()} Pro (${durationText})!`,
      plan: targetPlan,
      key: {
        ...foundKeyData,
        status: 'used',
        usedBy: user.uid,
        usedByEmail: user.email,
        usedAt: now,
        expiresAt: expiresAt,
      },
    };
  } catch (error: any) {
    console.error('Error redeeming license key:', error);
    return {
      success: false,
      message: error.message || 'Failed to redeem license key. Please try again.',
    };
  }
}

export async function revokeLicenseKey(keyId: string): Promise<void> {
  const licenseRef = ref(database, `licenses/${keyId}`);
  await update(licenseRef, { status: 'revoked', updatedAt: Date.now() });
}

export async function deleteLicenseKey(keyId: string): Promise<void> {
  const licenseRef = ref(database, `licenses/${keyId}`);
  await remove(licenseRef);
}
