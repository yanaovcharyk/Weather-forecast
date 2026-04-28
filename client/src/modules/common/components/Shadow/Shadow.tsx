import classNames from 'classnames';
import styles from './Shadow.module.scss';

type ShadowType = 'text' | 'block';
type Direction = 'top' | 'bottom' | 'left' | 'right' | 'all';

type Props = {
  children: React.ReactNode;
  type?: ShadowType;
  direction?: Direction;
  className?: string;
};

export const Shadow = ({
  children,
  type = 'block',
  direction = 'bottom',
  className,
}: Props) => {
  return (
    <div
      className={classNames(
        styles[`${type}${capitalize(direction)}`],
        className,
      )}
    >
      {children}
    </div>
  );
};

const capitalize = (v: string) => v.charAt(0).toUpperCase() + v.slice(1);
