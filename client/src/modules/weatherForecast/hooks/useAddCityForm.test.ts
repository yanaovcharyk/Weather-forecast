import { renderHook, act } from '@testing-library/react';
import { Form } from 'antd';
import { vi } from 'vitest';

import { useAddCityForm } from './useAddCityForm';
import { useCitySearch } from './useCitySearch';

vi.mock('./useCitySearch');

describe('useAddCityForm', () => {
  const resetFields = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(Form, 'useForm').mockReturnValue([
      {
        resetFields,
      },
    ] as never);

    vi.mocked(useCitySearch).mockReturnValue({
      loading: false,
      handleSearch: vi.fn(),
      cityOptions: [],
      data: undefined,
    });
  });

  it('returns values from useCitySearch', () => {
    const handleSearch = vi.fn();

    vi.mocked(useCitySearch).mockReturnValue({
      loading: true,
      handleSearch,
      cityOptions: [{ label: 'Kyiv', value: '1' }],
      data: undefined,
    });

    const { result } = renderHook(() => useAddCityForm(vi.fn()));

    expect(result.current.loading).toBe(true);
    expect(result.current.handleSearch).toBe(handleSearch);
    expect(result.current.cityOptions).toHaveLength(1);
  });

  it('does not submit empty city', async () => {
    const onSubmit = vi.fn();

    const { result } = renderHook(() => useAddCityForm(onSubmit));

    await act(async () => {
      await result.current.handleSubmit({});
    });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits city and resets form', async () => {
    const onSubmit = vi.fn();

    const { result } = renderHook(() => useAddCityForm(onSubmit));

    const city = JSON.stringify({
      lat: 50.45,
      lon: 30.52,
      name: 'Kyiv',
    });

    await act(async () => {
      await result.current.handleSubmit({
        city,
      });
    });

    expect(onSubmit).toHaveBeenCalledWith(50.45, 30.52, 'Kyiv');

    expect(resetFields).toHaveBeenCalled();
  });
});
