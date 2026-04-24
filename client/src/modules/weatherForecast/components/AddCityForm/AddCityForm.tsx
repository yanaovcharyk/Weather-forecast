import { Form, Select, Grid, Space, theme, Empty } from 'antd';
import { PrimaryButton } from '@/shared/components/Button/PrimaryButton';

import type { AddCityFormProps } from './types';
import { useCitySearch } from '../../hooks/useCitySearch';

export const AddCityForm = ({ onSubmit, disabled }: AddCityFormProps) => {
  const { useToken } = theme;
  const { token } = useToken();

  const [form] = Form.useForm();
  const { data, loading, handleSearch } = useCitySearch();

  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  const isMobile = !screens.md;

  const getCityOptionValue = (city: { lat: number; lon: number }) =>
    `${city.lat}|${city.lon}`;

  const findSelectedCity = (value: string) =>
    data?.searchCities?.find((city) => getCityOptionValue(city) === value);

  const submitCity = async (city: { name: string }) => {
    await onSubmit(city.name);
  };

  const resetForm = () => {
    form.resetFields();
  };

  const cityOptions =
    data?.searchCities?.map((city) => ({
      label: `${city.name}, ${city.country}`,
      value: getCityOptionValue(city),
    })) ?? [];

  const handleSubmit = async (values: { city?: string }) => {
    if (!values.city) return;

    const selectedCity = findSelectedCity(values.city);
    if (!selectedCity) return;

    await submitCity(selectedCity);
    resetForm();
  };

  return (
    <Form form={form} onFinish={handleSubmit}>
      <Space
        orientation="vertical"
        size={isMobile ? token.marginXXS : token.marginXS}
        style={{ width: '100%', padding: isMobile ? '0 0 8' : 8 }}
      >
        <Form.Item
          name="city"
          rules={[{ required: true, message: 'Select a city' }]}
          style={{ marginBottom: 0 }}
        >
          <Select
            showSearch={{
              filterOption: false,
              onSearch: handleSearch,
            }}
            loading={loading}
            disabled={disabled}
            allowClear
            options={cityOptions}
            size="middle"
            placement={isMobile ? 'topLeft' : 'bottomLeft'}
            getPopupContainer={() => document.body}
            notFoundContent={
              <Empty
                image={<div style={{ fontSize: token.fontSizeXL }}>🌥</div>}
                description="No cities found"
                styles={{
                  image: {
                    height: 24,
                  },
                }}
              />
            }
          />
        </Form.Item>

        <PrimaryButton
          block
          size="middle"
          htmlType="submit"
          disabled={disabled}
        >
          Add
        </PrimaryButton>
      </Space>
    </Form>
  );
};
