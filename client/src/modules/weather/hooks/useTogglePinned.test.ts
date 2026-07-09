import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useMutation } from '@apollo/client/react';
import { useTogglePinned } from './useTogglePinned';
import { createMutationResult } from '@/common/testing/factories';
import { GraphQLTypename } from '@/weather/types';

vi.mock('@apollo/client/react');

type UpdateCityMutation = {
  updateSavedCity: {
    __typename: GraphQLTypename.CityOutput;
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
}) => Promise<void>;

describe('useTogglePinned', () => {
  const mutate = vi.fn<MutateFn>();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useMutation).mockReturnValue([
      mutate,
      createMutationResult(),
    ] as unknown as ReturnType<typeof useMutation>);
  });

  it('pins city with optimistic response when city is not pinned', async () => {
    const { result } = renderHook(() => useTogglePinned());

    await act(async () => {
      await result.current.togglePinned('1', false);
    });

    expect(mutate).toHaveBeenCalledWith({
      variables: {
        id: '1',
        input: {
          isPinned: true,
        },
      },
      optimisticResponse: {
        updateSavedCity: {
          __typename: GraphQLTypename.CityOutput,
          id: '1',
          isPinned: true,
        },
      },
    });
  });

  it('unpins city with optimistic response when city is pinned', async () => {
    const { result } = renderHook(() => useTogglePinned());

    await act(async () => {
      await result.current.togglePinned('1', true);
    });

    expect(mutate).toHaveBeenCalledWith({
      variables: {
        id: '1',
        input: {
          isPinned: false,
        },
      },
      optimisticResponse: {
        updateSavedCity: {
          __typename: GraphQLTypename.CityOutput,
          id: '1',
          isPinned: false,
        },
      },
    });
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
