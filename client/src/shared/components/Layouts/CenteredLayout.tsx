import { Flex } from 'antd';

export const CenteredLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex
      align="center"
      justify="center"
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top, #E6F0FF 0%, #91aad6 50%, #6d90cd 100%)',
      }}
    >
      {children}
    </Flex>
  );
};
