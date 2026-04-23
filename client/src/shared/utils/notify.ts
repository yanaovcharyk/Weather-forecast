import { message } from 'antd';

export const notifyError = (msg: string) => {
  message.error(msg);
};

export const notifySuccess = (msg: string) => {
  message.success(msg);
};
