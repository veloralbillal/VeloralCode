export type UserRole = 'user' | 'admin';
export type UserPlan = 'free' | 'premium';

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
}

export interface LicenseKey {
  id: string;
  key: string;
  plan: UserPlan;
  durationDays: number; // 0 = Lifetime, > 0 = validity in days
  status: 'active' | 'used' | 'revoked';
  createdAt: number;
  createdBy: string;
  usedBy?: string;
  usedByEmail?: string;
  usedByNumericUid?: string;
  usedAt?: number;
  expiresAt?: number | null;
  note?: string;
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
  language: SupportedLanguage;
  category: CodeCategory;
  version: string;
  tags: string[];
  status: 'published' | 'draft';
  createdAt: number;
  updatedAt: number;
  createdBy: string;
  creatorEmail?: string;
  views: number;
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
