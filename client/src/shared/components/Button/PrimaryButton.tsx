import { Button, type ButtonProps } from 'antd';

type Props = Omit<ButtonProps, 'type' | 'danger'> & {
  loadingText?: string;
};

export const PrimaryButton = ({
  loading,
  loadingText,
  children,
  ...props
}: Props) => {
  return (
    <Button type="primary" loading={loading} {...props}>
      {loading ? (loadingText ?? 'Loading...') : children}
    </Button>
  );
};
