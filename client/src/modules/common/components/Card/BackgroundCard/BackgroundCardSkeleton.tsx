import { Card, Skeleton } from 'antd';
import styles from './BackgroundCard.module.scss';

type BackgroundCardSkeletonProps = {
  hasHeader?: boolean;
  hasExtra?: boolean;
  rows?: number;
  showBackground?: boolean;
};

export const BackgroundCardSkeleton = ({
  hasHeader = true,
  hasExtra = false,
  rows = 3,
}: BackgroundCardSkeletonProps) => {
  return (
    <Card
      size="small"
      className={styles.card}
      title={hasHeader ? <Skeleton.Input active size="small" /> : null}
      extra={hasExtra ? <Skeleton.Button active size="small" /> : null}
    >
      <div className={styles.wrapper}>
        <div className={styles.backgroundSkeleton} />

        <div className={styles.content}>
          <Skeleton active title={false} paragraph={{ rows }} />
        </div>
      </div>
    </Card>
  );
};
