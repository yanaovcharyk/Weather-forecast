import { Empty, Flex } from 'antd';
import styles from './EmptyState.module.scss';

interface AppEmpty {
  description?: string;
}

export const AppEmpty = ({ description = 'No data found' }: AppEmpty) => {
  return (
    <Flex justify="center" align="center" className={styles.wrapper}>
      <Empty
        image={<img src="/cloud.svg" className={styles.image} alt="empty" />}
        description={description}
      />
    </Flex>
  );
};
