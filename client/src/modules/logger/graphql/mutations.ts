export const SEND_CLIENT_LOGS_MUTATION_STRING = `
  mutation SendClientLogs($input: [ClientLogInput!]!) {
    sendClientLogs(input: $input)
  }
`;
