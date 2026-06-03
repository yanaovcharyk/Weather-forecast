import { gql } from '@apollo/client';

export const CITIES_PAGINATED = gql`
  query CitiesPaginated($query: CitiesQueryInput!) {
    citiesPaginated(query: $query) {
      edges {
        node {
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

export const GET_WEATHER = gql`
  query GetWeather($input: GetWeatherInput!) {
    getWeather(input: $input) {
      temperature
      description
      next3DaysTemperature
      next3DaysDescription
    }
  }
`;
