import { ref, get, set, push, update, increment } from 'firebase/database';
import { database } from './firebase';
import { ToolReview, ToolTipTransaction } from '../types';
import { bdtToUsd, usdToBdt } from '../utils/currency';

/**
 * Fetch reviews for a specific tool
 */
export async function fetchToolReviews(codeId: string): Promise<ToolReview[]> {
  try {
    if (!codeId) return [];
    const reviewsRef = ref(database, `toolReviews/${codeId}`);
    const snap = await get(reviewsRef);
    if (!snap.exists()) return [];

    const data = snap.val();
    return Object.keys(data)
      .map((k) => ({ id: k, ...data[k] }))
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  } catch (err) {
    console.error('Error fetching reviews:', err);
    return [];
  }
}

/**
 * Submit a review with star rating
 */
export async function submitToolReview(
  codeId: string,
  user: { uid?: string; name?: string; email?: string },
  rating: number,
  comment: string
): Promise<ToolReview> {
  if (!codeId) {
    throw new Error('Tool ID is missing.');
  }

  const reviewsRef = ref(database, `toolReviews/${codeId}`);
  const newRef = push(reviewsRef);

  const review: ToolReview = {
    id: newRef.key || Date.now().toString(),
    codeId,
    userId: user.uid || 'anonymous',
    userName: user.name || (user.email ? user.email.split('@')[0] : 'Developer'),
    userEmail: user.email || '',
    rating: Number(rating) || 5,
    comment: comment || '',
    createdAt: Date.now(),
  };

  await set(newRef, review);

  // Recalculate average rating on the code item
  const allReviews = await fetchToolReviews(codeId);
  const totalStars = allReviews.reduce((sum, r) => sum + (r.rating || 5), 0);
  const averageRating = allReviews.length > 0
    ? parseFloat((totalStars / allReviews.length).toFixed(1))
    : 5.0;

  const codeRef = ref(database, `codes/${codeId}`);
  await update(codeRef, {
    averageRating,
    ratingsCount: allReviews.length,
    updatedAt: Date.now(),
  });

  return review;
}

/**
 * Send a Tip / Donation to a Creator (Supports BDT and USD)
 */
export async function sendTipToCreator(params: {
  codeId: string;
  toolTitle: string;
  senderUid: string;
  senderName: string;
  senderEmail: string;
  creatorUid?: string;
  creatorEmail?: string;
  amountBDT: number;
  amountUSD?: number;
  message?: string;
}): Promise<ToolTipTransaction> {
  const {
    codeId,
    toolTitle,
    senderUid,
    senderName,
    senderEmail,
    amountBDT,
    message = '',
  } = params;

  let targetCreatorUid = params.creatorUid || '';
  let targetCreatorEmail = params.creatorEmail || '';

  // Calculated amounts
  const amountInUSD = params.amountUSD ?? bdtToUsd(amountBDT);
  const amountInBDT = amountBDT || usdToBdt(amountInUSD);

  // If creatorUid is missing, attempt to find user by email from database
  if (!targetCreatorUid && targetCreatorEmail) {
    try {
      const usersSnap = await get(ref(database, 'users'));
      if (usersSnap.exists()) {
        const usersObj = usersSnap.val();
        for (const [uid, uData] of Object.entries<any>(usersObj)) {
          if (uData.email && uData.email.toLowerCase() === targetCreatorEmail.toLowerCase()) {
            targetCreatorUid = uid;
            break;
          }
        }
      }
    } catch (e) {
      console.warn('Could not lookup creator by email', e);
    }
  }

  // If still not found, check the code item itself
  if (!targetCreatorUid && codeId) {
    try {
      const codeSnap = await get(ref(database, `codes/${codeId}`));
      if (codeSnap.exists()) {
        const codeVal = codeSnap.val();
        if (codeVal.creatorUid) targetCreatorUid = codeVal.creatorUid;
        if (!targetCreatorEmail && codeVal.creatorEmail) targetCreatorEmail = codeVal.creatorEmail;
        if (!targetCreatorEmail && codeVal.createdBy) targetCreatorEmail = codeVal.createdBy;
      }
    } catch (e) {
      console.warn('Could not lookup code creator info', e);
    }
  }

  // 1. Record tip in tip transactions
  const tipsRef = ref(database, `toolTips/${codeId}`);
  const tipKey = push(tipsRef).key || Date.now().toString();

  const tipData: ToolTipTransaction = {
    id: tipKey,
    codeId: codeId || '',
    toolTitle: toolTitle || 'Untitled Tool',
    senderUid: senderUid || 'anonymous',
    senderName: senderName || 'Supporter',
    senderEmail: senderEmail || '',
    creatorUid: targetCreatorUid || '',
    creatorEmail: targetCreatorEmail || '',
    amount: amountInUSD,
    amountBDT: amountInBDT,
    message: message || '',
    createdAt: Date.now(),
  };

  await set(ref(database, `toolTips/${codeId}/${tipKey}`), tipData);

  // 2. Credit Creator Balance & Creator Transaction Record
  if (targetCreatorUid) {
    const creatorUserRef = ref(database, `users/${targetCreatorUid}`);
    await update(creatorUserRef, {
      creatorBalance: increment(amountInUSD),
      creatorEarnings: increment(amountInUSD),
      creatorEarningsBDT: increment(amountInBDT),
    });

    const txRef = push(ref(database, `creatorTransactions/${targetCreatorUid}`));
    await set(txRef, {
      id: txRef.key,
      creatorUid: targetCreatorUid,
      creatorEmail: targetCreatorEmail || '',
      type: 'tip',
      amount: amountInUSD,
      amountBDT: amountInBDT,
      balanceAfter: 0,
      description: `Tip (৳${amountInBDT} / $${amountInUSD.toFixed(2)}) received for "${toolTitle}" from ${senderName || senderEmail || 'Supporter'}${message ? `: "${message}"` : ''}`,
      createdAt: Date.now(),
      status: 'completed',
      codeId: codeId || '',
    });
  }

  // 3. Update total tips on tool
  if (codeId) {
    await update(ref(database, `codes/${codeId}`), {
      totalTipsEarned: increment(amountInUSD),
      totalTipsEarnedBDT: increment(amountInBDT),
    });
  }

  return tipData;
}

/**
 * Record Pay-per-Run Micro Reward for Creator
 * Gives creator $0.005 on each unique run if runner is not the creator
 */
export async function recordToolRunReward(codeId: string, creatorUid?: string): Promise<void> {
  try {
    if (!codeId) return;

    // Increment runCount on code item
    await update(ref(database, `codes/${codeId}`), {
      runCount: increment(1),
    });

    // Credit $0.005 micro-reward to creator
    if (creatorUid) {
      const reward = 0.005;
      await update(ref(database, `users/${creatorUid}`), {
        creatorBalance: increment(reward),
        creatorEarnings: increment(reward),
      });
    }
  } catch (err) {
    console.warn('Silent notice: Pay-per-run reward update skipped', err);
  }
}

/**
 * Follow or Unfollow Creator
 */
export async function toggleFollowCreator(followerUid: string, creatorUid: string): Promise<boolean> {
  const followRef = ref(database, `followers/${creatorUid}/${followerUid}`);
  const snap = await get(followRef);

  if (snap.exists()) {
    await set(followRef, null);
    return false; // Unfollowed
  } else {
    await set(followRef, { followedAt: Date.now() });
    return true; // Followed
  }
}

export async function checkIsFollowing(followerUid: string, creatorUid: string): Promise<boolean> {
  if (!followerUid || !creatorUid) return false;
  const followRef = ref(database, `followers/${creatorUid}/${followerUid}`);
  const snap = await get(followRef);
  return snap.exists();
}

export async function getCreatorFollowersCount(creatorUid: string): Promise<number> {
  if (!creatorUid) return 0;
  const followRef = ref(database, `followers/${creatorUid}`);
  const snap = await get(followRef);
  if (!snap.exists()) return 0;
  return Object.keys(snap.val()).length;
}
