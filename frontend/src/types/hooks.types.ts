export interface UseInfiniteScrollOptions {
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
  threshold?: number;
}

export interface UseInfiniteScrollReturn {
  containerRef: (node: HTMLDivElement | null) => void;
  sentinelRef: (node: HTMLDivElement | null) => void;
}
