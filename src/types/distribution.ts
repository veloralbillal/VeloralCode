export type CreatorPayoutModel = 'pool' | 'fixed';

export interface PlatformDistributionSettings {
  minWithdrawalBDT: number;
  fixedRatePerDownloadBDT: number;
  poolSharePercentage: number;
  updatedAt?: number;
  updatedBy?: string;
}

export interface CodeInteractionLog {
  id: string;
  codeId: string;
  toolTitle: string;
  creatorUid: string;
  creatorEmail: string;
  userUid: string;
  userEmail: string;
  actionType: 'copy' | 'download';
  isPaidSubscriber: boolean;
  earningAmountBDT: number;
  earningAmountUSD: number;
  isEligibleForPayout: boolean;
  ineligibilityReason?: 'own_code' | 'free_user' | 'duplicate_user' | 'unsupported_model';
  payoutModelApplied?: CreatorPayoutModel;
  timestamp: number;
}

export interface DistributionReportSummary {
  totalCopies: number;
  totalDownloads: number;
  totalUniquePaidActions: number;
  totalEarningsBDT: number;
  totalEarningsUSD: number;
  topTools: {
    codeId: string;
    title: string;
    copies: number;
    downloads: number;
    totalEarningsBDT: number;
  }[];
  recentLogs: CodeInteractionLog[];
}
