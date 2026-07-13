import { Card, type CardProps } from 'antd';
import styles from './StyledCard.module.scss';
import classNames from 'classnames';

export const StyledCard = ({ children, ...props }: CardProps) => {
  return (
    <Card {...props} className={classNames(styles.card, props.className)}>
      {children}
    </Card>
  );
};
