import { Form, Select, Space, theme } from 'antd';
import { EmptyState, PrimaryButton } from '@/modules/common/components';

import type { AddCityFormProps } from './types';
import { useAddCityForm } from '../../hooks/useAddCityForm';
import { useIsMobile } from '@/modules/common/hooks/useIsMobile';

export const AddCityForm = ({ onSubmit, disabled }: AddCityFormProps) => {
  const { token } = theme.useToken();
  const isMobile = useIsMobile();

  const { form, loading, handleSearch, cityOptions, handleSubmit } =
    useAddCityForm(onSubmit);

  return (
    <Form form={form} onFinish={handleSubmit}>
      <Space
        orientation="vertical"
        size={isMobile ? token.marginXXS : token.marginXS}
        style={{ width: '100%' }}
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
            notFoundContent={<EmptyState description="No cities found" />}
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
