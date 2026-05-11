import { Row, Col, Select, Button, Modal, Checkbox } from 'antd';
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
  showPinnedOnly: boolean;
  setShowPinnedOnly: React.Dispatch<React.SetStateAction<boolean>>;
};

export const CitiesControls = ({
  sorting,
  setSorting,
  onDeleteAll,
  showPinnedOnly,
  setShowPinnedOnly,
}: Props) => {
  const handleDeleteAll = useCallback(async () => {
    await onDeleteAll();
  }, [onDeleteAll]);

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
        <Row>
          <Checkbox
            checked={showPinnedOnly}
            onChange={(e) => setShowPinnedOnly(e.target.checked)}
            className={styles.pinnedCheckbox}
          >
            Pinned only
          </Checkbox>
        </Row>
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
