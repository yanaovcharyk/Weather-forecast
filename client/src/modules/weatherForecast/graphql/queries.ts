import { gql } from '@apollo/client';

export const CITIES_PAGINATED = gql`
  query CitiesPaginated($query: CitiesQueryInput!) {
    citiesPaginated(query: $query) {
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

export const SEARCH_CITIES = gql`
  query SearchCities($input: CitySearchInput!) {
    searchCities(input: $input) {
      name
      country
      lat
      lon
    }
  }
`;

export const GET_EXISTS_CITY_BY_NAME = gql`
  query GetCityByName($cityName: String!) {
    cityByName(cityName: $cityName) {
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
