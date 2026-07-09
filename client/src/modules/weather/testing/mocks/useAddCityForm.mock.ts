import { vi } from 'vitest';
import type { AddCityFormResult } from '@/weather/hooks/useAddCityForm';
import { createFormMock } from './form.mock';

export const handleSubmitMock = vi.fn<AddCityFormResult['handleSubmit']>();
export const handleSearchMock =
  vi.fn<AddCityFormResult['handleSearchCities']>();

export const createUseAddCityFormResult = (
  overrides: Partial<AddCityFormResult> = {},
): AddCityFormResult => ({
  form: createFormMock(),
  loading: false,
  handleSearchCities: handleSearchMock,
  cityOptions: [
    {
      label: 'Kyiv',
      value: 'kyiv',
    },
  ],
  handleSubmit: handleSubmitMock,
  ...overrides,
});
