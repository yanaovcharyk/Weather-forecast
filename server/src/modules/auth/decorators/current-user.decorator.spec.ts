import { CurrentUser, mapJwtToUser } from './current-user.decorator';
import { GqlExecutionContext } from '@nestjs/graphql';

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
        email: 'test@mail.com',
      }),
    ).toEqual({
      id: '123',
      email: 'test@mail.com',
    });
  });
});