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
          colorText: '#fff',
          colorTextPlaceholder: '#234C75',
          colorTextHeading: '#234C75',
          colorBgLayout: '#D7E3F8',
          borderRadius: 8,
          colorBgContainer: '#F0F6FF',
        },

        components: {
          Button: {
            colorPrimary: '#234C75',
            colorPrimaryHover: '#2d68a3',
            colorPrimaryActive: '#3379bf',
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
            colorBgContainer: '#F0F6FF',
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};
