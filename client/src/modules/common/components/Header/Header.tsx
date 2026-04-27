import { Button, Flex, theme } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import Title from 'antd/es/typography/Title';

export const Header = () => {
  const { token } = theme.useToken();

  return (
    <Flex align="center" justify="space-between" style={{ height: '100%' }}>
      <Title
        level={3}
        style={{ margin: 0, textShadow: '0 2px 4px rgba(0, 0, 0, 0.25)' }}
      >
        Weather
      </Title>

      <Button
        type="text"
        icon={
          <EllipsisOutlined
            style={{
              fontSize: 24,
              fontWeight: 700,
            }}
          />
        }
        style={{ borderRadius: 8, color: token.colorPrimary }}
      />
    </Flex>
  );
};
