import { act, renderHook } from '@testing-library/react';
import { Form } from 'antd';
import { vi } from 'vitest';

import { useAddCityForm } from './useAddCityForm';
import { useCitySearch } from './useCitySearch';

vi.mock('./useCitySearch');

describe('useAddCityForm', () => {
  const resetFields = vi.fn();

  const setup = () => {
    const onSubmit = vi.fn();

    const { result } = renderHook(() => useAddCityForm(onSubmit));

    return {
      result,
      onSubmit,
    };
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(Form, 'useForm').mockReturnValue([
      {
        resetFields,
      },
    ] as never);

    vi.mocked(useCitySearch).mockReturnValue({
      loading: false,
      handleSearchCities: vi.fn(),
      cityOptions: [],
    });
  });

  it('returns values from useCitySearch', () => {
    const handleSearchCities = vi.fn();

    vi.mocked(useCitySearch).mockReturnValue({
      loading: true,
      handleSearchCities,
      cityOptions: [{ label: 'Kyiv', value: '1' }],
    });

    const { result } = setup();

    expect(result.current.loading).toBe(true);
    expect(result.current.handleSearchCities).toBe(handleSearchCities);
    expect(result.current.cityOptions).toHaveLength(1);
  });

  it('does not submit empty city', async () => {
    const { result, onSubmit } = setup();

    await act(async () => {
      await result.current.handleSubmit({});
    });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits city and resets form', async () => {
    const { result, onSubmit } = setup();

    const cityName = JSON.stringify({
      lat: 50.45,
      lon: 30.52,
      cityName: 'Kyiv',
    });

    await act(async () => {
      await result.current.handleSubmit({
        selectedCity: cityName,
      });
    });

    expect(onSubmit).toHaveBeenCalledWith({
      lat: 50.45,
      lon: 30.52,
      cityName: 'Kyiv',
    });

    expect(resetFields).toHaveBeenCalled();
  });
});
