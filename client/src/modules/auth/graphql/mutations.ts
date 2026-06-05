import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      success
    }
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout {
      success
    }
  }
`;

export const REFRESH_TOKENS_MUTATION_STRING = `
  mutation RefreshTokens {
    refreshTokens {
      success
    }
  }
`;
