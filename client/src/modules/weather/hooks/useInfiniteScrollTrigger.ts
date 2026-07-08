import { useEffect, useRef } from 'react';

type UseInfiniteScrollTriggerParams = {
  hasNextPage: boolean;
  onLoadMore: () => void;
};

export const useInfiniteScrollTrigger = ({
  hasNextPage,
  onLoadMore,
}: UseInfiniteScrollTriggerParams) => {
  const loadMoreTriggerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNextPage) {
      return;
    }

    const loadMoreTrigger = loadMoreTriggerRef.current;

    if (!loadMoreTrigger) {
      return;
    }

    const loadMoreObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        onLoadMore();
      }
    });

    loadMoreObserver.observe(loadMoreTrigger);

    return () => {
      loadMoreObserver.disconnect();
    };
  }, [hasNextPage, onLoadMore]);

  return loadMoreTriggerRef;
};
