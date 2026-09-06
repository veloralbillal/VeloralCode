import { ref, onValue, off, DataSnapshot } from 'firebase/database';
import { database } from '../firebase';
import { PooledChannel } from './connectionPoolTypes';

class ListenerMultiplexer {
  private channels = new Map<string, PooledChannel>();
  private totalSubscribers = 0;
  private peakSubscribers = 0;

  /**
   * Subscribe to a Realtime Database path using connection pooling.
   * Only 1 physical socket listener is created per path regardless of how many subscribers exist.
   */
  public subscribe<T = any>(
    path: string,
    callback: (data: T) => void,
    onError?: (err: Error) => void
  ): () => void {
    let channel = this.channels.get(path);

    if (!channel) {
      channel = {
        path,
        subscribers: new Set(),
        errorHandlers: new Set(),
        latestData: null,
      };
      this.channels.set(path, channel);
      this.openChannel(channel);
    } else if (channel.cleanupTimer) {
      // Cancel pending teardown if a new subscriber joins
      clearTimeout(channel.cleanupTimer);
      channel.cleanupTimer = null;
    }

    channel.subscribers.add(callback);
    if (onError) channel.errorHandlers.add(onError);

    this.totalSubscribers++;
    if (this.totalSubscribers > this.peakSubscribers) {
      this.peakSubscribers = this.totalSubscribers;
    }

    // Immediately emit latest data if already cached in memory
    if (channel.latestData !== null) {
      try {
        callback(channel.latestData as T);
      } catch (err) {
        console.error(`[ConnectionPool] Error in immediate callback for ${path}:`, err);
      }
    }

    // Return un-subscriber
    return () => {
      this.unsubscribe(path, callback, onError);
    };
  }

  private openChannel(channel: PooledChannel): void {
    const dbRef = ref(database, channel.path);

    const onData = (snapshot: DataSnapshot) => {
      let parsedData: any = null;
      if (snapshot.exists()) {
        parsedData = snapshot.val();
      }
      channel.latestData = parsedData;

      // Broadcast to all pooled subscribers
      channel.subscribers.forEach((sub) => {
        try {
          sub(parsedData);
        } catch (err) {
          console.error(`[ConnectionPool] Subscriber callback error on ${channel.path}:`, err);
        }
      });
    };

    const onError = (err: Error) => {
      console.warn(`[ConnectionPool] Error on path ${channel.path}:`, err);
      channel.errorHandlers.forEach((handler) => {
        try {
          handler(err);
        } catch {}
      });
    };

    const unsub = onValue(dbRef, onData, onError);
    channel.unsubscribeRaw = () => {
      off(dbRef, 'value', unsub);
    };
  }

  private unsubscribe(
    path: string,
    callback: (data: any) => void,
    onError?: (err: Error) => void
  ): void {
    const channel = this.channels.get(path);
    if (!channel) return;

    channel.subscribers.delete(callback);
    if (onError) channel.errorHandlers.delete(onError);
    this.totalSubscribers = Math.max(0, this.totalSubscribers - 1);

    // If no subscribers left, debounce closing the connection by 10s to reuse on fast route changes
    if (channel.subscribers.size === 0) {
      channel.cleanupTimer = setTimeout(() => {
        if (channel.subscribers.size === 0) {
          if (channel.unsubscribeRaw) {
            channel.unsubscribeRaw();
          }
          this.channels.delete(path);
        }
      }, 10000);
    }
  }

  public getStats() {
    return {
      activeChannels: this.channels.size,
      totalSubscribers: this.totalSubscribers,
      peakSubscribers: this.peakSubscribers,
      paths: Array.from(this.channels.keys()),
    };
  }
}

export const listenerMultiplexer = new ListenerMultiplexer();
