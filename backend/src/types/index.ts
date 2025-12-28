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
