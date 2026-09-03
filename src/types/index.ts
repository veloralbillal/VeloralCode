export type UserRole = 'user' | 'seller' | 'creator' | 'admin';
export type UserPlan = 'free' | 'premium';

export interface CreatorDocumentSubmission {
  documentType: 'nid' | 'passport' | 'driving_license' | 'student_id' | 'trade_license';
  legalFullName: string;
  documentNumber: string;
  frontImageUrl?: string;
  backImageUrl?: string;
  faceImageUrl?: string;
  submittedAt: number;
  reviewedAt?: number;
  reviewedBy?: string;
  rejectionReason?: string;
  status: 'not_submitted' | 'pending' | 'verified' | 'rejected';
}

export interface UserProfile {
  userId: string;
  numericUid?: string;
  name: string;
  email: string;
  role: UserRole;
  plan?: UserPlan;
  planExpiresAt?: number | null;
  isLifetime?: boolean;
  bio?: string;
  phone?: string;
  createdAt: number;
  updatedAt?: number;
  status: 'active' | 'suspended';
  redeemedKey?: string;
  redeemedAt?: number;
  coinsBalance?: number;
  totalCoinsEarned?: number;
  totalCoinsSpent?: number;
  sellerNotes?: string;
  creatorEarnings?: number;
  creatorEarningsBDT?: number;
  creatorBalance?: number;
  creatorWithdrawalAddress?: string;
  creatorBio?: string;
  creatorSpecialty?: string;
  creatorDisplayName?: string;
  creatorUsername?: string;
  creatorSlug?: string;
  creatorAvatarUrl?: string;
  creatorSocialGithub?: string;
  creatorSocialWebsite?: string;
  creatorSocialTelegram?: string;
  creatorVerificationStatus?: 'not_submitted' | 'pending' | 'verified' | 'rejected';
  creatorKyc?: CreatorDocumentSubmission;
  creatorPayoutModel?: 'pool' | 'fixed';
  creatorPayoutModelLocked?: boolean;
  creatorPayoutModelSetupAt?: number;
}

export interface LicenseKey {
  id: string;
  key: string;
  plan: UserPlan;
  durationDays: number; // 0 = Lifetime, > 0 = validity in days
  status: 'active' | 'used' | 'revoked';
  createdAt: number;
  createdBy: string;
  creatorEmail?: string;
  creatorRole?: 'admin' | 'seller';
  coinsCost?: number;
  usedBy?: string;
  usedByEmail?: string;
  usedByNumericUid?: string;
  usedAt?: number;
  expiresAt?: number | null;
  note?: string;
}

export interface SellerPricingConfig {
  days7: number;
  days30: number;
  days90: number;
  days180: number;
  days365: number;
  lifetime: number;
  cost1Month?: number;
  cost3Month?: number;
  cost6Month?: number;
  cost1Year?: number;
  costLifetime?: number;
  updatedAt?: number;
  updatedBy?: string;
}

export interface SellerCoinTransaction {
  id: string;
  sellerUid: string;
  sellerEmail: string;
  type: 'credit' | 'debit';
  amount: number;
  balanceAfter: number;
  description: string;
  createdAt: number;
  createdBy: string;
  referenceId?: string;
}

export interface SellerReportStats {
  totalKeysGenerated: number;
  activeKeys: number;
  redeemedKeys: number;
  revokedKeys: number;
  totalCoinsSpent: number;
  currentCoinsBalance: number;
}

export interface AdminProfile {
  email: string;
  role: 'admin';
  status: 'active' | 'suspended';
}

export type SupportedLanguage =
  | 'HTML'
  | 'CSS'
  | 'JavaScript'
  | 'TypeScript'
  | 'JSON'
  | 'XML'
  | 'PHP'
  | 'Python'
  | 'Java'
  | 'C'
  | 'C++'
  | 'SQL'
  | 'Bash'
  | 'Markdown';

export type CodeCategory = string;

export interface CodeItem {
  id?: string;
  title: string;
  description: string;
  code: string;
  html?: string;
  css?: string;
  js?: string;
  language: SupportedLanguage;
  category: CodeCategory;
  version: string;
  tags: string[];
  status: 'published' | 'draft' | 'pending_approval' | 'rejected';
  plan?: 'free' | 'premium';
  createdAt: number;
  updatedAt: number;
  createdBy: string;
  creatorUid?: string;
  creatorName?: string;
  creatorEmail?: string;
  authorUid?: string;
  authorEmail?: string;
  creatorVerified?: boolean;
  creatorRole?: 'admin' | 'creator' | 'seller';
  views: number;
  runCount?: number;
  totalTipsEarned?: number;
  rejectionReason?: string;
  approvedAt?: number;
  approvedBy?: string;
  forkedFromId?: string;
  forkedFromTitle?: string;
  forkedFromAuthor?: string;
  averageRating?: number;
  ratingsCount?: number;
}

export interface ToolReview {
  id: string;
  codeId: string;
  userId: string;
  userName: string;
  userEmail: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: number;
  updatedAt?: number;
}

export interface ToolTipTransaction {
  id: string;
  codeId: string;
  toolTitle: string;
  senderUid: string;
  senderName: string;
  senderEmail: string;
  creatorUid: string;
  creatorEmail: string;
  amount: number; // USD amount
  amountBDT?: number; // BDT amount
  message?: string;
  createdAt: number;
}

export interface CodeSafetyReport {
  isSafe: boolean;
  score: number; // 0 to 100
  riskLevel: 'safe' | 'low' | 'medium' | 'high';
  flags: {
    type: 'danger' | 'warning' | 'info';
    message: string;
    detail?: string;
  }[];
}

export interface CreatorBadgeInfo {
  level: 'bronze' | 'silver' | 'gold' | 'diamond' | 'master';
  title: string;
  icon: string;
  color: string;
  perks: string[];
}

export interface CreatorTransaction {
  id: string;
  creatorUid: string;
  creatorEmail: string;
  type: 'earning' | 'withdrawal' | 'bonus' | 'adjustment' | 'tip';
  amount: number;
  amountBDT?: number;
  balanceAfter: number;
  description: string;
  adminNote?: string;
  createdAt: number;
  createdBy?: string;
  status: 'completed' | 'pending' | 'cancelled';
  codeId?: string;
}

export interface CreatorStats {
  totalUploads: number;
  liveTools: number;
  pendingApproval: number;
  rejectedTools: number;
  totalViews: number;
  walletBalance: number;
  totalEarnings: number;
  totalWithdrawn: number;
}

export interface DashboardStats {
  totalUsers: number;
  totalCodes: number;
  publishedCodes: number;
  draftCodes: number;
  totalViews: number;
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface UserLicenseHistoryItem {
  id: string;
  key: string;
  plan: UserPlan;
  durationDays: number;
  redeemedAt: number;
  expiresAt?: number | null;
  isLifetime?: boolean;
}

export interface UserBookmarkItem {
  codeId: string;
  title: string;
  category: string;
  language: string;
  bookmarkedAt: number;
}

export interface UserRecentActivityItem {
  codeId: string;
  title: string;
  language: string;
  category: string;
  action: 'viewed' | 'copied' | 'run' | 'downloaded';
  timestamp: number;
}

export interface AdminAnnouncement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'update' | 'alert' | 'event';
  isPinned?: boolean;
  createdAt: number;
  authorEmail?: string;
}

export interface FeatureRequest {
  id: string;
  userId: string;
  userEmail: string;
  userNumericUid?: string;
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'reviewed' | 'approved' | 'completed' | 'declined';
  createdAt: number;
  adminReply?: string;
}

export interface UserSessionInfo {
  id: string;
  browser: string;
  os: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  lastActive: number;
  isCurrent: boolean;
}

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

export interface SiteConfig {
  siteName: string;
  siteTagline: string;
  version: string;
  heroTitle: string;
  heroDescription: string;
  heroBadge: string;
  footerCopyright: string;
  telegramUsername?: string;
  whatsappNumber?: string;
  telegramCustomUrl?: string;
  whatsappCustomUrl?: string;
  contactMessageTemplate?: string;
  updatedAt?: number;
  updatedBy?: string;
}

export * from './banner';
export * from './event';
export * from './distribution';
