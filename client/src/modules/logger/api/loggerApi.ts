import { gql } from '@apollo/client';

export const SEND_CLIENT_LOGS_MUTATION = gql`
  mutation SendClientLogs($input: [ClientLogInput!]!) {
    sendClientLogs(input: $input)
  }
`;
