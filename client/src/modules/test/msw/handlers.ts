import { graphql } from 'msw';

export const handlers = [
  graphql.query('Me', () => {
    return Response.json({
      data: {
        me: {
          userId: '1',
        },
      },
    });
  }),

  graphql.mutation('Login', () => {
    return Response.json({
      data: {
        login: {
          success: true,
        },
      },
    });
  }),
];
