import { Flex, Typography, theme } from 'antd';
import styles from './InfoGrid.module.scss';

type InfoItem = {
  label: string;
  value: string | number;
};

type Props = {
  items: InfoItem[];
  column?: number;
};

export const InfoGrid = ({ items, column = 2 }: Props) => {
  const { token } = theme.useToken();

  const rows = [];
  for (let i = 0; i < items.length; i += column) {
    rows.push(items.slice(i, i + column));
  }

  return (
    <Flex vertical gap={8} className={styles.wrapper}>
      {rows.map((row, idx) => (
        <div
          key={idx}
          className={styles.row}
          style={{ borderRadius: token.borderRadius }}
        >
          {row.map((item) => (
            <div key={item.label} className={styles.item}>
              <Typography.Text
                className={styles.label}
                style={{
                  fontSize: token.fontSizeSM,
                  color: token.colorText,
                }}
              >
                {item.label}
              </Typography.Text>

              <Typography.Text
                strong
                className={styles.value}
                style={{
                  fontSize: token.fontSize,
                  color: token.colorText,
                }}
              >
                {item.value}
              </Typography.Text>
            </div>
          ))}
        </div>
      ))}
    </Flex>
  );
};
