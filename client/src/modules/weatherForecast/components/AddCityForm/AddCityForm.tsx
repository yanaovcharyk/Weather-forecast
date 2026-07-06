import { Col, Form, Row, Select } from 'antd';
import { EmptyState, AppCard, PrimaryButton } from '@/common/components';
import type { AddCityFormProps } from './types';
import { useAddCityForm } from '@/weatherForecast/hooks/useAddCityForm';
import { useIsMobile } from '@/common/hooks/useIsMobile';

import styles from './AddCityForm.module.scss';

export const AddCityForm = ({ onSubmit, disabled }: AddCityFormProps) => {
  const isMobile = useIsMobile();

  const { form, loading, handleSearch, cityOptions, handleSubmit } =
    useAddCityForm(onSubmit);

  const error = form.getFieldError('cityName');

  return (
    <AppCard className={styles.formCard}>
      <Form form={form} onFinish={handleSubmit}>
        <Row gutter={16} align="top">
          <Col span={isMobile ? 18 : 22}>
            <Form.Item
              name="cityName"
              rules={[{ required: true, message: 'Select a city' }]}
              className={styles.formItem}
              validateStatus={error.length ? 'error' : undefined}
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
