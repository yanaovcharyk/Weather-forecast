import { Form } from 'antd';
import { useCallback } from 'react';
import { useCitySearch } from './useCitySearch';
import { findCityByKey } from '../utils/citySelect';

export const useAddCityForm = (
  onSubmit: (name: string) => void | Promise<void>,
) => {
  const [form] = Form.useForm();
  const { data, loading, handleSearch, cityOptions } = useCitySearch();

  const handleSubmit = useCallback(
    async ({ city }: { city?: string }) => {
      if (!city) {
        return;
      }

      const selected = findCityByKey(data?.searchCities ?? [], city);
      if (!selected) {
        return;
      }

      await onSubmit(selected.name);
      form.resetFields();
    },
    [data, form, onSubmit],
  );

  return {
    form,
    loading,
    handleSearch,
    cityOptions,
    handleSubmit,
  };
};
