import { Row, Col, Select, Button, Modal, App } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useCallback } from 'react';
import Text from 'antd/es/typography/Text';

import styles from './CitiesControls.module.scss';

type SortingState = {
  sortBy: 'createdAt' | 'city';
  sortOrder: 'ASC' | 'DESC';
};

type Props = {
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  onDeleteAll: () => Promise<void>;
};

export const CitiesControls = ({ sorting, setSorting, onDeleteAll }: Props) => {
  const { message } = App.useApp();

  const notifyError = useCallback(
    (msg: string) => message.error(msg),
    [message],
  );

  const notifySuccess = useCallback(
    (msg: string) => message.success(msg),
    [message],
  );

  const handleDeleteAll = useCallback(async () => {
    try {
      await onDeleteAll();

      notifySuccess('All cities removed successfully');
    } catch {
      notifyError('Failed to delete cities');
    }
  }, [onDeleteAll, notifyError, notifySuccess]);

  const showDeleteAllModal = () => {
    Modal.confirm({
      title: 'Delete all cities?',
      content: 'This action cannot be undone.',
      okText: 'Delete all',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: handleDeleteAll,
    });
  };

  return (
    <Row>
      <Col span={16}>
        <Text className={styles.label}>Sort by</Text>

        <Row className={styles.controls}>
          <Select
            value={sorting.sortBy}
            className={styles.select}
            onChange={(value) => setSorting((s) => ({ ...s, sortBy: value }))}
            options={[
              { label: 'City', value: 'city' },
              { label: 'Date added', value: 'createdAt' },
            ]}
          />

          <Button
            icon={
              sorting.sortOrder === 'ASC' ? (
                <ArrowUpOutlined />
              ) : (
                <ArrowDownOutlined />
              )
            }
            onClick={() =>
              setSorting((s) => ({
                ...s,
                sortOrder: s.sortOrder === 'ASC' ? 'DESC' : 'ASC',
              }))
            }
          />
        </Row>
      </Col>

      <Col span={8} className={styles.deleteCol}>
        <Button danger onClick={showDeleteAllModal}>
          Delete all
        </Button>
      </Col>
    </Row>
  );
};
