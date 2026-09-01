import {
  ref,
  push,
  set,
  get,
  remove,
  update,
  onValue,
  off,
} from 'firebase/database';
import { database } from './firebase';
import { CodeItem, CreatorStats, CreatorTransaction, UserProfile } from '../types';
import { generate8DigitUID } from '../utils/helpers';
import { createSecondaryAuthUser } from './sellerService';

/**
 * Fetch all creators registered in the platform
 */
export async function fetchAllCreators(): Promise<UserProfile[]> {
  try {
    const creatorsRef = ref(database, 'creators');
    const snapshot = await get(creatorsRef);
    const result: UserProfile[] = [];

    if (snapshot.exists()) {
      const creatorsIndex = snapshot.val();
      const uids = Object.keys(creatorsIndex);

      const usersRef = ref(database, 'users');
      const usersSnap = await get(usersRef);
      const allUsers = usersSnap.exists() ? usersSnap.val() : {};

      for (const uid of uids) {
        const u = allUsers[uid] || creatorsIndex[uid];
        if (u) {
          result.push({
            userId: uid,
            numericUid: u.numericUid || u.id || '',
            name: u.name || u.email?.split('@')[0] || 'Creator',
            email: u.email || '',
            role: 'creator',
            status: u.status || 'active',
            creatorBalance: Number(u.creatorBalance || 0),
            creatorEarnings: Number(u.creatorEarnings || 0),
            creatorBio: u.creatorBio || '',
            creatorSpecialty: u.creatorSpecialty || '',
            creatorWithdrawalAddress: u.creatorWithdrawalAddress || '',
            createdAt: u.createdAt || Date.now(),
          });
        }
      }
    }

    // Also check users collection for any user with role === 'creator'
    const usersSnap = await get(ref(database, 'users'));
    if (usersSnap.exists()) {
      const allUsers = usersSnap.val();
      for (const key of Object.keys(allUsers)) {
        const u = allUsers[key];
        if (u?.role === 'creator' && !result.some((r) => r.userId === key || r.email?.toLowerCase() === u.email?.toLowerCase())) {
          result.push({
            userId: key,
            numericUid: u.numericUid || key,
            name: u.name || u.email?.split('@')[0] || 'Creator',
            email: u.email || '',
            role: 'creator',
            status: u.status || 'active',
            creatorBalance: Number(u.creatorBalance || 0),
            creatorEarnings: Number(u.creatorEarnings || 0),
            creatorBio: u.creatorBio || '',
            creatorSpecialty: u.creatorSpecialty || '',
            creatorWithdrawalAddress: u.creatorWithdrawalAddress || '',
            createdAt: u.createdAt || Date.now(),
          });
        }
      }
    }

    return result.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.warn('Error fetching all creators:', error);
    return [];
  }
}

/**
 * Create a new Creator from Admin Panel
 */
export async function createNewCreator(params: {
  name: string;
  email: string;
  password?: string;
  initialBalance?: number;
  bio?: string;
  specialty?: string;
  adminEmail?: string;
}): Promise<{ uid: string; email: string }> {
  const { name, email, password, initialBalance = 0, bio = '', specialty = '', adminEmail = 'Admin' } = params;
  const cleanEmail = email.toLowerCase().trim();

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

  let uid = existingUid || `creator_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // 2. If password provided, create secondary auth user
  if (password && password.trim().length >= 6) {
    try {
      const createdAuthUid = await createSecondaryAuthUser(cleanEmail, password.trim());
      if (existingUid && existingUid !== createdAuthUid) {
        try {
          await remove(ref(database, `users/${existingUid}`));
        } catch {}
      }
      uid = createdAuthUid;
    } catch (authErr: any) {
      console.warn('Creator auth user creation note:', authErr);
      if (authErr?.code === 'auth/email-already-in-use') {
        if (!existingUid) {
          console.info('Email already exists in Firebase Auth, proceeding with creator assignment.');
        }
      } else {
        throw new Error(authErr?.message || 'Failed to create creator authentication credentials.');
      }
    }
  }

  // Ensure uid is never empty or undefined
  if (!uid) {
    uid = `creator_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  }

  const numericUid = existingUser?.numericUid || generate8DigitUID();
  const now = Date.now();

  const creatorProfile: UserProfile = {
    userId: uid,
    numericUid,
    name: name.trim() || existingUser?.name || cleanEmail.split('@')[0],
    email: cleanEmail,
    role: 'creator',
    plan: 'premium',
    status: 'active',
    creatorBalance: Number(initialBalance) + Number(existingUser?.creatorBalance || 0),
    creatorEarnings: Number(initialBalance) + Number(existingUser?.creatorEarnings || 0),
    creatorBio: bio.trim() || existingUser?.creatorBio || '',
    creatorSpecialty: specialty.trim() || existingUser?.creatorSpecialty || '',
    createdAt: existingUser?.createdAt || now,
    updatedAt: now,
  };

  // 3. Save to users node
  await set(ref(database, `users/${uid}`), creatorProfile);

  // 4. Save to creators index node
  try {
    await set(ref(database, `creators/${uid}`), {
      uid,
      numericUid,
      name: creatorProfile.name,
      email: cleanEmail,
      role: 'creator',
      status: 'active',
      createdAt: creatorProfile.createdAt,
    });
  } catch {}

  // 5. Log initial transaction if balance provided
  if (initialBalance > 0) {
    const txRef = push(ref(database, 'creatorTransactions'));
    const tx: CreatorTransaction = {
      id: txRef.key as string,
      creatorUid: uid,
      creatorEmail: cleanEmail,
      type: 'bonus',
      amount: initialBalance,
      balanceAfter: creatorProfile.creatorBalance || initialBalance,
      description: `Welcome bonus / initial balance credited by ${adminEmail}`,
      createdAt: now,
      createdBy: adminEmail,
      status: 'completed',
    };
    await set(txRef, tx);
  }

  return { uid, email: cleanEmail };
}

/**
 * Subscribe to Codes uploaded by a specific creator
 */
export function subscribeToCreatorCodes(
  creatorUid: string,
  creatorEmail: string,
  callback: (codes: CodeItem[]) => void,
  onError?: (err: Error) => void
): () => void {
  const codesRef = ref(database, 'codes');
  const cleanEmail = creatorEmail.toLowerCase().trim();

  const unsubscribe = onValue(
    codesRef,
    (snapshot) => {
      if (!snapshot.exists()) {
        callback([]);
        return;
      }
      const val = snapshot.val();
      const items: CodeItem[] = Object.keys(val)
        .map((key) => ({
          id: key,
          ...val[key],
        }))
        .filter((c) => c.createdBy === creatorUid || (c.creatorEmail && c.creatorEmail.toLowerCase().trim() === cleanEmail))
        .sort((a, b) => (b.updatedAt || b.createdAt || 0) - (a.updatedAt || a.createdAt || 0));

      callback(items);
    },
    (err) => {
      if (onError) onError(err);
    }
  );

  return () => {
    off(codesRef, 'value', unsubscribe);
  };
}

/**
 * Fetch all codes submitted by creators for admin review
 */
export async function fetchAllCreatorCodes(): Promise<CodeItem[]> {
  try {
    const codesRef = ref(database, 'codes');
    const snap = await get(codesRef);
    if (!snap.exists()) return [];

    const val = snap.val();
    const list: CodeItem[] = Object.keys(val).map((key) => ({
      id: key,
      ...val[key],
    }));

    // Return items created by creators or pending approval or rejected
    return list
      .filter((c) => c.creatorRole === 'creator' || c.status === 'pending_approval' || c.status === 'rejected' || (c.creatorEmail && c.creatorEmail !== ''))
      .sort((a, b) => (b.updatedAt || b.createdAt || 0) - (a.updatedAt || a.createdAt || 0));
  } catch (err) {
    console.error('Error fetching creator codes:', err);
    return [];
  }
}

/**
 * Creator uploads a new tool/code (starts with status 'pending_approval')
 */
export async function uploadCreatorCode(
  item: Omit<CodeItem, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'createdBy' | 'creatorEmail' | 'status'>,
  creatorUid: string,
  creatorEmail: string,
  isAdmin: boolean = false
): Promise<string> {
  const codesRef = ref(database, 'codes');
  const newCodeRef = push(codesRef);
  const now = Date.now();

  // Try to get creator's custom display name
  let creatorName = '';
  try {
    const userSnap = await get(ref(database, `users/${creatorUid}`));
    if (userSnap.exists()) {
      const uData = userSnap.val();
      creatorName = uData.creatorDisplayName || uData.name || '';
    }
  } catch (_) {}

  const codeData: Record<string, any> = {
    ...item,
    createdAt: now,
    updatedAt: now,
    createdBy: creatorUid,
    creatorUid: creatorUid,
    creatorName: creatorName || (creatorEmail ? creatorEmail.split('@')[0] : 'Creator'),
    creatorEmail: creatorEmail.toLowerCase().trim(),
    creatorRole: isAdmin ? 'admin' : 'creator',
    status: isAdmin ? 'published' : 'pending_approval',
    views: 0,
  };

  if (isAdmin) {
    codeData.approvedAt = now;
    codeData.approvedBy = 'Auto-Admin';
  }

  await set(newCodeRef, codeData);
  return newCodeRef.key as string;
}

/**
 * Creator or Admin updates an existing code
 */
export async function updateCreatorCode(
  codeId: string,
  updates: Partial<CodeItem>,
  isCreator: boolean = false
): Promise<void> {
  const codeRef = ref(database, `codes/${codeId}`);
  const now = Date.now();

  const payload: Partial<CodeItem> = {
    ...updates,
    updatedAt: now,
  };

  // If a creator modifies a rejected or published code, you can set it back to pending_approval if desired
  if (isCreator && updates.status === undefined) {
    // If it was rejected, mark it as pending_approval for re-review
    const current = await get(codeRef);
    if (current.exists()) {
      const curData = current.val();
      if (curData.status === 'rejected') {
        payload.status = 'pending_approval';
        payload.rejectionReason = '';
      }
    }
  }

  await update(codeRef, payload);
}

/**
 * Admin approves a pending creator code
 */
export async function approveCreatorCode(
  codeId: string,
  adminEmailOrReward?: string | number,
  customReward?: number
): Promise<void> {
  const codeRef = ref(database, `codes/${codeId}`);
  const snap = await get(codeRef);
  if (!snap.exists()) throw new Error('Code item not found');

  let adminEmail = 'Admin';
  let reward = 5.0;
  if (typeof adminEmailOrReward === 'string') {
    adminEmail = adminEmailOrReward;
    if (typeof customReward === 'number') reward = customReward;
  } else if (typeof adminEmailOrReward === 'number') {
    reward = adminEmailOrReward;
  }

  const codeData = snap.val() as CodeItem;
  const now = Date.now();

  await update(codeRef, {
    status: 'published',
    approvedAt: now,
    approvedBy: adminEmail,
    rejectionReason: '',
    updatedAt: now,
  });

  // Reward creator with an approval bonus in wallet
  if (codeData.createdBy && codeData.creatorRole === 'creator' && reward > 0) {
    try {
      const creatorRef = ref(database, `users/${codeData.createdBy}`);
      const creatorSnap = await get(creatorRef);
      if (creatorSnap.exists()) {
        const cVal = creatorSnap.val();
        const currentBal = Number(cVal.creatorBalance || 0);
        const currentEarn = Number(cVal.creatorEarnings || 0);

        await update(creatorRef, {
          creatorBalance: currentBal + reward,
          creatorEarnings: currentEarn + reward,
          updatedAt: now,
        });

        // Record transaction
        const txRef = push(ref(database, 'creatorTransactions'));
        await set(txRef, {
          id: txRef.key,
          creatorUid: codeData.createdBy,
          creatorEmail: codeData.creatorEmail || '',
          type: 'earning',
          amount: reward,
          balanceAfter: currentBal + reward,
          description: `Tool approval reward for "${codeData.title}"`,
          createdAt: now,
          createdBy: adminEmail,
          status: 'completed',
          codeId,
        });
      }
    } catch (e) {
      console.warn('Could not credit approval reward to creator:', e);
    }
  }
}

/**
 * Admin rejects a creator code with feedback reason
 */
export async function rejectCreatorCode(
  codeId: string,
  reasonOrAdminEmail?: string,
  optionalReason?: string
): Promise<void> {
  const codeRef = ref(database, `codes/${codeId}`);
  const now = Date.now();

  let adminEmail = 'Admin';
  let reason = 'Does not meet repository quality guidelines.';
  if (optionalReason !== undefined) {
    adminEmail = reasonOrAdminEmail || 'Admin';
    reason = optionalReason;
  } else if (reasonOrAdminEmail) {
    reason = reasonOrAdminEmail;
  }

  await update(codeRef, {
    status: 'rejected',
    rejectionReason: reason.trim() || 'Does not meet repository quality guidelines.',
    updatedAt: now,
    approvedBy: adminEmail,
  });
}

/**
 * Fetch creator wallet transactions
 */
export async function fetchCreatorTransactions(creatorUid?: string): Promise<CreatorTransaction[]> {
  try {
    const txRef = ref(database, 'creatorTransactions');
    const snap = await get(txRef);
    if (!snap.exists()) return [];

    const val = snap.val();
    const list: CreatorTransaction[] = Object.keys(val).map((k) => ({
      id: k,
      ...val[k],
    }));

    if (creatorUid) {
      return list
        .filter((t) => t.creatorUid === creatorUid)
        .sort((a, b) => b.createdAt - a.createdAt);
    }

    return list.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.warn('Error fetching creator transactions:', error);
    return [];
  }
}

/**
 * Request wallet withdrawal for a creator
 */
export async function requestCreatorWithdrawal(
  creatorUid: string,
  creatorEmail: string,
  amount: number,
  withdrawalDetails: string
): Promise<void> {
  if (amount <= 0) throw new Error('Withdrawal amount must be greater than 0');

  const userRef = ref(database, `users/${creatorUid}`);
  const snap = await get(userRef);
  if (!snap.exists()) throw new Error('Creator profile not found');

  const uData = snap.val();
  const currentBal = Number(uData.creatorBalance || 0);

  if (currentBal < amount) {
    throw new Error(`Insufficient wallet balance. You have $${currentBal.toFixed(2)} available.`);
  }

  const newBalance = currentBal - amount;
  const now = Date.now();

  // Deduct balance
  await update(userRef, {
    creatorBalance: newBalance,
    updatedAt: now,
  });

  // Record withdrawal transaction
  const txRef = push(ref(database, 'creatorTransactions'));
  const tx: CreatorTransaction = {
    id: txRef.key as string,
    creatorUid,
    creatorEmail: creatorEmail.toLowerCase().trim(),
    type: 'withdrawal',
    amount: -amount,
    balanceAfter: newBalance,
    description: `Withdrawal request to: ${withdrawalDetails}`,
    createdAt: now,
    status: 'pending',
  };

  await set(txRef, tx);
}

/**
 * Approve or process a creator withdrawal request
 */
export async function updateWithdrawalStatus(
  txId: string,
  newStatus: 'completed' | 'cancelled',
  adminNote?: string,
  adminEmail: string = 'Admin'
): Promise<void> {
  const txRef = ref(database, `creatorTransactions/${txId}`);
  const txSnap = await get(txRef);
  if (!txSnap.exists()) throw new Error('Transaction record not found');

  const txData = txSnap.val() as CreatorTransaction;
  const now = Date.now();

  // If cancelling/rejecting a pending withdrawal, refund balance back to creator
  if (newStatus === 'cancelled' && txData.status === 'pending') {
    const creatorUid = txData.creatorUid;
    const userRef = ref(database, `users/${creatorUid}`);
    const userSnap = await get(userRef);
    if (userSnap.exists()) {
      const uData = userSnap.val();
      const currentBal = Number(uData.creatorBalance || 0);
      const refundAmount = Math.abs(Number(txData.amount || 0));
      await update(userRef, {
        creatorBalance: currentBal + refundAmount,
        updatedAt: now,
      });
    }
  }

  await update(txRef, {
    status: newStatus,
    adminNote: adminNote || (newStatus === 'completed' ? `Approved by ${adminEmail}` : `Cancelled by ${adminEmail}`),
    processedAt: now,
    processedBy: adminEmail,
  });
}

/**
 * Fetch all pending or recent withdrawal requests
 */
export async function fetchWithdrawalRequests(): Promise<CreatorTransaction[]> {
  try {
    const txRef = ref(database, 'creatorTransactions');
    const snap = await get(txRef);
    if (!snap.exists()) return [];

    const val = snap.val();
    const list: CreatorTransaction[] = Object.keys(val).map((k) => ({
      id: k,
      ...val[k],
    }));

    return list
      .filter((t) => t.type === 'withdrawal')
      .sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.warn('Error fetching withdrawals:', error);
    return [];
  }
}

export async function adjustCreatorWallet(params: {
  creatorUid: string;
  creatorEmail: string;
  type: 'credit' | 'debit';
  amount: number;
  reason: string;
  adminEmail?: string;
}): Promise<number> {
  const { creatorUid, creatorEmail, type, amount, reason, adminEmail = 'Admin' } = params;
  if (amount <= 0) throw new Error('Amount must be positive');

  const userRef = ref(database, `users/${creatorUid}`);
  const snap = await get(userRef);
  if (!snap.exists()) throw new Error('Creator not found');

  const val = snap.val();
  const currentBal = Number(val.creatorBalance || 0);
  const currentEarn = Number(val.creatorEarnings || 0);

  const delta = type === 'credit' ? amount : -amount;
  const newBal = Math.max(0, currentBal + delta);
  const newEarn = type === 'credit' ? currentEarn + amount : currentEarn;
  const now = Date.now();

  await update(userRef, {
    creatorBalance: newBal,
    creatorEarnings: newEarn,
    updatedAt: now,
  });

  const txRef = push(ref(database, 'creatorTransactions'));
  const tx: CreatorTransaction = {
    id: txRef.key as string,
    creatorUid,
    creatorEmail: creatorEmail.toLowerCase().trim(),
    type: type === 'credit' ? 'adjustment' : 'adjustment',
    amount: delta,
    balanceAfter: newBal,
    description: reason || `${type === 'credit' ? 'Bonus balance added' : 'Balance deducted'} by ${adminEmail}`,
    createdAt: now,
    createdBy: adminEmail,
    status: 'completed',
  };

  await set(txRef, tx);
  return newBal;
}
