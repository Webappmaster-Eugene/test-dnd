import { PaginatedResponse, PaginationParams } from '../types/index.js';
import { ITEMS } from '../constants/index.js';

class ItemStore {
  private allItems: Set<number>;
  private selectedItems: number[];
  private selectedSet: Set<number>;

  constructor() {
    this.allItems = new Set();
    this.selectedItems = [];
    this.selectedSet = new Set();

    for (let i = 1; i <= ITEMS.INITIAL_COUNT; i++) {
      this.allItems.add(i);
    }
  }

  getItems(params: PaginationParams, excludeSelected: boolean = true): PaginatedResponse<number> {
    const { offset, limit, filter } = params;

    let items: number[] = [];

    if (filter) {
      const filterId = parseInt(filter, 10);
      if (!isNaN(filterId) && this.allItems.has(filterId)) {
        if (!(excludeSelected && this.selectedSet.has(filterId))) {
          items.push(filterId);
        }
      }
    } else {
      for (const id of this.allItems) {
        if (excludeSelected && this.selectedSet.has(id)) continue;
        items.push(id);
      }
    }

    items.sort((a, b) => a - b);

    const total = items.length;
    const paginatedItems = items.slice(offset, offset + limit);

    return {
      items: paginatedItems,
      total,
      hasMore: offset + limit < total,
    };
  }

  getSelectedItems(params: PaginationParams): PaginatedResponse<number> {
    const { offset, limit, filter } = params;

    let items = this.selectedItems;

    if (filter) {
      const filterId = parseInt(filter, 10);
      if (!isNaN(filterId)) {
        items = items.filter(id => id === filterId);
      } else {
        items = [];
      }
    }

    const total = items.length;
    const paginatedItems = items.slice(offset, offset + limit);

    return {
      items: paginatedItems,
      total,
      hasMore: offset + limit < total,
    };
  }

  addItem(id: number): boolean {
    if (this.allItems.has(id)) {
      return false;
    }
    this.allItems.add(id);
    return true;
  }

  selectItem(id: number): boolean {
    if (!this.allItems.has(id) || this.selectedSet.has(id)) {
      return false;
    }
    this.selectedItems.push(id);
    this.selectedSet.add(id);
    return true;
  }

  deselectItem(id: number): boolean {
    if (!this.selectedSet.has(id)) {
      return false;
    }
    this.selectedItems = this.selectedItems.filter(item => item !== id);
    this.selectedSet.delete(id);
    return true;
  }

  reorderItem(itemId: number, newIndex: number, filter?: string): boolean {
    if (!this.selectedSet.has(itemId)) {
      return false;
    }

    if (filter) {
      const filterId = parseInt(filter, 10);
      const filteredItems = !isNaN(filterId)
        ? this.selectedItems.filter(id => id === filterId)
        : [];
      const filteredIndices = this.selectedItems
        .map((id, index) => ({ id, index }))
        .filter(item => !isNaN(filterId) && item.id === filterId);

      const currentFilteredIndex = filteredItems.indexOf(itemId);
      if (currentFilteredIndex === -1) return false;

      const clampedNewIndex = Math.max(0, Math.min(newIndex, filteredItems.length - 1));

      const currentGlobalIndex = this.selectedItems.indexOf(itemId);
      this.selectedItems.splice(currentGlobalIndex, 1);

      let targetGlobalIndex: number;
      if (clampedNewIndex === 0) {
        targetGlobalIndex = filteredIndices.length > 0 ? filteredIndices[0].index : 0;
      } else if (clampedNewIndex >= filteredIndices.length - 1) {
        const lastFilteredItem = filteredIndices[filteredIndices.length - 1];
        targetGlobalIndex = lastFilteredItem ? lastFilteredItem.index : this.selectedItems.length;
      } else {
        targetGlobalIndex = filteredIndices[clampedNewIndex].index;
      }

      if (currentGlobalIndex < targetGlobalIndex) {
        targetGlobalIndex--;
      }

      this.selectedItems.splice(targetGlobalIndex, 0, itemId);
    } else {
      const currentIndex = this.selectedItems.indexOf(itemId);
      if (currentIndex === -1) return false;

      const clampedNewIndex = Math.max(0, Math.min(newIndex, this.selectedItems.length - 1));

      this.selectedItems.splice(currentIndex, 1);
      this.selectedItems.splice(clampedNewIndex, 0, itemId);
    }

    return true;
  }

  itemExists(id: number): boolean {
    return this.allItems.has(id);
  }

  isSelected(id: number): boolean {
    return this.selectedSet.has(id);
  }
}

export const itemStore = new ItemStore();
