import { gql } from '@apollo/client';

export const CITIES_QUERY = gql`
  query Cities {
    cities {
      id
      city
      weather {
        city
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
      weather {
        city
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
  query SearchCities($query: String!) {
    searchCities(query: $query) {
      name
      country
      lat
      lon
    }
  }
`;

export const GET_WEATHER = gql`
  query GetWeather($lat: Float!, $lon: Float!) {
    getWeather(lat: $lat, lon: $lon) {
      city
      temperature
      description
      next3DaysTemperature
      next3DaysDescription
    }
  }
`;
