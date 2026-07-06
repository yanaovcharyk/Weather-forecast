import { gql } from '@apollo/client';

export const GET_SAVED_CITY = gql`
  query GetSavedCity(
    $id: ID
    $cityName: String
    $includeWeather: Boolean! = false
  ) {
    getSavedCity(id: $id, cityName: $cityName) {
      id
      cityName
      lat
      lon
      isPinned
      weather @include(if: $includeWeather) {
        temperature
        min
        max
        description
        next3Days {
          min
          max
          description
        }
      }
    }
  }
`;
