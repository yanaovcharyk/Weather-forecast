import { SelectQueryBuilder } from 'typeorm';
import { CityEntity } from './entities';
import { CitySortField } from './city-query.config';
import { SortOrder } from '@shared/constants';
import {
  IAddCityInput,
  ICitiesQueryInput,
  IUpdateCityInput,
} from './interfaces';

export type UserIdParams = {
  userId: string;
};

export type CityByIdParams = {
  userId: string;
  id: string;
};

export interface SavedCityByNameParams {
  userId: string;
  cityName: string;
}

export type SavedCityLookupParams =
  | {
      userId: string;
      id: string;
    }
  | {
      userId: string;
      cityName: string;
    };

export type AddSavedCityParams = {
  userId: string;
  input: IAddCityInput;
};

export type UpdateSavedCityParams = CityByIdParams & {
  input: IUpdateCityInput;
};

export type GetSavedCitiesParams = {
  userId: string;
};

export type GetSavedCitiesPaginatedParams = {
  userId: string;
  query: ICitiesQueryInput;
};

export type ApplySortingParams = {
  qb: SelectQueryBuilder<CityEntity>;
  query: ICitiesQueryInput;
};

export type ApplyCursorParams = {
  qb: SelectQueryBuilder<CityEntity>;
  query: ICitiesQueryInput;
  sortBy: CitySortField;
  sortOrder: SortOrder;
};

export type ApplyPaginationParams = {
  qb: SelectQueryBuilder<CityEntity>;
  limit: number;
};

export type BuildCitiesConnectionParams = {
  cities: CityEntity[];
  limit: number;
  sortBy: CitySortField;
};

export type AppliedSorting = {
  sortBy: CitySortField;
  sortOrder: SortOrder;
};

export type UpdateField = keyof IUpdateCityInput;
