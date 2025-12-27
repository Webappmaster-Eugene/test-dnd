import { useRef, useCallback, useState, useEffect } from 'react';
import type { UseInfiniteScrollOptions, UseInfiniteScrollReturn } from '@/types';

export function useInfiniteScroll({
  onLoadMore,
  hasMore,
  loading,
  threshold = 100,
}: UseInfiniteScrollOptions): UseInfiniteScrollReturn {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [sentinel, setSentinel] = useState<HTMLDivElement | null>(null);

  const stateRef = useRef({ onLoadMore, hasMore, loading });
  stateRef.current = { onLoadMore, hasMore, loading };

  const containerRef = useCallback((node: HTMLDivElement | null) => {
    setContainer(node);
  }, []);

  const sentinelRef = useCallback((node: HTMLDivElement | null) => {
    setSentinel(node);
  }, []);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (!container || !sentinel) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const { onLoadMore, hasMore, loading } = stateRef.current;

        if (entry.isIntersecting && hasMore && !loading) {
          onLoadMore();
        }
      },
      {
        root: container,
        rootMargin: `${threshold}px`,
        threshold: 0,
      }
    );

    observerRef.current.observe(sentinel);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [container, sentinel, threshold]);

  return { containerRef, sentinelRef };
}
