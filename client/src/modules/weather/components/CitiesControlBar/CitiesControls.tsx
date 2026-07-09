import React, { useCallback, useState } from 'react';
import { Button, Checkbox, Col, Row, Select } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';

import { CitySortField, CitySortOrder } from '@/weather/types';
import type { DisabledStates, SortingState } from '@/weather/types';
import { ConfirmModal } from '@/common/components';

import styles from './CitiesControls.module.scss';

type SortOption = {
  label: string;
  value: SortingState['sortBy'];
};

const SORT_OPTIONS: SortOption[] = [
  {
    label: 'City name',
    value: CitySortField.CityName,
  },
  {
    label: 'Date added',
    value: CitySortField.CreatedAt,
  },
];

export type CitiesControlsProps = {
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
}: CitiesControlsProps) => {
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  const [isDeletingAllCities, setIsDeletingAllCities] = useState(false);

  const openDeleteAllModal = useCallback(() => {
    setIsDeleteAllModalOpen(true);
  }, []);

  const closeDeleteAllModal = useCallback(() => {
    setIsDeleteAllModalOpen(false);
  }, []);

  const handleSortByChange = useCallback(
    (sortBy: SortingState['sortBy']) => {
      setSorting((currentSorting) => ({
        ...currentSorting,
        sortBy,
      }));
    },
    [setSorting],
  );

  const toggleSortOrder = useCallback(() => {
    setSorting((currentSorting) => ({
      ...currentSorting,
      sortOrder:
        currentSorting.sortOrder === CitySortOrder.Asc
          ? CitySortOrder.Desc
          : CitySortOrder.Asc,
    }));
  }, [setSorting]);

  const handleFavoritesOnlyChange = useCallback(
    (event: CheckboxChangeEvent) => {
      setShowPinnedOnly(event.target.checked);
    },
    [setShowPinnedOnly],
  );

  const handleDeleteAllCitiesConfirm = useCallback(async () => {
    setIsDeletingAllCities(true);

    try {
      await onDeleteAll();
      closeDeleteAllModal();
    } finally {
      setIsDeletingAllCities(false);
    }
  }, [onDeleteAll, closeDeleteAllModal]);

  const sortOrderIcon =
    sorting.sortOrder === CitySortOrder.Asc ? (
      <ArrowUpOutlined />
    ) : (
      <ArrowDownOutlined />
    );

  const labelClassName = disabledStates.sorting
    ? `${styles.label} ${styles.disabledLabel}`
    : styles.label;

  return (
    <>
      <Row>
        <Col span={16}>
          <div className={labelClassName}>Sort by:</div>

          <Row className={styles.controls}>
            <div>
              <Select
                value={sorting.sortBy}
                className={styles.select}
                disabled={disabledStates.sorting}
                onChange={handleSortByChange}
                options={SORT_OPTIONS}
              />

              <Button
                disabled={disabledStates.sorting}
                icon={sortOrderIcon}
                onClick={toggleSortOrder}
              />
            </div>

            <Checkbox
              checked={showPinnedOnly}
              disabled={disabledStates.pinnedFilter}
              onChange={handleFavoritesOnlyChange}
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
            onClick={openDeleteAllModal}
          >
            Delete all
          </Button>
        </Col>
      </Row>

      <ConfirmModal
        visible={isDeleteAllModalOpen}
        title="Delete all cities?"
        content="This action cannot be undone."
        okText="Delete all"
        okType="danger"
        cancelText="Cancel"
        loading={isDeletingAllCities}
        onOk={handleDeleteAllCitiesConfirm}
        onCancel={closeDeleteAllModal}
      />
    </>
  );
};
