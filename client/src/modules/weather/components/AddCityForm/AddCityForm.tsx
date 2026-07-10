import { Col, Form, Row, Select } from 'antd';
import { EmptyState, AppCard, PrimaryButton } from '@/common/components';
import { useAddCityForm, useAddCityAction } from '@/weather/hooks';
import { useIsMobile } from '@/common/hooks';

import styles from './AddCityForm.module.scss';

export const AddCityForm = () => {
  const isMobile = useIsMobile();
  const { handleAddCity, isAddingCity } = useAddCityAction();

  const { form, loading, handleSearchCities, cityOptions, handleSubmit } =
    useAddCityForm(handleAddCity);

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
                disabled={isAddingCity}
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
              disabled={isAddingCity}
            >
              Add
            </PrimaryButton>
          </Col>
        </Row>
      </Form>
    </AppCard>
  );
};
