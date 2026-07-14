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
            condition
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

export const GET_WEATHER_DETAILS = gql`
  query GetWeatherDetails($input: GetWeatherInput!) {
    getWeatherDetails(input: $input) {
      current {
        temp
        min
        max
        feelsLike
        humidity
        windSpeed
        pressure
        description
        icon
        iconUrl
        condition
        sunrise
        sunset
      }

      daily {
        date
        min
        max
        description
        icon
        iconUrl
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
        iconUrl
      }

      meta {
        timezone
      }
    }
  }
`;
