import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { CitySortField, CitySortOrder } from '@/weather/types';
import type { SortingState } from '@/weather/types';

enum SearchParam {
  SortBy = 'sortBy',
  SortOrder = 'sortOrder',
  ShowPinnedOnly = 'showPinnedOnly',
}

enum BooleanParamValue {
  True = 'true',
  False = 'false',
}

const DEFAULT_SORTING: SortingState = {
  sortBy: CitySortField.CreatedAt,
  sortOrder: CitySortOrder.Desc,
};

const getValidParam = <T extends string>(
  value: string | null,
  allowedValues: Record<string, T>,
  fallback: T,
): T => {
  const values = Object.values(allowedValues);

  return values.includes(value as T) ? (value as T) : fallback;
};

const getSortingFromParams = (params: URLSearchParams): SortingState => ({
  sortBy: getValidParam(
    params.get(SearchParam.SortBy),
    CitySortField,
    DEFAULT_SORTING.sortBy,
  ),
  sortOrder: getValidParam(
    params.get(SearchParam.SortOrder),
    CitySortOrder,
    DEFAULT_SORTING.sortOrder,
  ),
});

const getShowPinnedOnlyFromParams = (params: URLSearchParams): boolean => {
  return params.get(SearchParam.ShowPinnedOnly) === BooleanParamValue.True;
};

const updateSortingParams = (
  params: URLSearchParams,
  sorting: SortingState,
  showPinnedOnly: boolean,
): URLSearchParams => {
  const nextParams = new URLSearchParams(params);

  nextParams.set(SearchParam.SortBy, sorting.sortBy);
  nextParams.set(SearchParam.SortOrder, sorting.sortOrder);
  nextParams.set(
    SearchParam.ShowPinnedOnly,
    showPinnedOnly ? BooleanParamValue.True : BooleanParamValue.False,
  );

  return nextParams;
};

export const useSortingParams = () => {
  const [params, setParams] = useSearchParams();
  const [sorting, setSorting] = useState<SortingState>(() =>
    getSortingFromParams(params),
  );
  const [showPinnedOnly, setShowPinnedOnly] = useState(() =>
    getShowPinnedOnlyFromParams(params),
  );

  useEffect(() => {
    const nextParams = updateSortingParams(params, sorting, showPinnedOnly);

    setParams(nextParams);
  }, [sorting, showPinnedOnly, params, setParams]);

  return {
    sorting,
    setSorting,
    showPinnedOnly,
    setShowPinnedOnly,
  };
};
