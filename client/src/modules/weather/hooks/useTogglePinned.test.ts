import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useTogglePinned } from './useTogglePinned';
import { mockApolloMutation } from '@/common/testing/mocks/apollo.mock';
import { GraphQLTypename } from '@/weather/types';

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

  const setup = () => {
    const { result } = renderHook(() => useTogglePinned());

    const togglePinned = async (id: string, isPinned: boolean) => {
      await act(async () => {
        await result.current.togglePinned(id, isPinned);
      });
    };

    return {
      result,
      togglePinned,
    };
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockApolloMutation({
      mutate,
    });
  });

  it('pins city with optimistic response when city is not pinned', async () => {
    const { togglePinned } = setup();

    await togglePinned('1', false);

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
    const { togglePinned } = setup();

    await togglePinned('1', true);

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
    mockApolloMutation({
      mutate,
      result: {
        loading: true,
      },
    });

    const { result } = setup();

    expect(result.current.loading).toBe(true);
  });
});
