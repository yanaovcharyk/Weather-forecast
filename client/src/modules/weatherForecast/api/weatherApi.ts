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

export const REMOVE_CITY_MUTATION = gql`
  mutation RemoveCity($id: ID!) {
    removeCity(id: $id) {
      id
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

export const REMOVE_ALL_CITIES = gql`
  mutation RemoveAllCities {
    removeAllCities
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
