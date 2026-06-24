import { Form } from 'antd';
import type { FormInstance } from 'antd';
import { useCallback } from 'react';

import { useCitySearch } from './useCitySearch';

export type AddCityFormValues = {
  city?: string;
};

export type AddCityFormApi = Pick<
  FormInstance<AddCityFormValues>,
  'getFieldError' | 'resetFields'
>;

export type AddCityFormResult = {
  form: FormInstance<AddCityFormValues>;
  loading: boolean;
  handleSearch: (inputValue: string) => void;
  cityOptions: {
    label: string;
    value: string;
  }[];
  handleSubmit: (values: AddCityFormValues) => Promise<void>;
};

export const useAddCityForm = (
  onSubmit: (lat: number, lon: number, city: string) => void | Promise<void>,
): AddCityFormResult => {
  const [form] = Form.useForm<AddCityFormValues>();

  const { loading, handleSearch, cityOptions } = useCitySearch();

  const handleSubmit = useCallback(
    async ({ city }: AddCityFormValues) => {
      if (!city) {
        return;
      }

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
