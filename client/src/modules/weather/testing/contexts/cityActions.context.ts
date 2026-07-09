import type { SetURLSearchParams } from 'react-router-dom';
import type { Mock } from 'vitest';
import type { City, SelectedCity } from '@/weather/types';
import type { ErrorLike } from '@apollo/client';
import type { ToastContextValue } from '@/common/contexts/ToastContext';

type AddCityFn = (city: SelectedCity) => Promise<City | null>;

type RemoveCityFn = (id: string) => Promise<void>;

type RemoveAllCitiesFn = () => Promise<{
  ok: boolean;
  code: undefined;
}>;

type TogglePinnedFn = (id: string, currentPinned: boolean) => Promise<void>;

type GetSavedCityFn = (variables: {
  id?: string;
  cityName?: string;
  includeWeather?: boolean;
}) => Promise<City | null>;

export type CityActionsContext = {
  addCity: Mock<AddCityFn>;
  removeCity: Mock<RemoveCityFn>;
  removeAllCities: Mock<RemoveAllCitiesFn>;
  togglePinned: Mock<TogglePinnedFn>;
  getSavedCity: Mock<GetSavedCityFn>;

  loading: boolean;
  error: ErrorLike | undefined;

  toast: {
    toast: Mock<ToastContextValue['toast']>;
    success: Mock<ToastContextValue['success']>;
    error: Mock<ToastContextValue['error']>;
    info: Mock<ToastContextValue['info']>;
    warning: Mock<ToastContextValue['warning']>;
  };

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
  getSavedCity: vi.fn<GetSavedCityFn>(),

  loading: false,
  error: undefined,

  toast: {
    toast: vi.fn<ToastContextValue['toast']>(),
    success: vi.fn<ToastContextValue['success']>(),
    error: vi.fn<ToastContextValue['error']>(),
    info: vi.fn<ToastContextValue['info']>(),
    warning: vi.fn<ToastContextValue['warning']>(),
  },

  searchParams: Object.assign(new URLSearchParams(), {
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
  }),

  setSearchParams: vi.fn() as SetURLSearchParams & Mock,
});
