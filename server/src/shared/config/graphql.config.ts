import { ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloDriver } from '@nestjs/apollo';
import { randomUUID } from 'crypto';
import { Request, Response } from 'express';

export const graphqlConfig: ApolloDriverConfig = {
  driver: ApolloDriver,
  autoSchemaFile: true,
  fieldResolverEnhancers: [
    'guards',
    'interceptors',
    'filters',
  ],
  context: ({ req, res }: { req: Request; res: Response }) => ({
    req,
    res,
    requestId: req.headers['x-request-id'] || randomUUID(),
  }),
};
