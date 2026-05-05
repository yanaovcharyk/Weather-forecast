import { mapErrorCodeToMessage } from './mapErrorCodeToMessage';

export const handleResult = <T extends { ok: boolean; code?: string }>(
  result: T,
  options: {
    successMessage?: string;
    notifyError: (msg: string) => void;
    notifySuccess: (msg: string) => void;
  },
) => {
  if (!result.ok) {
    options.notifyError(mapErrorCodeToMessage(result.code));
    return false;
  }

  if (options.successMessage) {
    options.notifySuccess(options.successMessage);
  }

  return true;
};
