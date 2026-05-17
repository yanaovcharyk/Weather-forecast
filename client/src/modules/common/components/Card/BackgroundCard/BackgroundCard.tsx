import { Card, type CardProps } from 'antd';
import styles from './BackgroundCard.module.scss';
import classNames from 'classnames';

type InfoCardProps = CardProps & {
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
  backgroundImage?: string;
  showSkeleton?: boolean;
};

export const BackgroundCard = ({
  children,
  headerLeft,
  headerRight,
  backgroundImage,
  showSkeleton,
  className,
  ...props
}: InfoCardProps) => {
  return (
    <Card
      {...props}
      size="small"
      title={headerLeft}
      extra={headerRight}
      className={classNames(styles.card, className)}
    >
      <div className={styles.wrapper}>
        {backgroundImage && (
          <>
            <img
              src={backgroundImage}
              alt=""
              fetchPriority="high"
              className={styles.backgroundImage}
            />
            <div className={styles.backgroundOverlay} />
          </>
        )}

        {showSkeleton && !backgroundImage && (
          <div className={styles.backgroundSkeleton} />
        )}

        <div className={styles.content}>{children}</div>
      </div>
    </Card>
  );
};
