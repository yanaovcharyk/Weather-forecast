import { gql } from '@apollo/client';

export const ADD_SAVED_CITY_MUTATION = gql`
  mutation AddSavedCity($input: AddCityInput!) {
    addSavedCity(input: $input) {
      id
      cityName
      lat
      lon
      isPinned
    }
  }
`;

export const UPDATE_SAVED_CITY_MUTATION = gql`
  mutation UpdateSavedCity($id: ID!, $input: UpdateCityInput!) {
    updateSavedCity(id: $id, input: $input) {
      id
      isPinned
    }
  }
`;

export const REMOVE_SAVED_CITY_MUTATION = gql`
  mutation RemoveSavedCity($id: ID!) {
    removeSavedCity(id: $id) {
      id
    }
  }
`;

export const REMOVE_ALL_SAVED_CITIES = gql`
  mutation RemoveAllSavedCities {
    removeAllSavedCities
  }
`;
