import type { SetURLSearchParams } from 'react-router-dom';
import type { Mock } from 'vitest';
import type { City } from '@/weatherForecast/types';
import type { ErrorLike } from '@apollo/client';

type AddCityFn = (
  lat: number,
  lon: number,
  cityName: string,
) => Promise<City | null>;

type RemoveCityFn = (id: string) => Promise<void>;

type RemoveAllCitiesFn = () => Promise<{
  ok: boolean;
  code: undefined;
}>;

type TogglePinnedFn = (id: string, currentPinned: boolean) => Promise<void>;

type GetCityByNameFn = (cityName: string) => Promise<City | null>;

export type CityActionsContext = {
  addCity: Mock<AddCityFn>;
  removeCity: Mock<RemoveCityFn>;
  removeAllCities: Mock<RemoveAllCitiesFn>;
  togglePinned: Mock<TogglePinnedFn>;
  getCityByName: Mock<GetCityByNameFn>;

  loading: boolean;
  error: ErrorLike | undefined;

  showSuccessNotification: Mock<(msg: string) => void>;
  showErrorNotification: Mock<(msg: string) => void>;
  showInfoNotification: Mock<(msg: string) => void>;

  searchParams: URLSearchParams & {
    get: Mock<(key: string) => string | null>;
    set: Mock<(key: string, value: string) => void>;
    delete: Mock<(key: string) => void>;
  };

  setSearchParams: SetURLSearchParams & Mock;
};

export const createCityActionsContext = (): CityActionsContext => ({
  addCity: vi.fn<AddCityFn>(),
  removeCity: vi.fn<RemoveCityFn>(),
  removeAllCities: vi.fn<RemoveAllCitiesFn>(),
  togglePinned: vi.fn<TogglePinnedFn>(),
  getCityByName: vi.fn<GetCityByNameFn>(),

  loading: false,
  error: undefined,

  showSuccessNotification: vi.fn(),
  showErrorNotification: vi.fn(),
  showInfoNotification: vi.fn(),

  searchParams: Object.assign(new URLSearchParams(), {
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
  }),

  setSearchParams: vi.fn() as SetURLSearchParams & Mock,
});
