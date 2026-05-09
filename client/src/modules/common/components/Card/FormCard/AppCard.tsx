import { Card, type CardProps } from 'antd';
import styles from './AppCard.module.scss';
import classNames from 'classnames';

export const AppCard = ({ children, ...props }: CardProps) => {
  return (
    <Card
      {...props}
      style={{
        ...props.style,
      }}
      className={classNames(styles.card, props.className)}
    >
      {children}
    </Card>
  );
};
