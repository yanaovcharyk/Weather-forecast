import { Typography } from 'antd';
import styles from './AppText.module.scss';
import classNames from 'classnames';
import type { TextProps as AntTextProps } from 'antd/es/typography/Text';

const { Text: AntText } = Typography;

type Props = AntTextProps & {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  underline?: boolean;
  strong?: boolean;
};

export const AppText = ({
  children,
  size = 'md',
  underline,
  strong,
  className,
}: Props) => {
  return (
    <AntText
      strong={strong}
      className={classNames(
        styles[size],
        underline && styles.underline,
        className,
      )}
    >
      {children}
    </AntText>
  );
};
