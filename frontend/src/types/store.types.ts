
export interface ItemsState {
  leftItems: number[];
  leftFilter: string;
  leftHasMore: boolean;
  leftLoading: boolean;
  leftTotal: number;

  rightItems: number[];
  rightFilter: string;
  rightHasMore: boolean;
  rightLoading: boolean;
  rightTotal: number;
}

export interface ItemsActions {
  setLeftFilter: (filter: string) => void;
  setRightFilter: (filter: string) => void;
  fetchLeftItems: (reset?: boolean) => Promise<void>;
  fetchRightItems: (reset?: boolean) => Promise<void>;
  selectItem: (id: number) => Promise<void>;
  deselectItem: (id: number) => Promise<void>;
  reorderItem: (itemId: number, newIndex: number) => Promise<void>;
  addItem: (id: number) => Promise<boolean>;
}

export type SetState = (partial: Partial<ItemsState>) => void;
export type GetState = () => ItemsState;

export type ItemsStore = ItemsState & ItemsActions;
