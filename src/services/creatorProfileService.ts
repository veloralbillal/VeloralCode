import { ref, get, set, update } from 'firebase/database';
import { database } from './firebase';
import { CreatorDocumentSubmission, UserProfile } from '../types';

export interface CreatorPublicProfileData {
  displayName: string;
  bio?: string;
  specialty?: string;
  avatarUrl?: string;
  socialGithub?: string;
  socialWebsite?: string;
  socialTelegram?: string;
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

  // 1. Update User Profile in Realtime DB
  const userRef = ref(database, `users/${uid}`);
  await update(userRef, {
    name: cleanName,
    creatorDisplayName: cleanName,
    creatorBio: data.bio || '',
    creatorSpecialty: data.specialty || '',
    creatorAvatarUrl: data.avatarUrl || '',
    creatorSocialGithub: data.socialGithub || '',
    creatorSocialWebsite: data.socialWebsite || '',
    creatorSocialTelegram: data.socialTelegram || '',
    updatedAt: Date.now(),
  });

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
  }
): Promise<CreatorDocumentSubmission> {
  if (!uid) throw new Error('User ID is required');

  const kycData: CreatorDocumentSubmission = {
    documentType: submission.documentType,
    legalFullName: (submission.legalFullName || '').trim(),
    documentNumber: (submission.documentNumber || '').trim(),
    frontImageUrl: submission.frontImageUrl || '',
    backImageUrl: submission.backImageUrl || '',
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
