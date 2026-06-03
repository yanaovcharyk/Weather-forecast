import { gql } from '@apollo/client';

export const GET_WEATHER_DETAILS = gql`
  query GetWeatherDetails($input: GetWeatherInput!) {
    getWeatherDetails(input: $input) {
      current {
        temp
        feelsLike
        humidity
        windSpeed
        pressure
        description
        icon
        sunrise
        sunset
      }

      daily {
        date
        min
        max
        description
        icon
        humidity
        pressure
        clouds
        windSpeed
        pop
        feelsLike
      }

      hourly {
        time
        temp
        feelsLike
        icon
      }

      meta {
        timezone
      }
    }
  }
`;

export const GET_CITY_BY_ID = gql`
  query GetCityById($id: ID!) {
    city(id: $id) {
      id
      city
      lat
      lon
    }
  }
`;
