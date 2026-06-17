import { renderHook, act } from '@testing-library/react';
import { useMutation } from '@apollo/client/react';

import { useLogout } from './useLogout';
import { createMutationMock } from '../../test/mocks/mutation.mock';

vi.mock('@apollo/client/react');

describe('useLogout', () => {
  const mutation = createMutationMock();

  beforeEach(() => {
    vi.mocked(useMutation).mockReturnValue([
      mutation.mutate,
      mutation.result as useMutation.Result<unknown>,
    ]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('calls logout mutation', async () => {
    mutation.mutate.mockResolvedValue({});

    const { result } = renderHook(() => useLogout());

    await act(async () => {
      await result.current();
    });

    expect(mutation.mutate).toHaveBeenCalledTimes(1);
  });
});
