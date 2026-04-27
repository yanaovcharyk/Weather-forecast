import { notifyError, notifySuccess } from '../utils/notify';
import { mapErrorCodeToMessage } from '../utils/mapErrorCodeToMessage';

export const handleResult = <T extends { ok: boolean; code?: string }>(
  result: T,
  options?: { successMessage?: string },
) => {
  if (!result.ok) {
    notifyError(mapErrorCodeToMessage(result.code));
    return false;
  }

  if (options?.successMessage) {
    notifySuccess(options.successMessage);
  }

  return true;
};
