import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      success
    }
  }
`;

export const ME_QUERY = gql`
  query Me {
    me
  }
`;
