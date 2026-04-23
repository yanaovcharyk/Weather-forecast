import { Button, type ButtonProps } from 'antd';

type Props = Omit<ButtonProps, 'type' | 'danger'>;

export const DangerButton = ({ children, ...props }: Props) => {
  return (
    <Button type="primary" danger {...props}>
      {children}
    </Button>
  );
};
