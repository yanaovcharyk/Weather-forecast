import { Form } from 'antd';
import { useCallback } from 'react';
import { useCitySearch } from './useCitySearch';

export const useAddCityForm = (
  onSubmit: (lat: number, lon: number, city: string) => void | Promise<void>,
) => {
  const [form] = Form.useForm();
  const { loading, handleSearch, cityOptions } = useCitySearch();

  const handleSubmit = useCallback(
    async ({ city }: { city?: string }) => {
      if (!city) return;

      const parsed = JSON.parse(city);

      await onSubmit(parsed.lat, parsed.lon, parsed.name);
      form.resetFields();
    },
    [form, onSubmit],
  );

  return {
    form,
    loading,
    handleSearch,
    cityOptions,
    handleSubmit,
  };
};
