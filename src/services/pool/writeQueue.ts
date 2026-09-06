import { WriteTask } from './connectionPoolTypes';

class HighConcurrencyWriteQueue {
  private queue: WriteTask[] = [];
  private activeCount = 0;
  private readonly maxConcurrent = 10;
  private totalProcessed = 0;

  /**
   * Enqueue a write task with high-concurrency throttling
   */
  public enqueue<T>(key: string, execute: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const task: WriteTask = {
        id: `${key}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        key,
        execute,
        resolve,
        reject,
        retries: 0,
        createdAt: Date.now(),
      };

      this.queue.push(task);
      this.processNext();
    });
  }

  private async processNext(): Promise<void> {
    if (this.activeCount >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    const task = this.queue.shift();
    if (!task) return;

    this.activeCount++;

    try {
      const result = await task.execute();
      this.totalProcessed++;
      task.resolve(result);
    } catch (err: any) {
      if (task.retries < 2) {
        task.retries++;
        // Re-insert with slight exponential backoff
        setTimeout(() => {
          this.queue.unshift(task);
          this.processNext();
        }, task.retries * 200);
      } else {
        task.reject(err);
      }
    } finally {
      this.activeCount--;
      this.processNext();
    }
  }

  public getStats() {
    return {
      queuedWrites: this.queue.length,
      activeWrites: this.activeCount,
      processedWrites: this.totalProcessed,
      maxConcurrent: this.maxConcurrent,
    };
  }
}

export const writeQueue = new HighConcurrencyWriteQueue();
