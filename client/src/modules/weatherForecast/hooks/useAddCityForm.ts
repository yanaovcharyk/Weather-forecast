import { Form } from 'antd';
import type { FormInstance } from 'antd';
import { useCallback } from 'react';
import { z } from 'zod';

import { useCitySearch } from './useCitySearch';
import type { CitySelectValue } from '@/weatherForecast/components/AddCityForm/types';

export type AddCityFormValues = {
  cityName?: string;
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

const citySelectValueSchema = z.object({
  lat: z.number(),
  lon: z.number(),
  name: z.string().min(1),
}) satisfies z.ZodType<CitySelectValue>;

const parseCitySelectValue = (value: string): CitySelectValue =>
  citySelectValueSchema.parse(JSON.parse(value));

export const useAddCityForm = (
  onSubmit: (
    lat: number,
    lon: number,
    cityName: string,
  ) => void | Promise<void>,
): AddCityFormResult => {
  const [form] = Form.useForm<AddCityFormValues>();

  const { loading, handleSearch, cityOptions } = useCitySearch();

  const handleSubmit = useCallback(
    async ({ cityName }: AddCityFormValues) => {
      if (!cityName) {
        return;
      }

      const parsed = parseCitySelectValue(cityName);

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
