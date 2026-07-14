export const createGraphQLErrorResponse = (code: string) => ({
  errors: [
    {
      extensions: {
        code,
      },
    },
  ],
});

export const UNAUTHENTICATED_RESPONSE =
  createGraphQLErrorResponse('UNAUTHENTICATED');
