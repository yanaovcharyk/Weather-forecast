import { vi } from 'vitest';
import type { AddCityFormResult } from '@/weatherForecast/hooks/useAddCityForm';
import { createFormMock } from './form.fixture';

export const handleSubmitMock = vi.fn<AddCityFormResult['handleSubmit']>();
export const handleSearchMock = vi.fn<AddCityFormResult['handleSearch']>();

export const createUseAddCityFormResult = (
  overrides: Partial<AddCityFormResult> = {},
): AddCityFormResult => ({
  form: createFormMock(),
  loading: false,
  handleSearch: handleSearchMock,
  cityOptions: [
    {
      label: 'Kyiv',
      value: 'kyiv',
    },
  ],
  handleSubmit: handleSubmitMock,
  ...overrides,
});
