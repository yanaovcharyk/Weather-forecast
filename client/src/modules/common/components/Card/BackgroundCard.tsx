import { Card, type CardProps } from 'antd';
import styles from './BackgroundCard.module.scss';

type InfoCardProps = CardProps & {
  headerLeft: React.ReactNode;
  headerRight?: React.ReactNode;
  backgroundImage?: React.ReactNode;
};

export const BackgroundCard = ({
  children,
  headerLeft,
  headerRight,
  backgroundImage,
  ...props
}: InfoCardProps) => {
  return (
    <Card
      {...props}
      size="small"
      title={headerLeft}
      extra={headerRight}
      className={styles.card}
    >
      <div className={styles.wrapper}>
        {backgroundImage && (
          <div
            className={styles.background}
            style={
              { '--bg-image': `url(${backgroundImage})` } as React.CSSProperties
            }
          />
        )}

        <div className={styles.content}>{children}</div>
      </div>
    </Card>
  );
};
