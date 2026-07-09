import { Form } from 'antd';
import { useCallback } from 'react';
import { useCitySearch } from './useCitySearch';
import type { SelectedCity } from '@/weather/types';

export type AddCityFormValues = {
  selectedCity?: string;
};

export const useAddCityForm = (
  onSubmit: (city: SelectedCity) => void | Promise<void>,
) => {
  const [form] = Form.useForm<AddCityFormValues>();
  const { loading, handleSearchCities, cityOptions } = useCitySearch();

  const submit = useCallback(
    async ({ selectedCity }: AddCityFormValues) => {
      if (!selectedCity) {
        return;
      }
      const city = JSON.parse(selectedCity);
      await onSubmit(city);
      form.resetFields();
    },
    [form, onSubmit],
  );

  return {
    form,
    loading,
    handleSearchCities,
    cityOptions,
    handleSubmit: submit,
  };
};

export type AddCityFormResult = ReturnType<typeof useAddCityForm>;
