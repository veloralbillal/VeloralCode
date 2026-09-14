export type ThemePreset = 'dark_glass' | 'midnight_velvet' | 'cyber_neon' | 'rose_gold' | 'clean_minimal';

export type BlockType = 
  | 'LINK' 
  | 'SOCIAL_BAR' 
  | 'HEADER' 
  | 'EMBED_YOUTUBE' 
  | 'EMBED_SPOTIFY' 
  | 'EMBED_CALCOM' 
  | 'CALCULATOR_ROI' 
  | 'CONTACT_FORM'
  | 'EMBED_GITHUB'
  | 'NEWSLETTER'
  | 'PRODUCT_CARD'
  | 'COUNTDOWN'
  | 'PORTFOLIO_GRID'
  | 'TIP_JAR';

export interface SocialLinks {
  github?: string;
  twitter?: string;
  youtube?: string;
  instagram?: string;
  linkedin?: string;
  discord?: string;
  website?: string;
  email?: string;
}

export interface Block {
  id: string;
  type: BlockType;
  title: string;
  subtitle?: string;
  url?: string;
  icon?: string;
  config?: Record<string, any>;
  orderIndex: number;
  isActive: boolean;
  clickCount: number;
}

export interface Profile {
  id: string;
  userId: string;
  username: string; // Used for {username}.linkforge.app
  displayName: string;
  bio: string;
  avatarUrl: string;
  isVerified: boolean;
  tier: 'free' | 'pro';
  isGuest?: boolean;
  accountPassword?: string;
  isPublished?: boolean;
  
  // Customization
  themePreset: ThemePreset;
  accentColor: string;
  fontFamily: string;
  socialLinks: SocialLinks;
  
  // Custom Domain
  customDomain?: string;
  domainStatus?: 'PENDING_DNS' | 'VERIFYING' | 'ACTIVE' | 'INVALID_DNS';

  // SEO
  seoTitle?: string;
  seoDescription?: string;
  ogImageUrl?: string;
  robotsTxt?: string;

  // Blocks
  blocks: Block[];

  createdAt: string;
  updatedAt: string;
}

export interface CustomDomainRecord {
  id: string;
  domain: string;
  targetUsername: string;
  status: 'PENDING_DNS' | 'VERIFYING' | 'ACTIVE' | 'INVALID_DNS';
  sslConfigured: boolean;
  createdAt: string;
  lastCheckedAt?: string;
  errorReason?: string;
  cnameRecord: string;
  aRecord: string;
}

export interface AnalyticsData {
  pageViews: number;
  totalClicks: number;
  ctr: number;
  topReferrers: { source: string; count: number; percentage: number }[];
  deviceStats: { device: string; count: number; percentage: number }[];
  countryStats: { country: string; count: number; flag: string }[];
  recentClicks: { blockTitle: string; timestamp: string; location: string }[];
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'PRO_USER' | 'ADMIN' | 'SUPER_ADMIN';
  isSuspended: boolean;
  tier: 'free' | 'pro';
  username: string;
  createdAt: string;
  totalViews: number;
  totalClicks: number;
}
