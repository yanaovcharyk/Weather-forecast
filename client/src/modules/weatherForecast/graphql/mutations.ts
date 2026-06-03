import { gql } from '@apollo/client';

export const ADD_CITY_MUTATION = gql`
  mutation AddCity($input: AddCityInput!) {
    addCity(input: $input) {
      ok
      code
      city {
        id
        city
        lat
        lon
        isPinned
        weather {
          temperature
          description
          next3DaysTemperature
          next3DaysDescription
        }
      }
      existingCity {
        id
        city
        lat
        lon
        isPinned
        weather {
          temperature
          description
          next3DaysTemperature
          next3DaysDescription
        }
      }
    }
  }
`;

export const TOGGLE_CITY_PIN = gql`
  mutation TogglePinnedCity($id: ID!) {
    togglePinnedCity(id: $id) {
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
