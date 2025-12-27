import { create } from 'zustand';
import type { ItemsStore, ItemsState } from '@/types';
import {
  createSetLeftFilter,
  createSetRightFilter,
  createFetchLeftItems,
  createFetchRightItems,
  createSelectItem,
  createDeselectItem,
  createReorderItem,
  createAddItem,
} from './actions';

const initialState: ItemsState = {
  leftItems: [],
  leftFilter: '',
  leftHasMore: true,
  leftLoading: false,
  leftTotal: 0,

  rightItems: [],
  rightFilter: '',
  rightHasMore: true,
  rightLoading: false,
  rightTotal: 0,
};

export const useItemsStore = create<ItemsStore>((set, get) => ({
  ...initialState,

  setLeftFilter: createSetLeftFilter(set, get),
  setRightFilter: createSetRightFilter(set, get),
  fetchLeftItems: createFetchLeftItems(set, get),
  fetchRightItems: createFetchRightItems(set, get),
  selectItem: createSelectItem(set, get),
  deselectItem: createDeselectItem(set, get),
  reorderItem: createReorderItem(set, get),
  addItem: createAddItem(),
}));
