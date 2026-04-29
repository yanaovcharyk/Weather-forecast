import { Card, type CardProps } from 'antd';

export const FormCard = ({ children, ...props }: CardProps) => {
  return (
    <Card
      {...props}
      style={{
        width: '100%',
        ...props.style,
      }}
    >
      {children}
    </Card>
  );
};
