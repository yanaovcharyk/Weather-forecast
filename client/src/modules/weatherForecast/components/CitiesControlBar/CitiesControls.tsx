import { Row, Col, Select, Button, Modal, Checkbox } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useCallback } from 'react';
import Text from 'antd/es/typography/Text';

import styles from './CitiesControls.module.scss';
import type { DisabledStates, SortingState } from '../../types';

type Props = {
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  onDeleteAll: () => Promise<void>;
  showPinnedOnly: boolean;
  setShowPinnedOnly: React.Dispatch<React.SetStateAction<boolean>>;
  disabledStates: DisabledStates;
};

export const CitiesControls = ({
  sorting,
  setSorting,
  onDeleteAll,
  showPinnedOnly,
  setShowPinnedOnly,
  disabledStates,
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
            Favourites only
          </Checkbox>
        </Row>

        <Text
          className={
            disabledStates.sorting
              ? `${styles.label} ${styles.disabledLabel}`
              : styles.label
          }
        >
          Sort by:
        </Text>

        <Row className={styles.controls}>
          <Select
            value={sorting.sortBy}
            className={styles.select}
            disabled={disabledStates.sorting}
            onChange={(value) => setSorting((s) => ({ ...s, sortBy: value }))}
            options={[
              { label: 'City name', value: 'city' },
              { label: 'Date added', value: 'createdAt' },
            ]}
          />

          <Button
            disabled={disabledStates.sorting}
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
        <Button
          danger
          disabled={disabledStates.deleteAll}
          onClick={showDeleteAllModal}
        >
          Delete all
        </Button>
      </Col>
    </Row>
  );
};
