import React from 'react';
import { Modal, Typography } from 'antd';

import styles from './ConfirmModal.module.scss';

const { Text, Title } = Typography;

export interface ConfirmModalProps {
  visible: boolean;
  title: string;
  content: string;
  okText?: string;
  cancelText?: string;
  okType?: 'default' | 'danger' | 'ghost' | 'link' | 'text' | undefined;
  onOk: () => Promise<void> | void;
  onCancel: () => void;
  loading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title,
  content,
  okText = 'OK',
  cancelText = 'Cancel',
  okType = 'default',
  onOk,
  onCancel,
  loading = false,
}) => {
  return (
    <Modal
      open={visible}
      centered
      onOk={onOk}
      onCancel={onCancel}
      okText={okText}
      cancelText={cancelText}
      okButtonProps={{ danger: okType === 'danger', loading }}
      cancelButtonProps={{ disabled: loading }}
      className={styles.modal}
      title={
        <Title level={4} className={styles.title}>
          {title}
        </Title>
      }
    >
      <Text className={styles.content}>{content}</Text>
    </Modal>
  );
};
