import { gql } from '@apollo/client';

export const GET_SAVED_CITIES_PAGINATED = gql`
  query GetSavedCitiesPaginated($query: CitiesQueryInput!) {
    getSavedCitiesPaginated(query: $query) {
      edges {
        node {
          id
          cityName
          lat
          lon
          isPinned
          weather {
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
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_CITY_SUGGESTIONS = gql`
  query GetCitySuggestions($input: CitySearchInput!) {
    getCitySuggestions(input: $input) {
      name
      country
      lat
      lon
    }
  }
`;

export const GET_SAVED_CITY_BY_NAME = gql`
  query GetSavedCityByName($cityName: String!) {
    getSavedCityByName(cityName: $cityName) {
      id
      cityName
      lat
      lon
      isPinned
      weather {
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
