import { of } from 'rxjs';
import { GqlExecutionContext } from '@nestjs/graphql';

import { LoggerContextService } from '@logger/services';
import { GraphqlContextInterceptor } from './graphql-context.interceptor';

jest.mock('@nestjs/graphql', () => ({
  GqlExecutionContext: {
    create: jest.fn(),
  },
}));

describe('GraphqlContextInterceptor', () => {
  let interceptor: GraphqlContextInterceptor;
  let contextService: {
    run: jest.Mock;
  };

  const gqlContext = {
    requestId: 'request-1',
    jwtPayload: {
      userId: 'user-1',
    },
    req: {
      ip: '127.0.0.1',
    },
  };

  beforeEach(() => {
    contextService = {
      run: jest.fn((_, callback) => callback()),
    };

    interceptor = new GraphqlContextInterceptor(
      contextService as unknown as LoggerContextService,
    );

    jest.mocked(GqlExecutionContext.create).mockReturnValue({
      getContext: jest.fn().mockReturnValue(gqlContext),
      getInfo: jest.fn().mockReturnValue({
        fieldName: 'cities',
      }),
    } as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should run request handler inside logger context', () => {
    const next = {
      handle: jest.fn().mockReturnValue(of('result')),
    };

    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    const result = interceptor.intercept({} as any, next);

    expect(result).toBe(next.handle.mock.results[0].value);
    expect(GqlExecutionContext.create).toHaveBeenCalledWith({});
    expect(contextService.run).toHaveBeenCalledWith(
      {
        requestId: 'request-1',
        userId: 'user-1',
        ip: '127.0.0.1',
      },
      expect.any(Function),
    );
    expect(next.handle).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith('FIELD:', 'cities');

    logSpy.mockRestore();
  });
});
