import { Card, type CardProps, theme } from 'antd';

type InfoCardProps = CardProps & {
  headerLeft: React.ReactNode;
  headerRight?: React.ReactNode;
  headerStyle?: React.CSSProperties;
};

export const InfoCard = ({
  children,
  headerLeft,
  headerRight,
  headerStyle,
  ...props
}: InfoCardProps) => {
  const { token } = theme.useToken();

  return (
    <Card
      {...props}
      styles={{
        header: {
          padding: '4px 16px',
          minHeight: 'unset',
          lineHeight: 1,
          display: 'flex',
          alignItems: 'center',
          background: token.colorBgContainer,
          color: token.colorTextHeading,
          border: 'none',
          ...headerStyle,
        },

        body: {
          padding: 0,
        },
      }}
      style={{
        width: '100%',
        border: 'none',
        overflow: 'hidden',
        borderRadius: token.borderRadius * 2,
        boxShadow: '0 4px 4px rgba(0,0,0,0.50)',
        ...props.style,
      }}
      title={
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',

            position: 'sticky',
            top: 0,
            zIndex: 1,
            background: token.colorBgContainer,
          }}
        >
          {headerLeft}
          {headerRight}
        </div>
      }
    >
      {children}
    </Card>
  );
};
