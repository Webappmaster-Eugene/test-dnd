export interface UseInfiniteScrollOptions {
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
  threshold?: number;
}

export type RefCallback = (node: HTMLDivElement | null) => void;

export interface UseInfiniteScrollReturn {
  containerRef: RefCallback;
  sentinelRef: RefCallback;
}
