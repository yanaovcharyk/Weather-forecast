import { gql } from '@apollo/client';

export const ADD_CITY_MUTATION = gql`
  mutation AddCity($input: AddCityInput!) {
    addCity(input: $input) {
      id
      cityName
      lat
      lon
      isPinned
    }
  }
`;

export const UPDATE_CITY_MUTATION = gql`
  mutation UpdateCity($id: ID!, $input: UpdateCityInput!) {
    updateCity(id: $id, input: $input) {
      id
      isPinned
    }
  }
`;

export const REMOVE_CITY_MUTATION = gql`
  mutation RemoveCity($id: ID!) {
    removeCity(id: $id) {
      id
    }
  }
`;

export const REMOVE_ALL_CITIES = gql`
  mutation RemoveAllCities {
    removeAllCities
  }
`;
