export interface ShortUrl {
  id: string; // usually same as slug
  slug: string; // e.g. "x9k2p1" or custom alias
  targetUrl: string; // full original URL
  title?: string;
  createdAt: number;
  createdBy: string; // userId or 'guest'
  creatorEmail?: string;
  clicks: number;
  lastClickedAt?: number;
  expiresAt?: number | null;
  password?: string | null;
  enabled: boolean;
  adMode?: 'default' | 'enabled' | 'direct';
}

export interface AdZoneItem {
  enabled: boolean;
  type: 'banner' | 'html';
  imageUrl: string;
  clickUrl: string;
  htmlCode?: string;
  title?: string;
  description?: string;
}

export interface ShortenerAdsConfig {
  globalAdMode: 'interstitial' | 'direct'; // interstitial = show ads & countdown; direct = instant redirect
  countdownSeconds: number; // e.g. 5
  allowEarlySkip: boolean;
  noticeText?: string;
  headerBanner: AdZoneItem;
  middleAd: AdZoneItem;
  footerBanner: AdZoneItem;
  lastUpdated: number;
}

export const DEFAULT_ADS_CONFIG: ShortenerAdsConfig = {
  globalAdMode: 'interstitial',
  countdownSeconds: 5,
  allowEarlySkip: false,
  noticeText: 'Your destination link is being prepared. Please wait a few seconds...',
  headerBanner: {
    enabled: true,
    type: 'banner',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
    clickUrl: 'https://veloralbillal.top',
    title: 'Veloral Developer Toolkit - Explore Code Snippets',
    description: 'Get verified codes, scripts, and production-ready tools for web apps.',
  },
  middleAd: {
    enabled: true,
    type: 'banner',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    clickUrl: 'https://veloralbillal.top',
    title: 'Grow Your Business With Veloral Solutions',
    description: 'Custom software, API integration, and digital growth services.',
  },
  footerBanner: {
    enabled: false,
    type: 'banner',
    imageUrl: '',
    clickUrl: '',
    title: '',
  },
  lastUpdated: Date.now(),
};
