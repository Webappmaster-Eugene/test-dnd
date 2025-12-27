export interface PaginationParams {
  offset: number;
  limit: number;
  filter?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  hasMore: boolean;
}

export interface AddItemRequest {
  id: number;
}

export interface ReorderRequest {
  itemId: number;
  newIndex: number;
}

export interface QueuedOperation {
  type: 'select' | 'deselect' | 'reorder';
  itemId: number;
  newIndex?: number;
  timestamp: number;
}
