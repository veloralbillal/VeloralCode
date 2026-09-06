export interface PwaConfig {
  swEnabled: boolean;
  cacheVersion: string;
  cacheStrategy: 'staleWhileRevalidate' | 'networkFirst' | 'cacheFirst';
  offlineFallbackEnabled: boolean;
  userBannerEnabled: boolean;
  lastBustTimestamp: number;
  lastUpdatedBy?: string;
}

export interface SwStatusInfo {
  isSupported: boolean;
  isRegistered: boolean;
  state: 'installing' | 'waiting' | 'active' | 'redundant' | 'disabled' | 'none';
  scope: string;
  scriptURL: string;
  isControlling: boolean;
}

export interface CacheBucketInfo {
  name: string;
  itemCount: number;
}
