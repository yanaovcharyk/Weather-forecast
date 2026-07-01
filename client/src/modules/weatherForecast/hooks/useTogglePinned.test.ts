import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useMutation } from '@apollo/client/react';
import { useTogglePinned } from './useTogglePinned';
import { createMutationResult } from '@/common/testing/factories';

vi.mock('@apollo/client/react');

type UpdateCityMutation = {
  updateSavedCity: {
    __typename: 'CityOutput';
    id: string;
    isPinned: boolean;
  } | null;
};

type UpdateCityVariables = {
  id: string;
  input: {
    isPinned: boolean;
  };
};

type MutateFn = (options: {
  variables: UpdateCityVariables;
  optimisticResponse: UpdateCityMutation;
  update?: (
    cache: {
      modify: ReturnType<typeof vi.fn>;
      identify: ReturnType<typeof vi.fn>;
    },
    result: { data?: UpdateCityMutation | null },
  ) => void;
}) => Promise<void>;

describe('useTogglePinned', () => {
  const mutate = vi.fn<MutateFn>();

  let cacheModifyMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();

    cacheModifyMock = vi.fn();

    vi.mocked(useMutation).mockReturnValue([
      mutate,
      createMutationResult(),
    ] as unknown as ReturnType<typeof useMutation>);
  });

  it('calls cache.modify when city exists', async () => {
    mutate.mockImplementation(async (options) => {
      options.update?.(
        {
          modify: cacheModifyMock,
          identify: vi.fn(() => 'CityOutput:1'),
        },
        {
          data: {
            updateSavedCity: {
              __typename: 'CityOutput',
              id: '1',
              isPinned: true,
            },
          },
        },
      );
    });

    const { result } = renderHook(() => useTogglePinned());

    await act(async () => {
      await result.current.togglePinned('1', false);
    });

    expect(cacheModifyMock).toHaveBeenCalledTimes(1);
  });

  it('returns city.isPinned from cache.modify field resolver', async () => {
    mutate.mockImplementation(async (options) => {
      options.update?.(
        {
          modify: cacheModifyMock,
          identify: vi.fn(() => 'CityOutput:1'),
        },
        {
          data: {
            updateSavedCity: {
              __typename: 'CityOutput',
              id: '1',
              isPinned: true,
            },
          },
        },
      );
    });

    const { result } = renderHook(() => useTogglePinned());

    await act(async () => {
      await result.current.togglePinned('1', false);
    });

    expect(mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: {
          id: '1',
          input: {
            isPinned: true,
          },
        },
      }),
    );

    const modifyArg = cacheModifyMock.mock.calls[0][0];

    expect(modifyArg.id).toBe('CityOutput:1');
    expect(modifyArg.fields.isPinned()).toBe(true);
  });

  it('does not call cache.modify when no city returned', async () => {
    mutate.mockImplementationOnce(async (options) => {
      options.update?.(
        {
          modify: cacheModifyMock,
          identify: vi.fn(),
        },
        {
          data: {
            updateSavedCity: null,
          },
        },
      );
    });

    const { result } = renderHook(() => useTogglePinned());

    await act(async () => {
      await result.current.togglePinned('1', false);
    });

    expect(cacheModifyMock).not.toHaveBeenCalled();
  });

  it('returns loading state', () => {
    vi.mocked(useMutation).mockReturnValue([
      mutate,
      createMutationResult({
        loading: true,
      }),
    ] as unknown as ReturnType<typeof useMutation>);

    const { result } = renderHook(() => useTogglePinned());

    expect(result.current.loading).toBe(true);
  });
});
