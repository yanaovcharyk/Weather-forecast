import { useMutation } from '@apollo/client/react';
import { UPDATE_SAVED_CITY_MUTATION } from '@/weather/graphql';
import { GraphQLTypename } from '@/weather/types';

export type UpdateCityMutation = {
  updateSavedCity: {
    __typename: GraphQLTypename.CityOutput;
    id: string;
    isPinned: boolean;
  };
};

export type UpdateCityVariables = {
  id: string;
  input: {
    isPinned: boolean;
  };
};

export const useTogglePinned = () => {
  const [toggleCityPinMutation, { loading }] = useMutation<
    UpdateCityMutation,
    UpdateCityVariables
  >(UPDATE_SAVED_CITY_MUTATION);

  const togglePinned = async (id: string, currentPinned: boolean) => {
    await toggleCityPinMutation({
      variables: {
        id,
        input: {
          isPinned: !currentPinned,
        },
      },

      optimisticResponse: {
        updateSavedCity: {
          __typename: GraphQLTypename.CityOutput,
          id,
          isPinned: !currentPinned,
        },
      },
    });
  };

  return {
    togglePinned,
    loading,
  };
};
