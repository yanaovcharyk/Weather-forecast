import { ConfigProvider, theme as antdTheme } from 'antd';
import type { ReactNode } from 'react';
import styles from './ThemeProvider.module.scss';

const { defaultAlgorithm } = antdTheme;

type Props = {
  children?: ReactNode;
};

export const ThemeProvider = ({ children }: Props) => {
  return (
    <ConfigProvider
      theme={{
        algorithm: defaultAlgorithm,

        token: {
          colorPrimary: '#234C75',
          colorText: '#F0F6FF',
          colorTextPlaceholder: '#234C75',
          colorTextHeading: '#234C75',
          colorBgLayout: '#D7E3F8',
          borderRadius: 8,
          colorBgContainer: '#F0F6FF',
          colorIcon: '#234C75',
          colorIconHover: '#234C75',

          marginXXS: 6,
          marginXS: 8,
          marginLG: 32,
          fontSize: 12,
          fontSizeSM: 10,
          fontSizeXL: 18,
          controlHeightXS: 16,
        },

        components: {
          Button: {
            colorPrimary: '#234C75',
            colorPrimaryHover: '#2d68a3',
            colorPrimaryActive: '#3379bf',
            colorText: '#234C75',
          },

          Input: {
            hoverBorderColor: '#234C75',
            activeBorderColor: '#3379bf',
            colorBgContainer: '#ffffff',
            colorText: '#234C75',
          },

          Select: {
            hoverBorderColor: '#234C75',
            activeBorderColor: '#3379bf',
            colorBgContainer: '#ffffff',
            colorText: '#234C75',
            colorTextPlaceholder: '#234C75',
          },

          Card: {
            headerBg: '#F0F6FF',
            actionsBg: '#234C75',
            extraColor: '#234C75',
            colorText: '#F0F6FF',
            colorBgContainer: '#F0F6FF',
            bodyPaddingSM: 0,
            lineWidth: 0,
            boxShadow: '0 4px 4px rgba(0, 0, 0, 0.5)',
            borderRadius: 8,
            bodyPadding: 16,
          },

          Layout: {
            bodyBg: '#D7E3F8',
            footerBg: '#F0F6FF',
            headerBg: '#F0F6FF',
            headerColor: '#234C75',
            footerPadding: '8px 24px 16px',
            headerPadding: '0 24px',
            headerHeight: 44,
          },

          Typography: {
            titleMarginTop: 0,
            titleMarginBottom: 0,
          },

          Alert: {
            colorTextHeading: '#234C75',
            colorText: '#234C75',
          },
        },
      }}
    >
      <div className={styles.themeRoot}>{children}</div>
    </ConfigProvider>
  );
};
