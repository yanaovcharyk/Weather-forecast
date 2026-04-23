import { Button, type ButtonProps } from 'antd';

type Props = Omit<ButtonProps, 'type'>;

export const TextButton = ({ children, ...props }: Props) => {
  return (
    <Button type="text" {...props}>
      {children}
    </Button>
  );
};
