import { Flex, theme } from 'antd';
import Text from 'antd/es/typography/Text';

export const EmptyState = () => {
  const { token } = theme.useToken();

  return (
    <Flex justify="center">
      <Text type="secondary" style={{ paddingTop: token.marginLG }}>
        No cities yet 🌥
      </Text>
    </Flex>
  );
};
