import { Flex } from 'antd';

export const CenteredLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex
      align="center"
      justify="center"
      style={{
        minHeight: '100vh',
        background: '#D7E3F8',
      }}
    >
      {children}
    </Flex>
  );
};
