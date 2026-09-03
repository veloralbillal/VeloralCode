import { ref, get, set, update } from 'firebase/database';
import { database } from './firebase';
import { CreatorDocumentSubmission, UserProfile } from '../types';

export interface CreatorPublicProfileData {
  displayName: string;
  creatorUsername?: string;
  bio?: string;
  specialty?: string;
  avatarUrl?: string;
  socialGithub?: string;
  socialWebsite?: string;
  socialTelegram?: string;
}

/**
 * Generate a safe slug from a name or email
 */
export function slugifyCreatorHandle(input: string): string {
  if (!input) return 'creator';
  return input
    .toLowerCase()
    .trim()
    .replace(/@.*$/, '') // Strip @domain if email
    .replace(/[^a-z0-9_-]/g, '')
    .slice(0, 30);
}

/**
 * Generate shareable URL for a creator
 */
export function getCreatorShareableUrl(userProfile: UserProfile | null, uid?: string): {
  fullUrl: string;
  displayUrl: string;
  shortPath: string;
  handle: string;
} {
  const handle = 
    userProfile?.creatorUsername?.trim() ||
    userProfile?.creatorSlug?.trim() ||
    slugifyCreatorHandle(userProfile?.creatorDisplayName || userProfile?.name || userProfile?.email || uid || 'creator');

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://veloralbillal.top';
  const shortPath = `/creator/${handle}`;
  const fullUrl = `${origin}${shortPath}`;
  const displayUrl = `${origin.replace(/^https?:\/\//, '')}/creator/${handle}`;

  return {
    fullUrl,
    displayUrl,
    shortPath,
    handle,
  };
}

/**
 * Update Creator's Public Profile Name and Details
 * Also syncs the updated name across all uploaded tools in Firebase
 */
export async function updateCreatorProfile(
  uid: string,
  data: CreatorPublicProfileData
): Promise<void> {
  if (!uid) throw new Error('User ID is required');

  const cleanName = (data.displayName || '').trim();
  if (!cleanName) {
    throw new Error('Creator public name cannot be empty');
  }

  const updates: Record<string, any> = {
    name: cleanName,
    creatorDisplayName: cleanName,
    creatorBio: data.bio || '',
    creatorSpecialty: data.specialty || '',
    creatorAvatarUrl: data.avatarUrl || '',
    creatorSocialGithub: data.socialGithub || '',
    creatorSocialWebsite: data.socialWebsite || '',
    creatorSocialTelegram: data.socialTelegram || '',
    updatedAt: Date.now(),
  };

  if (data.creatorUsername) {
    const cleanUsername = slugifyCreatorHandle(data.creatorUsername);
    if (cleanUsername) {
      updates.creatorUsername = cleanUsername;
      updates.creatorSlug = cleanUsername;
      // Also register index
      try {
        await set(ref(database, `creatorSlugs/${cleanUsername}`), uid);
      } catch (err) {
        console.warn('Could not set slug index', err);
      }
    }
  }

  // 1. Update User Profile in Realtime DB
  const userRef = ref(database, `users/${uid}`);
  await update(userRef, updates);

  // 2. Synchronize the new creator name across all their uploaded codes/tools
  try {
    const codesRef = ref(database, 'codes');
    const snap = await get(codesRef);
    if (snap.exists()) {
      const allCodes = snap.val();
      const updatePromises: Promise<any>[] = [];

      for (const [codeId, item] of Object.entries<any>(allCodes)) {
        if (item.creatorUid === uid) {
          updatePromises.push(
            update(ref(database, `codes/${codeId}`), {
              creatorName: cleanName,
            })
          );
        }
      }

      await Promise.all(updatePromises);
    }
  } catch (err) {
    console.warn('Could not batch sync creator name to codes', err);
  }
}

/**
 * Submit Creator Document / KYC for Identity Verification
 */
export async function submitCreatorKyc(
  uid: string,
  submission: {
    documentType: 'nid' | 'passport' | 'driving_license' | 'student_id' | 'trade_license';
    legalFullName: string;
    documentNumber: string;
    frontImageUrl?: string;
    backImageUrl?: string;
    faceImageUrl?: string;
  }
): Promise<CreatorDocumentSubmission> {
  if (!uid) throw new Error('User ID is required');

  const kycData: CreatorDocumentSubmission = {
    documentType: submission.documentType,
    legalFullName: (submission.legalFullName || '').trim(),
    documentNumber: (submission.documentNumber || '').trim(),
    frontImageUrl: submission.frontImageUrl || '',
    backImageUrl: submission.backImageUrl || '',
    faceImageUrl: submission.faceImageUrl || '',
    submittedAt: Date.now(),
    status: 'pending',
  };

  // Update in user profile
  const userRef = ref(database, `users/${uid}`);
  await update(userRef, {
    creatorVerificationStatus: 'pending',
    creatorKyc: kycData,
    updatedAt: Date.now(),
  });

  // Also save in a dedicated list for admin review
  const adminKycRef = ref(database, `creatorVerifications/${uid}`);
  await set(adminKycRef, {
    uid,
    ...kycData,
  });

  return kycData;
}

/**
 * Fetch all KYC Document Submissions (for Admin review)
 */
export async function fetchAllKycSubmissions(): Promise<any[]> {
  try {
    const kycRef = ref(database, 'creatorVerifications');
    const snap = await get(kycRef);
    if (!snap.exists()) return [];
    const val = snap.val();
    return Object.keys(val).map((k) => ({
      uid: k,
      ...val[k],
    }));
  } catch (err) {
    console.error('Error fetching KYC submissions:', err);
    return [];
  }
}

/**
 * Fetch a creator's public verification info by UID
 */
export async function fetchCreatorVerificationInfo(uid: string): Promise<{
  isVerified: boolean;
  status: 'not_submitted' | 'pending' | 'verified' | 'rejected';
  creatorName: string;
  rejectionReason?: string;
}> {
  if (!uid) {
    return { isVerified: false, status: 'not_submitted', creatorName: '' };
  }
  try {
    const snap = await get(ref(database, `users/${uid}`));
    if (snap.exists()) {
      const u = snap.val();
      const status = u.creatorVerificationStatus || u.creatorKyc?.status || 'not_submitted';
      return {
        isVerified: status === 'verified',
        status: status,
        creatorName: u.creatorDisplayName || u.name || '',
        rejectionReason: u.creatorKyc?.rejectionReason,
      };
    }
  } catch (err) {
    console.warn('Error fetching creator verification info:', err);
  }
  return { isVerified: false, status: 'not_submitted', creatorName: '' };
}

/**
 * Review & Update KYC Status (Admin action)
 */
export async function reviewCreatorKyc(
  creatorUid: string,
  status: 'verified' | 'rejected',
  rejectionReason = '',
  reviewerName = 'Admin'
): Promise<void> {
  const timestamp = Date.now();
  const isVerified = status === 'verified';

  // Update in user profile
  const userRef = ref(database, `users/${creatorUid}`);
  await update(userRef, {
    creatorVerificationStatus: status,
    'creatorKyc/status': status,
    'creatorKyc/reviewedAt': timestamp,
    'creatorKyc/reviewedBy': reviewerName,
    'creatorKyc/rejectionReason': rejectionReason,
    updatedAt: timestamp,
  });

  // Update in verifications table
  const adminKycRef = ref(database, `creatorVerifications/${creatorUid}`);
  await update(adminKycRef, {
    status,
    reviewedAt: timestamp,
    reviewedBy: reviewerName,
    rejectionReason,
  });

  // Batch update creatorVerified on all codes authored by this creator
  try {
    const codesRef = ref(database, 'codes');
    const snap = await get(codesRef);
    if (snap.exists()) {
      const allCodes = snap.val();
      const updatePromises: Promise<any>[] = [];

      for (const [codeId, item] of Object.entries<any>(allCodes)) {
        if (item.creatorUid === creatorUid || item.createdBy === creatorUid) {
          updatePromises.push(
            update(ref(database, `codes/${codeId}`), {
              creatorVerified: isVerified,
            })
          );
        }
      }

      await Promise.all(updatePromises);
    }
  } catch (err) {
    console.warn('Could not sync creatorVerified flag to codes', err);
  }
}

/**
 * Update creator's unique vanity handle / username (e.g. 'veloralbillal')
 */
export async function updateCreatorHandle(uid: string, rawHandle: string): Promise<string> {
  if (!uid) throw new Error('Creator User ID is required');
  const cleanHandle = slugifyCreatorHandle(rawHandle);
  if (!cleanHandle || cleanHandle.length < 3) {
    throw new Error('Username must be at least 3 alphanumeric characters (letters, numbers, underscores)');
  }

  // Check if handle is a reserved keyword
  const reservedWords = ['upload', 'tools', 'wallet', 'reports', 'profile', 'edit', 'admin', 'seller', 'login', 'code', 'codes', 'api', 'dashboard'];
  if (reservedWords.includes(cleanHandle)) {
    throw new Error(`The username '${cleanHandle}' is a reserved system route. Please choose another username.`);
  }

  // Check if taken by another user
  const slugRef = ref(database, `creatorSlugs/${cleanHandle}`);
  const slugSnap = await get(slugRef);
  if (slugSnap.exists()) {
    const existingUid = slugSnap.val();
    if (existingUid !== uid) {
      throw new Error(`The handle '@${cleanHandle}' is already claimed by another creator.`);
    }
  }

  // Update user profile and slug index
  await update(ref(database, `users/${uid}`), {
    creatorUsername: cleanHandle,
    creatorSlug: cleanHandle,
    updatedAt: Date.now(),
  });

  await set(slugRef, uid);
  return cleanHandle;
}

/**
 * Resolve a creator by UID or custom slug/username (e.g. 'veloralbillal')
 */
export async function resolveCreatorBySlugOrUid(
  identifier: string
): Promise<{ profile: UserProfile; uid: string } | null> {
  if (!identifier) return null;
  const raw = identifier.trim();
  const cleanSlug = slugifyCreatorHandle(raw);

  try {
    // 1. Check direct UID in users
    const directSnap = await get(ref(database, `users/${raw}`));
    if (directSnap.exists()) {
      const u = directSnap.val();
      return { profile: { userId: raw, ...u }, uid: raw };
    }

    // 2. Check creatorSlugs index
    if (cleanSlug) {
      const slugSnap = await get(ref(database, `creatorSlugs/${cleanSlug}`));
      if (slugSnap.exists()) {
        const targetUid = slugSnap.val();
        const userSnap = await get(ref(database, `users/${targetUid}`));
        if (userSnap.exists()) {
          return { profile: { userId: targetUid, ...userSnap.val() }, uid: targetUid };
        }
      }
    }

    // 3. Fallback scan across users collection for creatorUsername, creatorSlug, email prefix, or clean name
    const usersSnap = await get(ref(database, 'users'));
    if (usersSnap.exists()) {
      const allUsers = usersSnap.val();
      for (const [uid, val] of Object.entries<any>(allUsers)) {
        if (!val) continue;

        // Compare creatorUsername or creatorSlug
        if (val.creatorUsername && val.creatorUsername.toLowerCase() === cleanSlug) {
          return { profile: { userId: uid, ...val }, uid };
        }
        if (val.creatorSlug && val.creatorSlug.toLowerCase() === cleanSlug) {
          return { profile: { userId: uid, ...val }, uid };
        }

        // Compare email prefix (e.g. billalhossen from billalhossen.self@gmail.com)
        const emailPrefix = val.email ? val.email.split('@')[0].toLowerCase().replace(/[^a-z0-9_-]/g, '') : '';
        if (emailPrefix && emailPrefix === cleanSlug) {
          return { profile: { userId: uid, ...val }, uid };
        }

        // Compare display name slugified (e.g. "Veloral Billal" -> "veloralbillal")
        const nameSlug = slugifyCreatorHandle(val.creatorDisplayName || val.name || '');
        if (nameSlug && nameSlug === cleanSlug) {
          return { profile: { userId: uid, ...val }, uid };
        }

        // Numeric UID match
        if (val.numericUid && String(val.numericUid) === raw) {
          return { profile: { userId: uid, ...val }, uid };
        }
      }
    }
  } catch (err) {
    console.error('Error resolving creator by slug:', err);
  }

  return null;
}

