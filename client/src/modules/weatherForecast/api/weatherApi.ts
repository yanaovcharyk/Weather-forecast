import { gql } from '@apollo/client';

export const CITIES_QUERY = gql`
  query Cities {
    cities {
      id
      city
      lat
      lon

      weather {
        temperature
        description
        next3DaysTemperature
        next3DaysDescription
      }
    }
  }
`;

export const ADD_CITY_MUTATION = gql`
  mutation AddCity($input: AddCityInput!) {
    addCity(input: $input) {
      id
      city
      lat
      lon

      weather {
        temperature
        description
        next3DaysTemperature
        next3DaysDescription
      }
    }
  }
`;

export const REMOVE_CITY_MUTATION = gql`
  mutation RemoveCity($id: Int!) {
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
