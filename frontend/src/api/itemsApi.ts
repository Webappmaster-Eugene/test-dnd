import { API, TIMING } from '@/constants';
import type { PaginatedResponse, ThrottledFn, AddCallback } from '@/types';

const API_BASE = API.BASE_URL;

function createThrottle(fn: ThrottledFn, delay: number): ThrottledFn {
  let lastCall = 0;
  let pendingPromise: Promise<PaginatedResponse> | null = null;
  let pendingArgs: [number, number, string?] | null = null;

  return (offset: number, limit: number, filter?: string): Promise<PaginatedResponse> => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCall;

    if (timeSinceLastCall >= delay) {
      lastCall = now;
      return fn(offset, limit, filter);
    }

    pendingArgs = [offset, limit, filter];

    if (!pendingPromise) {
      pendingPromise = new Promise((resolve) => {
        setTimeout(() => {
          lastCall = Date.now();
          if (pendingArgs) {
            resolve(fn(...pendingArgs));
          }
          pendingPromise = null;
          pendingArgs = null;
        }, delay - timeSinceLastCall);
      });
    }

    return pendingPromise;
  };
}

class RequestBatcher {
  private addQueue: Set<number> = new Set();
  private addTimer: ReturnType<typeof setTimeout> | null = null;
  private pendingAddCallbacks: AddCallback[] = [];

  async queueAdd(id: number): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.addQueue.has(id)) {
        resolve(false);
        return;
      }
      
      this.addQueue.add(id);
      this.pendingAddCallbacks.push({ id, resolve });

      if (!this.addTimer) {
        this.addTimer = setTimeout(() => this.flushAddQueue(), TIMING.ADD_BATCH_DELAY_MS);
      }
    });
  }

  private async flushAddQueue(): Promise<void> {
    const items = Array.from(this.addQueue);
    const callbacks = [...this.pendingAddCallbacks];
    
    this.addQueue.clear();
    this.pendingAddCallbacks = [];
    this.addTimer = null;

    for (const item of items) {
      try {
        const response = await fetch(`${API_BASE}/items`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: item }),
        });
        
        const success = response.ok;
        callbacks
          .filter(cb => cb.id === item)
          .forEach(cb => cb.resolve(success));
      } catch {
        callbacks
          .filter(cb => cb.id === item)
          .forEach(cb => cb.resolve(false));
      }
    }
  }

  forceFlush(): void {
    if (this.addTimer) {
      clearTimeout(this.addTimer);
      this.flushAddQueue();
    }
  }
}

const batcher = new RequestBatcher();

async function fetchItems(offset: number, limit: number, filter?: string): Promise<PaginatedResponse> {
  const params = new URLSearchParams({
    offset: offset.toString(),
    limit: limit.toString(),
  });
  if (filter) params.append('filter', filter);

  const response = await fetch(`${API_BASE}/items?${params}`);
  return response.json();
}

async function fetchSelected(offset: number, limit: number, filter?: string): Promise<PaginatedResponse> {
  const params = new URLSearchParams({
    offset: offset.toString(),
    limit: limit.toString(),
  });
  if (filter) params.append('filter', filter);

  const response = await fetch(`${API_BASE}/selected?${params}`);
  return response.json();
}

const throttledGetItems = createThrottle(fetchItems, TIMING.FETCH_THROTTLE_MS);
const throttledGetSelected = createThrottle(fetchSelected, TIMING.FETCH_THROTTLE_MS);

export const itemsApi = {
  async getItems(offset: number, limit: number, filter?: string): Promise<PaginatedResponse> {
    return throttledGetItems(offset, limit, filter) as Promise<PaginatedResponse>;
  },

  async getSelected(offset: number, limit: number, filter?: string): Promise<PaginatedResponse> {
    return throttledGetSelected(offset, limit, filter) as Promise<PaginatedResponse>;
  },

  async addItem(id: number): Promise<boolean> {
    return batcher.queueAdd(id);
  },

  async selectItem(id: number): Promise<boolean> {
    const response = await fetch(`${API_BASE}/select/${id}`, {
      method: 'POST',
    });
    return response.ok;
  },

  async deselectItem(id: number): Promise<boolean> {
    const response = await fetch(`${API_BASE}/select/${id}`, {
      method: 'DELETE',
    });
    return response.ok;
  },

  async reorderItem(itemId: number, newIndex: number, filter?: string): Promise<boolean> {
    const response = await fetch(`${API_BASE}/selected/reorder`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId, newIndex, filter }),
    });
    return response.ok;
  },

  forceFlushAdds(): void {
    batcher.forceFlush();
  },
};
