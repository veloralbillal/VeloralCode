import { ref, get, set, push, update } from 'firebase/database';
import { database } from './firebase';
import { 
  CreatorPayoutModel, 
  PlatformDistributionSettings, 
  CodeInteractionLog, 
  DistributionReportSummary 
} from '../types/distribution';
import { USD_TO_BDT_RATE } from '../utils/currency';

export const DEFAULT_DISTRIBUTION_SETTINGS: PlatformDistributionSettings = {
  minWithdrawalBDT: 500, // ৳500 default minimum withdrawal
  fixedRatePerDownloadBDT: 3, // ৳3 per unique download/copy
  poolSharePercentage: 40, // 40% of subscription pool
};

/**
 * Fetch platform-wide distribution & withdrawal settings
 */
export async function getPlatformDistributionSettings(): Promise<PlatformDistributionSettings> {
  try {
    const sRef = ref(database, 'platformSettings/distribution');
    const snap = await get(sRef);
    if (snap.exists()) {
      const val = snap.val();
      return {
        minWithdrawalBDT: Number(val.minWithdrawalBDT) || DEFAULT_DISTRIBUTION_SETTINGS.minWithdrawalBDT,
        fixedRatePerDownloadBDT: Number(val.fixedRatePerDownloadBDT) || DEFAULT_DISTRIBUTION_SETTINGS.fixedRatePerDownloadBDT,
        poolSharePercentage: Number(val.poolSharePercentage) || DEFAULT_DISTRIBUTION_SETTINGS.poolSharePercentage,
        updatedAt: val.updatedAt,
        updatedBy: val.updatedBy,
      };
    }
  } catch (err) {
    console.warn('Error reading platform distribution settings:', err);
  }
  return DEFAULT_DISTRIBUTION_SETTINGS;
}

/**
 * Update platform distribution and minimum withdrawal settings (Admin only)
 */
export async function updatePlatformDistributionSettings(
  settings: Partial<PlatformDistributionSettings>,
  adminEmail: string = 'Admin'
): Promise<PlatformDistributionSettings> {
  const current = await getPlatformDistributionSettings();
  const updated: PlatformDistributionSettings = {
    ...current,
    ...settings,
    updatedAt: Date.now(),
    updatedBy: adminEmail,
  };

  const sRef = ref(database, 'platformSettings/distribution');
  await set(sRef, updated);
  return updated;
}

/**
 * Creator permanently selects their payout model (Option 1: Pool or Option 2: Fixed Rate)
 * Once setup, it cannot be changed (Permanent & Locked)
 */
export async function setCreatorPayoutModel(
  creatorUid: string,
  model: CreatorPayoutModel,
  userEmail?: string
): Promise<void> {
  if (!creatorUid && !userEmail) throw new Error('Creator ID or Email is required');

  let targetUid = creatorUid;
  let uRef = ref(database, `users/${targetUid}`);
  let snap = targetUid ? await get(uRef) : null;

  // If not found by targetUid, check users by email
  if ((!snap || !snap.exists()) && userEmail) {
    try {
      const cleanEmail = userEmail.toLowerCase().trim();
      const usersSnap = await get(ref(database, 'users'));
      if (usersSnap.exists()) {
        const allUsers = usersSnap.val();
        for (const k of Object.keys(allUsers)) {
          if (allUsers[k]?.email && allUsers[k].email.toLowerCase().trim() === cleanEmail) {
            targetUid = k;
            uRef = ref(database, `users/${targetUid}`);
            snap = await get(uRef);
            break;
          }
        }
      }
    } catch (e) {
      console.warn('Error finding user by email:', e);
    }
  }

  const uData = snap && snap.exists() ? snap.val() : {};
  if (uData.creatorPayoutModelLocked && uData.creatorPayoutModel) {
    throw new Error('Earning distribution model has already been locked and cannot be changed.');
  }

  const payload = {
    creatorPayoutModel: model,
    creatorPayoutModelLocked: true,
    creatorPayoutModelSetupAt: Date.now(),
    updatedAt: Date.now(),
  };

  if (snap && snap.exists()) {
    await update(uRef, payload);
  } else if (targetUid) {
    await set(uRef, {
      userId: targetUid,
      email: userEmail || '',
      role: 'creator',
      status: 'active',
      ...payload,
    });
  }

  // Also sync to creators/${targetUid} if index exists
  if (targetUid) {
    try {
      const cRef = ref(database, `creators/${targetUid}`);
      const cSnap = await get(cRef);
      if (cSnap.exists()) {
        await update(cRef, payload);
      }
    } catch (e) {
      // Non-blocking
    }
  }
}

interface TrackCodeActionParams {
  codeId: string;
  toolTitle: string;
  creatorUid?: string;
  creatorEmail?: string;
  userUid?: string;
  userEmail?: string;
  isPremium?: boolean;
  actionType: 'copy' | 'download';
}

/**
 * Track user copy/download with Anti-Cheating Rules:
 * Rule 1: Unique User Only (একই ইউজারের ১ বারই কাউন্ট)
 * Rule 2: No Earning From Own Code (নিজের কোডে কোনো আর্নিং নেই)
 * Rule 3: Paid Subscription Only (শুধুমাত্র পেইড সাবস্ক্রিপশন থাকলে আর্নিং)
 */
export async function trackToolCodeAction(params: TrackCodeActionParams): Promise<{
  isEligibleForPayout: boolean;
  reason?: string;
  earningBDT: number;
}> {
  const {
    codeId,
    toolTitle,
    creatorUid,
    creatorEmail,
    userUid,
    userEmail,
    isPremium = false,
    actionType,
  } = params;

  if (!codeId) return { isEligibleForPayout: false, earningBDT: 0 };

  const now = Date.now();
  const settings = await getPlatformDistributionSettings();

  // Rule 2: Check Own Code
  const isOwnCode = Boolean(
    (userUid && creatorUid && userUid === creatorUid) ||
    (userEmail && creatorEmail && userEmail.toLowerCase() === creatorEmail.toLowerCase())
  );

  // Rule 3: Check Paid Subscription
  const isPaidSubscriber = Boolean(isPremium);

  // Rule 1: Check Unique User Interaction
  let isDuplicate = false;
  if (userUid) {
    try {
      const interactionRef = ref(database, `toolUserInteractions/${codeId}_${userUid}`);
      const interSnap = await get(interactionRef);
      if (interSnap.exists()) {
        isDuplicate = true;
      }
    } catch {
      // Continue safely
    }
  }

  let isEligible = false;
  let ineligibilityReason: CodeInteractionLog['ineligibilityReason'] | undefined;

  if (isOwnCode) {
    isEligible = false;
    ineligibilityReason = 'own_code';
  } else if (!isPaidSubscriber) {
    isEligible = false;
    ineligibilityReason = 'free_user';
  } else if (isDuplicate) {
    isEligible = false;
    ineligibilityReason = 'duplicate_user';
  } else {
    isEligible = true;
  }

  let earningBDT = 0;
  let earningUSD = 0;
  let payoutModel: CreatorPayoutModel = 'fixed';

  if (isEligible && creatorUid) {
    try {
      // Mark interaction to prevent repeat duplicate earnings
      if (userUid) {
        const interRef = ref(database, `toolUserInteractions/${codeId}_${userUid}`);
        await set(interRef, {
          firstActionAt: now,
          actionType,
          userEmail: userEmail || '',
        });
      }

      // Fetch creator details
      const cRef = ref(database, `users/${creatorUid}`);
      const cSnap = await get(cRef);
      if (cSnap.exists()) {
        const cData = cSnap.val();
        payoutModel = cData.creatorPayoutModel || 'fixed';

        if (payoutModel === 'fixed') {
          earningBDT = settings.fixedRatePerDownloadBDT || 3;
          earningUSD = parseFloat((earningBDT / USD_TO_BDT_RATE).toFixed(4));

          const currentBal = Number(cData.creatorBalance || 0);
          const currentEarn = Number(cData.creatorEarnings || 0);
          const newBal = currentBal + earningUSD;
          const newEarn = currentEarn + earningUSD;

          // Credit wallet
          await update(cRef, {
            creatorBalance: newBal,
            creatorEarnings: newEarn,
            updatedAt: now,
          });

          // Log transaction
          const txRef = push(ref(database, 'creatorTransactions'));
          await set(txRef, {
            id: txRef.key,
            creatorUid,
            creatorEmail: creatorEmail || cData.email || '',
            type: 'earning',
            amount: earningUSD,
            amountBDT: earningBDT,
            balanceAfter: newBal,
            description: `Subscriber Royalty: ${actionType === 'copy' ? 'Code Copy' : 'File Download'} on "${toolTitle}" (BDT: ৳${earningBDT})`,
            status: 'completed',
            createdAt: now,
            codeId,
          });
        } else {
          // Pool Share Model: Record qualified pool point for monthly pool
          const currentPoolActions = Number(cData.creatorPoolActions || 0);
          await update(cRef, {
            creatorPoolActions: currentPoolActions + 1,
            updatedAt: now,
          });
        }
      }
    } catch (e) {
      console.warn('Error crediting creator earnings:', e);
    }
  }

  // Record Interaction Log
  try {
    const logRef = push(ref(database, 'codeInteractionLogs'));
    const logEntry: CodeInteractionLog = {
      id: logRef.key as string,
      codeId,
      toolTitle: toolTitle || 'Untitled Tool',
      creatorUid: creatorUid || '',
      creatorEmail: creatorEmail || '',
      userUid: userUid || 'anonymous',
      userEmail: userEmail || 'anonymous',
      actionType,
      isPaidSubscriber,
      earningAmountBDT: earningBDT,
      earningAmountUSD: earningUSD,
      isEligibleForPayout: isEligible,
      ineligibilityReason,
      payoutModelApplied: isEligible ? payoutModel : undefined,
      timestamp: now,
    };
    await set(logRef, logEntry);
  } catch (err) {
    console.warn('Error recording code interaction log:', err);
  }

  return {
    isEligibleForPayout: isEligible,
    reason: ineligibilityReason,
    earningBDT,
  };
}

/**
 * Fetch download/copy logs and generate analytics report (Daily, Weekly, Custom Range)
 * Optionally filter by creatorUid or creatorEmail
 */
export async function fetchDistributionReports(
  filter: 'daily' | 'weekly' | 'custom',
  customRange?: { start: number; end: number },
  creatorFilter?: { uid?: string; email?: string }
): Promise<DistributionReportSummary> {
  const now = Date.now();
  let startTime = 0;
  let endTime = now;

  if (filter === 'daily') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    startTime = today.getTime();
  } else if (filter === 'weekly') {
    startTime = now - 7 * 24 * 60 * 60 * 1000;
  } else if (filter === 'custom' && customRange) {
    startTime = customRange.start;
    endTime = customRange.end;
  }

  try {
    const logsRef = ref(database, 'codeInteractionLogs');
    const snap = await get(logsRef);
    if (!snap.exists()) {
      return {
        totalCopies: 0,
        totalDownloads: 0,
        totalUniquePaidActions: 0,
        totalEarningsBDT: 0,
        totalEarningsUSD: 0,
        topTools: [],
        recentLogs: [],
      };
    }

    const val = snap.val();
    let allLogs: CodeInteractionLog[] = Object.keys(val).map((k) => ({
      id: k,
      ...val[k],
    }));

    // If creator filter is specified, isolate to this creator's tools
    if (creatorFilter && (creatorFilter.uid || creatorFilter.email)) {
      const targetUid = creatorFilter.uid;
      const targetEmail = creatorFilter.email?.toLowerCase().trim();
      allLogs = allLogs.filter((l) => {
        if (targetUid && l.creatorUid === targetUid) return true;
        if (targetEmail && l.creatorEmail && l.creatorEmail.toLowerCase().trim() === targetEmail) return true;
        return false;
      });
    }

    const filtered = allLogs.filter(
      (l) => l.timestamp >= startTime && l.timestamp <= endTime
    );

    let totalCopies = 0;
    let totalDownloads = 0;
    let totalUniquePaidActions = 0;
    let totalEarningsBDT = 0;
    let totalEarningsUSD = 0;

    const toolStatsMap: Record<string, { title: string; copies: number; downloads: number; earningsBDT: number }> = {};

    filtered.forEach((log) => {
      if (log.actionType === 'copy') totalCopies++;
      if (log.actionType === 'download') totalDownloads++;
      if (log.isEligibleForPayout) {
        totalUniquePaidActions++;
        totalEarningsBDT += log.earningAmountBDT || 0;
        totalEarningsUSD += log.earningAmountUSD || 0;
      }

      if (!toolStatsMap[log.codeId]) {
        toolStatsMap[log.codeId] = {
          title: log.toolTitle,
          copies: 0,
          downloads: 0,
          earningsBDT: 0,
        };
      }
      if (log.actionType === 'copy') toolStatsMap[log.codeId].copies++;
      if (log.actionType === 'download') toolStatsMap[log.codeId].downloads++;
      if (log.isEligibleForPayout) {
        toolStatsMap[log.codeId].earningsBDT += log.earningAmountBDT || 0;
      }
    });

    const topTools = Object.keys(toolStatsMap)
      .map((codeId) => ({
        codeId,
        title: toolStatsMap[codeId].title,
        copies: toolStatsMap[codeId].copies,
        downloads: toolStatsMap[codeId].downloads,
        totalEarningsBDT: toolStatsMap[codeId].earningsBDT,
      }))
      .sort((a, b) => (b.copies + b.downloads) - (a.copies + a.downloads))
      .slice(0, 10);

    const sortedLogs = filtered.sort((a, b) => b.timestamp - a.timestamp).slice(0, 50);

    return {
      totalCopies,
      totalDownloads,
      totalUniquePaidActions,
      totalEarningsBDT,
      totalEarningsUSD: parseFloat(totalEarningsUSD.toFixed(2)),
      topTools,
      recentLogs: sortedLogs,
    };
  } catch (err) {
    console.warn('Error generating distribution report:', err);
    return {
      totalCopies: 0,
      totalDownloads: 0,
      totalUniquePaidActions: 0,
      totalEarningsBDT: 0,
      totalEarningsUSD: 0,
      topTools: [],
      recentLogs: [],
    };
  }
}
