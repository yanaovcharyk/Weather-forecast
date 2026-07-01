import { MockUser } from '@auth/testing/fixtures';
import { createUsersResolverContext } from '@users/testing';

describe('UsersResolver', () => {
  it('me should return current user', async () => {
    const ctx = await createUsersResolverContext();

    const result = await ctx.resolver.me({
      id: MockUser.id,
    });

    expect(result).toEqual({
      userId: MockUser.id,
    });
  });

  it('me should handle missing user id', async () => {
    const ctx = await createUsersResolverContext();

    const result = await ctx.resolver.me({ id: undefined } as any);

    expect(result).toEqual({
      userId: undefined,
    });
  });
});
