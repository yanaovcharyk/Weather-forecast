import { ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloDriver } from '@nestjs/apollo';
import { randomUUID } from 'crypto';

export const graphqlConfig: ApolloDriverConfig = {
  driver: ApolloDriver,
  autoSchemaFile: true,
  context: ({ req, res }: { req: Request, res: Response }) => ({ req, res, requestId: randomUUID() }),
};
