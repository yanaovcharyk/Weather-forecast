import { CitySortField } from '@cities/city-query.config';
import { SortOrder } from '@shared/constants';

export interface IPaginationInput {
  limit: number;
  cursor?: string;
}

export interface ICitiesSortingInput {
  sortBy?: CitySortField;
  sortOrder?: SortOrder;
}

export interface ICitiesQueryInput {
  pagination: IPaginationInput;
  sorting?: ICitiesSortingInput;
  showPinnedOnly?: boolean;
}
