import { MockUser } from '@auth/testing/fixtures';
import { createUsersResolverContext } from '@users/testing';

describe('UsersResolver', () => {
  it('createUser should create user through user service', async () => {
    const ctx = await createUsersResolverContext();

    ctx.userService.createUserWithPassword.mockResolvedValue(MockUser);

    const result = await ctx.resolver.createUser({
      email: MockUser.email,
      password: '123456',
    });

    expect(ctx.userService.createUserWithPassword).toHaveBeenCalledWith({
      email: MockUser.email,
      password: '123456',
    });
    expect(result).toEqual(MockUser);
  });

  it('me should return current user', async () => {
    const ctx = await createUsersResolverContext();
    ctx.userService.findById.mockResolvedValue(MockUser);

    const result = await ctx.resolver.me({
      id: MockUser.id,
    });

    expect(ctx.userService.findById).toHaveBeenCalledWith(MockUser.id);
    expect(result).toEqual(MockUser);
  });

  it('me should throw when user is not found', async () => {
    const ctx = await createUsersResolverContext();
    ctx.userService.findById.mockResolvedValue(null);

    await expect(ctx.resolver.me({ id: MockUser.id })).rejects.toThrow(
      'Unauthorized',
    );
  });
});
