import { Card, type CardProps } from 'antd';
import styles from './AppCard.module.scss';

export const AppCard = ({ children, ...props }: CardProps) => {
  return (
    <Card
      {...props}
      style={{
        ...props.style,
      }}
      className={styles.card}
    >
      {children}
    </Card>
  );
};
