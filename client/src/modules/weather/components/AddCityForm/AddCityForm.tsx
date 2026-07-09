import { Col, Form, Row, Select } from 'antd';
import { EmptyState, AppCard, PrimaryButton } from '@/common/components';
import { useAddCityForm } from '@/weather/hooks/';
import { useIsMobile } from '@/common/hooks/';
import type { SelectedCity } from '@/weather/types';

import styles from './AddCityForm.module.scss';

export interface AddCityFormProps {
  onSubmit: (city: SelectedCity) => Promise<void> | void;
  disabled?: boolean;
}

export const AddCityForm = ({ onSubmit, disabled }: AddCityFormProps) => {
  const isMobile = useIsMobile();

  const { form, loading, handleSearchCities, cityOptions, handleSubmit } =
    useAddCityForm(onSubmit);

  return (
    <AppCard className={styles.formCard}>
      <Form form={form} onFinish={handleSubmit}>
        <Row gutter={16} align="top">
          <Col span={isMobile ? 18 : 22}>
            <Form.Item
              name="selectedCity"
              rules={[{ required: true, message: 'Select a city' }]}
              className={styles.formItem}
            >
              <Select
                showSearch={{
                  filterOption: false,
                  onSearch: handleSearchCities,
                }}
                loading={loading}
                disabled={disabled}
                allowClear
                options={cityOptions}
                size="middle"
                placement="bottomLeft"
                getPopupContainer={() => document.body}
                notFoundContent={<EmptyState description="No cities found" />}
              />
            </Form.Item>
          </Col>

          <Col span={isMobile ? 6 : 2}>
            <PrimaryButton
              block
              size="middle"
              htmlType="submit"
              disabled={disabled}
            >
              Add
            </PrimaryButton>
          </Col>
        </Row>
      </Form>
    </AppCard>
  );
};
