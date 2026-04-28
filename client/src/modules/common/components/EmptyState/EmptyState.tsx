import { Empty, Flex } from 'antd';
import styles from './EmptyState.module.scss';

export const EmptyState = () => {
  return (
    <Flex justify="center" align="center" className={styles.wrapper}>
      <Empty
        image={<img src="/cloud.svg" className={styles.image} alt="empty" />}
        description="No cities yet"
      />
    </Flex>
  );
};
