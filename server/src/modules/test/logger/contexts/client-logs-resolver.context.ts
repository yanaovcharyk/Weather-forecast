import { ClientLoggerService } from '@logger/services';
import { createContext } from '@test/utils/create-context';
import { ClientLogsResolver } from '@logger/resolvers/client-logs.resolver';

export function createClientLoggerServiceMock() {
  return {
    writeLogs: jest.fn(),
  };
}

export type ClientLogsResolverTestContext = {
  resolver: ClientLogsResolver;
  clientLoggerService: ReturnType<
    typeof createClientLoggerServiceMock
  >;
};

export async function createClientLogsResolverContext(): Promise<ClientLogsResolverTestContext> {
  const clientLoggerService =
    createClientLoggerServiceMock();

  const resolver = await createContext(
    ClientLogsResolver,
    [
      {
        provide: ClientLoggerService,
        useValue: clientLoggerService,
      },
    ],
  );

  return {
    resolver,
    clientLoggerService,
  };
}
