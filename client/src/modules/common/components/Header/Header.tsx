import { Flex, Typography } from 'antd';
import { Shadow } from '../Shadow/Shadow';
import { EllipsisButton } from '../Button/EllipsisButton/EllipsisButton';
import { Link } from 'react-router-dom';
import styles from './Header.module.scss';

const { Title } = Typography;

export const Header = () => {
  return (
    <Flex align="center" justify="space-between" style={{ height: '100%' }}>
      <Shadow type="text" direction="bottom">
        <Link to="/" className={styles.link}>
          <Title style={{ margin: 0 }} level={3}>
            Weather
          </Title>
        </Link>
      </Shadow>
      <EllipsisButton />
    </Flex>
  );
};
