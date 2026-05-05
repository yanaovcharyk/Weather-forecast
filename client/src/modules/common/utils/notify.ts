import { App } from 'antd';

export const useNotify = () => {
  const { message } = App.useApp();

  const notifyError = (msg: string) => {
    message.error(msg);
  };

  const notifySuccess = (msg: string) => {
    message.success(msg);
  };

  return { notifyError, notifySuccess };
};
