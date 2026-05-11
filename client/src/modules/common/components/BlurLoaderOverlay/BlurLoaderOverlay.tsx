import { Spin } from 'antd';
import styles from './BlurLoaderOverlay.module.scss';
import type { PropsWithChildren } from 'react';

type Props = {
  loading: boolean;
};

export const BlurLoaderOverlay = ({
  loading,
  children,
}: PropsWithChildren<Props>) => {
  return (
    <div className={styles.container}>
      {children}

      <div className={`${styles.overlay} ${!loading ? styles.hidden : ''}`}>
        <Spin size="large" />
      </div>
    </div>
  );
};
