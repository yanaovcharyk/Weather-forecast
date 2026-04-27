import { ConfigProvider, theme as antdTheme } from 'antd';
import type { ReactNode } from 'react';

const { defaultAlgorithm } = antdTheme;

type Props = {
  children: ReactNode;
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
            extraColor: '#234C75',
            colorText: '#F0F6FF',
            colorBgContainer: '#F0F6FF',
            bodyPaddingSM: 0,
            lineWidth: 0,
            boxShadow: '0 4px 4px rgba(0, 0, 0, 0.5)',
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};
