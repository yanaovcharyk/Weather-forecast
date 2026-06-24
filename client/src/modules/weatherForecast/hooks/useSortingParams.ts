import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { SortingState } from '@/weatherForecast/types';

export const useSortingParams = () => {
  const [params, setParams] = useSearchParams();

  const initialSorting: SortingState = {
    sortBy: (params.get('sortBy') as 'createdAt' | 'city') ?? 'createdAt',
    sortOrder: (params.get('sortOrder') as 'ASC' | 'DESC') ?? 'DESC',
  };

  const initialPinned = params.get('showPinnedOnly') === 'true';

  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const [showPinnedOnly, setShowPinnedOnly] = useState(initialPinned);

  useEffect(() => {
    const next = new URLSearchParams(params);

    next.set('sortBy', sorting.sortBy);
    next.set('sortOrder', sorting.sortOrder);
    next.set('showPinnedOnly', String(showPinnedOnly));

    setParams(next);
  }, [sorting, showPinnedOnly, setParams, params]);

  return { sorting, setSorting, showPinnedOnly, setShowPinnedOnly };
};
