import { itemStore } from './itemStore.js';
import { QUEUE } from '../constants';

interface QueuedAdd {
  id: number;
  timestamp: number;
}

interface QueuedOperation {
  type: 'select' | 'deselect' | 'reorder';
  itemId: number;
  newIndex?: number;
  filter?: string;
  timestamp: number;
  resolve: (value: boolean) => void;
}

class RequestQueue {
  private addQueue: Map<number, QueuedAdd> = new Map();
  private operationQueue: Map<string, QueuedOperation> = new Map();

  private addInterval: ReturnType<typeof setInterval> | null = null;
  private operationInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.startProcessing();
  }

  private startProcessing(): void {
    this.addInterval = setInterval(() => {
      this.processAddQueue();
    }, QUEUE.ADD_BATCH_INTERVAL_MS);

    this.operationInterval = setInterval(() => {
      this.processOperationQueue();
    }, QUEUE.OPERATION_BATCH_INTERVAL_MS);
  }

  private processAddQueue(): void {
    if (this.addQueue.size === 0) return;

    const items = Array.from(this.addQueue.values())
      .sort((a, b) => a.timestamp - b.timestamp);

    for (const item of items) {
      itemStore.addItem(item.id);
    }

    console.log(`[Queue] Processed ${items.length} add operations`);
    this.addQueue.clear();
  }

  private processOperationQueue(): void {
    if (this.operationQueue.size === 0) return;

    const operations = Array.from(this.operationQueue.values())
      .sort((a, b) => a.timestamp - b.timestamp);

    for (const op of operations) {
      let result = false;

      switch (op.type) {
        case 'select':
          result = itemStore.selectItem(op.itemId);
          break;
        case 'deselect':
          result = itemStore.deselectItem(op.itemId);
          break;
        case 'reorder':
          if (op.newIndex !== undefined) {
            result = itemStore.reorderItem(op.itemId, op.newIndex, op.filter);
          }
          break;
      }

      op.resolve(result);
    }

    console.log(`[Queue] Processed ${operations.length} operations`);
    this.operationQueue.clear();
  }

  queueAdd(id: number): boolean {
    if (itemStore.itemExists(id) || this.addQueue.has(id)) {
      return false;
    }

    this.addQueue.set(id, {
      id,
      timestamp: Date.now(),
    });

    return true;
  }

  queueOperation(
    type: 'select' | 'deselect' | 'reorder',
    itemId: number,
    newIndex?: number,
    filter?: string
  ): Promise<boolean> {
    return new Promise((resolve) => {
      const key = `${type}-${itemId}`;

      this.operationQueue.set(key, {
        type,
        itemId,
        newIndex,
        filter,
        timestamp: Date.now(),
        resolve,
      });
    });
  }

  flushAddQueue(): void {
    this.processAddQueue();
  }

  flushOperationQueue(): void {
    this.processOperationQueue();
  }

  stop(): void {
    if (this.addInterval) clearInterval(this.addInterval);
    if (this.operationInterval) clearInterval(this.operationInterval);
  }
}

export const requestQueue = new RequestQueue();
