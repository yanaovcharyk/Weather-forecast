import { SelectQueryBuilder } from 'typeorm';
import { AddCityInput, CitiesQueryInput, UpdateCityInput } from './dto';
import { CityEntity } from './entities';
import { CitySortField } from './city-query.config';
import { SortOrder } from '@shared/constants';
import { IUpdateCityInput } from './interfaces';

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

export type AddSavedCityParams = {
  userId: string;
  input: AddCityInput;
};

export type UpdateSavedCityParams = CityByIdParams & {
  input: UpdateCityInput;
};

export type GetSavedCitiesParams = {
  userId: string;
};

export type GetSavedCitiesPaginatedParams = {
  userId: string;
  query: CitiesQueryInput;
};

export type ApplySortingParams = {
  qb: SelectQueryBuilder<CityEntity>;
  query: CitiesQueryInput;
};

export type ApplyCursorParams = {
  qb: SelectQueryBuilder<CityEntity>;
  query: CitiesQueryInput;
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
