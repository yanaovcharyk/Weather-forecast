import { Button } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import styles from './EllipsisButton.module.scss';

export const EllipsisButton = () => {
  return (
    <Button type="text" className={styles.button} icon={<EllipsisOutlined />} />
  );
};
