import { Typography } from 'antd';
import classNames from 'classnames';
import type { TitleProps as AntTitleProps } from 'antd/es/typography/Title';
import styles from './AppTitle.module.scss';

const { Title: AntTitle } = Typography;

type Props = AntTitleProps & {
  children: React.ReactNode;
};

export const AppTitle = ({ className, style, ...props }: Props) => {
  return (
    <AntTitle
      {...props}
      className={classNames(styles.title, className)}
      style={style}
    />
  );
};
