import { Button, Flex, Typography } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { Shadow } from '../Shadow/Shadow';

const { Title } = Typography;

export const Header = () => {
  return (
    <Flex align="center" justify="space-between" style={{ height: '100%' }}>
      <Shadow type="text" direction="bottom">
        <Title style={{ margin: 0 }} level={3}>
          Weather
        </Title>
      </Shadow>

      <Button
        type="text"
        icon={
          <EllipsisOutlined
            style={{
              fontSize: 18,
              fontWeight: 700,
            }}
          />
        }
      />
    </Flex>
  );
};
