import { CurrentUser, mapJwtToUser } from './current-user.decorator';
import { GqlExecutionContext } from '@nestjs/graphql';
import { TokenType } from '@auth/types';

jest.mock('@nestjs/graphql', () => ({
  GqlExecutionContext: {
    create: jest.fn(),
  },
}));

describe('mapJwtToUser', () => {
  it('should map payload correctly', () => {
    expect(
      mapJwtToUser({
        userId: '123',
        type: TokenType.ACCESS,
      }),
    ).toEqual({
      id: '123',
    });
  });
});
