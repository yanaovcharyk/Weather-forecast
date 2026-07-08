import React, { useState, useCallback } from 'react';
import { Row, Col, Select, Button, Checkbox } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import type { DisabledStates, SortingState } from '@/weather/types';
import { ConfirmModal } from '@/common/components';
import styles from './CitiesControls.module.scss';

export type CitiesControlsProps = {
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  onDeleteAll: () => Promise<void>;
  showPinnedOnly: boolean;
  setShowPinnedOnly: React.Dispatch<React.SetStateAction<boolean>>;
  disabledStates: DisabledStates;
};

export const CitiesControls: React.FC<CitiesControlsProps> = ({
  sorting,
  setSorting,
  onDeleteAll,
  showPinnedOnly,
  setShowPinnedOnly,
  disabledStates,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const showDeleteAllModal = useCallback(() => {
    setIsModalVisible(true);
  }, []);

  const handleConfirmDeleteAll = useCallback(async () => {
    setIsDeleting(true);
    try {
      await onDeleteAll();
      setIsModalVisible(false);
    } finally {
      setIsDeleting(false);
    }
  }, [onDeleteAll]);

  return (
    <>
      <Row>
        <Col span={16}>
          <div
            className={
              disabledStates.sorting
                ? `${styles.label} ${styles.disabledLabel}`
                : styles.label
            }
          >
            Sort by:
          </div>

          <Row className={styles.controls}>
            <div>
              <Select
                value={sorting.sortBy}
                className={styles.select}
                disabled={disabledStates.sorting}
                onChange={(value) =>
                  setSorting((s) => ({ ...s, sortBy: value }))
                }
                options={[
                  { label: 'City name', value: 'cityName' },
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
            </div>

            <Checkbox
              checked={showPinnedOnly}
              onChange={(e) => setShowPinnedOnly(e.target.checked)}
              className={styles.pinnedCheckbox}
            >
              Favourites only
            </Checkbox>
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

      <ConfirmModal
        visible={isModalVisible}
        title="Delete all cities?"
        content="This action cannot be undone."
        okText="Delete all"
        okType="danger"
        cancelText="Cancel"
        loading={isDeleting}
        onOk={handleConfirmDeleteAll}
        onCancel={() => setIsModalVisible(false)}
      />
    </>
  );
};
