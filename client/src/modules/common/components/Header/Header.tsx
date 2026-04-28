import { Flex, Typography } from 'antd';
import { Shadow } from '../Shadow/Shadow';
import { EllipsisButton } from '../Button/EllipsisButton/EllipsisButton';

const { Title } = Typography;

export const Header = () => {
  return (
    <Flex align="center" justify="space-between" style={{ height: '100%' }}>
      <Shadow type="text" direction="bottom">
        <Title style={{ margin: 0 }} level={3}>
          Weather
        </Title>
      </Shadow>
      <EllipsisButton />
    </Flex>
  );
};
