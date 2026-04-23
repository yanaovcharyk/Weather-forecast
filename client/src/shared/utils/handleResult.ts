import { notifyError, notifySuccess } from './notify';
import { mapErrorCodeToMessage } from './mapErrorCodeToMessage';

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
