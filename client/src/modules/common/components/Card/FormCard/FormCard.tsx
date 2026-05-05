import { Card, type CardProps } from 'antd';
import styles from './FormCard.module.scss';

export const FormCard = ({ children, ...props }: CardProps) => {
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
