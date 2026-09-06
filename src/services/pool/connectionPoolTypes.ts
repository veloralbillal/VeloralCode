export interface PoolMetrics {
  activeChannels: number;
  totalSubscribers: number;
  cacheHits: number;
  cacheMisses: number;
  queuedWrites: number;
  processedWrites: number;
  peakConcurrentSubscribers: number;
  isHighLoadProtected: boolean;
}

export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
}

export interface WriteTask {
  id: string;
  key: string;
  execute: () => Promise<any>;
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
  retries: number;
  createdAt: number;
}

export interface PooledChannel<T = any> {
  path: string;
  subscribers: Set<(data: T) => void>;
  errorHandlers: Set<(err: Error) => void>;
  latestData: T | null;
  unsubscribeRaw?: () => void;
  cleanupTimer?: ReturnType<typeof setTimeout> | null;
}

export interface PoolLogEntry {
  id: string;
  timestamp: number;
  type: 'subscribe' | 'cache_hit' | 'cache_miss' | 'write' | 'purge' | 'spike';
  message: string;
  path?: string;
  latencyMs?: number;
}

export interface IndexRuleItem {
  collection: string;
  indexes: string[];
  purpose: string;
  queryPattern: string;
  priority: 'critical' | 'high' | 'medium';
  frequency: string;
}
