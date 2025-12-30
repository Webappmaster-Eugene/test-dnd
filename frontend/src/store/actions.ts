import { itemsApi } from '@/api/itemsApi';
import { PAGINATION, TIMING } from '@/constants';
import type { SetState, GetState } from '@/types';

const LIMIT = PAGINATION.DEFAULT_LIMIT;

let leftFetchTimeout: ReturnType<typeof setTimeout> | null = null;
let rightFetchTimeout: ReturnType<typeof setTimeout> | null = null;

export const createSetLeftFilter = (set: SetState, get: GetState) => {
  return (filter: string) => {
    set({ leftFilter: filter, leftItems: [], leftHasMore: true });

    if (leftFetchTimeout) clearTimeout(leftFetchTimeout);
    leftFetchTimeout = setTimeout(() => {
      createFetchLeftItems(set, get)(true);
    }, TIMING.FILTER_DEBOUNCE_MS);
  };
};

export const createSetRightFilter = (set: SetState, get: GetState) => {
  return (filter: string) => {
    set({ rightFilter: filter, rightItems: [], rightHasMore: true });

    if (rightFetchTimeout) clearTimeout(rightFetchTimeout);
    rightFetchTimeout = setTimeout(() => {
      createFetchRightItems(set, get)(true);
    }, TIMING.FILTER_DEBOUNCE_MS);
  };
};

export const createFetchLeftItems = (set: SetState, get: GetState) => {
  return async (reset = false) => {
    const { leftLoading, leftItems, leftFilter, leftHasMore } = get();

    if (leftLoading || (!reset && !leftHasMore)) return;

    set({ leftLoading: true });

    const offset = reset ? 0 : leftItems.length;

    try {
      const data = await itemsApi.getItems(offset, LIMIT, leftFilter || undefined);

      set({
        leftItems: reset ? data.items : [...leftItems, ...data.items],
        leftHasMore: data.hasMore,
        leftTotal: data.total,
        leftLoading: false,
      });
    } catch (error) {
      console.error('Failed to fetch items:', error);
      set({ leftLoading: false });
    }
  };
};

export const createFetchRightItems = (set: SetState, get: GetState) => {
  return async (reset = false) => {
    const { rightLoading, rightItems, rightFilter, rightHasMore } = get();

    if (rightLoading || (!reset && !rightHasMore)) return;

    set({ rightLoading: true });

    const offset = reset ? 0 : rightItems.length;

    try {
      const data = await itemsApi.getSelected(offset, LIMIT, rightFilter || undefined);

      set({
        rightItems: reset ? data.items : [...rightItems, ...data.items],
        rightHasMore: data.hasMore,
        rightTotal: data.total,
        rightLoading: false,
      });
    } catch (error) {
      console.error('Failed to fetch selected items:', error);
      set({ rightLoading: false });
    }
  };
};

export const createSelectItem = (set: SetState, get: GetState) => {
  return async (id: number) => {
    const success = await itemsApi.selectItem(id);

    if (success) {
      const { leftItems, rightItems, rightFilter } = get();

      set({
        leftItems: leftItems.filter((item) => item !== id),
      });

      if (!rightFilter || id.toString().includes(rightFilter)) {
        set({
          rightItems: [...rightItems, id],
          rightTotal: get().rightTotal + 1,
        });
      }
    }
  };
};

export const createDeselectItem = (set: SetState, get: GetState) => {
  return async (id: number) => {
    const success = await itemsApi.deselectItem(id);

    if (success) {
      const { rightItems, leftItems, leftFilter } = get();

      set({
        rightItems: rightItems.filter((item) => item !== id),
        rightTotal: get().rightTotal - 1,
      });

      if (!leftFilter || id.toString().includes(leftFilter)) {
        const newLeftItems = [...leftItems, id].sort((a, b) => a - b);
        set({ leftItems: newLeftItems });
      }
    }
  };
};

export const createReorderItem = (set: SetState, get: GetState) => {
  return async (itemId: number, newIndex: number) => {
    const { rightItems, rightFilter } = get();

    const currentIndex = rightItems.indexOf(itemId);
    if (currentIndex === -1) return;

    const newItems = [...rightItems];
    newItems.splice(currentIndex, 1);
    newItems.splice(newIndex, 0, itemId);

    set({ rightItems: newItems });

    await itemsApi.reorderItem(itemId, newIndex, rightFilter || undefined);
  };
};

export const createAddItem = () => {
  return async (id: number) => {
    const success = await itemsApi.addItem(id);

    return success;
  };
};
