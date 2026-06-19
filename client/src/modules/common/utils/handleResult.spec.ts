import { handleResult } from './handleResult';
import { mapErrorCodeToMessage } from './mapErrorCodeToMessage';

vi.mock('./mapErrorCodeToMessage');

describe('handleResult', () => {
  const notifySuccess = vi.fn();
  const notifyError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns true and calls success notification', () => {
    const result = handleResult(
      { ok: true },
      {
        successMessage: 'Success',
        notifyError,
        notifySuccess,
      },
    );

    expect(result).toBe(true);

    expect(notifySuccess).toHaveBeenCalledWith('Success');

    expect(notifyError).not.toHaveBeenCalled();
  });

  it('returns true without success message', () => {
    const result = handleResult(
      { ok: true },
      {
        notifyError,
        notifySuccess,
      },
    );

    expect(result).toBe(true);

    expect(notifySuccess).not.toHaveBeenCalled();
  });

  it('returns false on error', () => {
    vi.mocked(mapErrorCodeToMessage).mockReturnValue('Something went wrong');

    const result = handleResult(
      {
        ok: false,
        code: 'ERROR',
      },
      {
        notifyError,
        notifySuccess,
      },
    );

    expect(result).toBe(false);

    expect(notifyError).toHaveBeenCalledWith('Something went wrong');

    expect(notifySuccess).not.toHaveBeenCalled();
  });
});
