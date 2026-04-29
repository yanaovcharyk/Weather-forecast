import { Form, Select, Space, theme } from 'antd';
import { EmptyState, PrimaryButton } from '@/common/components';

import type { AddCityFormProps } from './types';
import { useAddCityForm } from '@/weatherForecast/hooks/useAddCityForm';
import { useIsMobile } from '@/common/hooks/useIsMobile';

import styles from './AddCityForm.module.scss';

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
        className={styles.space}
      >
        <Form.Item
          name="city"
          rules={[{ required: true, message: 'Select a city' }]}
          className={styles.formItem}
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
