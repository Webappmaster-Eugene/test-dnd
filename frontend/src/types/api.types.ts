export interface PaginatedResponse {
  items: number[];
  total: number;
  hasMore: boolean;
}

export type ThrottledFn = (
  offset: number,
  limit: number,
  filter?: string
) => Promise<PaginatedResponse>;

export interface AddCallback {
  id: number;
  resolve: (success: boolean) => void;
}
