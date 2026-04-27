import { Card, type CardProps } from 'antd';

type Props = CardProps & {
  fullWidth?: boolean;
};

export const FormCard = ({ children, fullWidth, ...props }: Props) => {
  return (
    <Card
      {...props}
      styles={{
        body: {
          padding: 0,
        },
      }}
      style={{
        width: fullWidth ? '100%' : 400,
        ...props.style,
      }}
    >
      {children}
    </Card>
  );
};
