import { Flex, Layout, Grid } from 'antd';
import { theme } from 'antd';

const { Header, Content, Footer } = Layout;

export const PageLayout = ({
  header,
  footer,
  children,
}: {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) => {
  const { token } = theme.useToken();
  const screens = Grid.useBreakpoint();

  const isMobile = !screens.md;

  return (
    <Layout
      style={{
        minHeight: '100vh',
        background: '#D7E3F8',
      }}
    >
      {header && (
        <Header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            background: token.colorBgContainer,
            padding: '0 24px',
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            height: 44,
          }}
        >
          {header}
        </Header>
      )}

      <Content
        style={{
          padding: isMobile ? '0 24px 24px' : '24px 24px 24px',
        }}
      >
        <Flex justify="center">
          <div style={{ width: '100%', maxWidth: 1200 }}>{children}</div>
        </Flex>
      </Content>

      {footer && (
        <Footer
          style={{
            position: 'sticky',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            bottom: 0,
            zIndex: 1000,
            padding: '0',
            boxShadow: '0 -4px 12px rgba(0,0,0,0.3)',
          }}
        >
          {footer}
        </Footer>
      )}
    </Layout>
  );
};
