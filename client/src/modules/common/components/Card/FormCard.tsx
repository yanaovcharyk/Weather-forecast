import { Card, type CardProps } from 'antd';

type Props = CardProps & {
  fullWidth?: boolean;
};

export const FormCard = ({ children, fullWidth, ...props }: Props) => {
  return (
    <Card
      {...props}
      style={{
        width: fullWidth ? '100%' : 400,
        ...props.style,
      }}
    >
      {children}
    </Card>
  );
};
