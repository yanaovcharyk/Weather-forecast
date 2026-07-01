import {
  createUserServiceContext,
  UserServiceTestContext,
} from '@users/testing/contexts/user-service.context';

describe('UserService', () => {
  let ctx: UserServiceTestContext;

  beforeEach(async () => {
    ctx = await createUserServiceContext();
  });

  it('findByEmail should call repository.findOne with email', async () => {
    const user = { id: '1', email: 'test@example.com' };
    ctx.repo.findOne.mockResolvedValue(user);

    const result = await ctx.service.findByEmail('test@example.com');

    expect(ctx.repo.findOne).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
    });
    expect(result).toEqual(user);
  });

  it('findById should call repository.findOne with id', async () => {
    const user = { id: '1', email: 'test@example.com' };
    ctx.repo.findOne.mockResolvedValue(user);

    const result = await ctx.service.findById('1');

    expect(ctx.repo.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    expect(result).toEqual(user);
  });

  it('create should call repository.create and save', async () => {
    const data = {
      email: 'new@example.com',
      password: 'hashed',
      salt: 'salt',
    };
    const created = { id: '2', ...data };
    ctx.repo.create.mockReturnValue(created);
    ctx.repo.save.mockResolvedValue(created);

    const result = await ctx.service.createUser(data);

    expect(ctx.repo.create).toHaveBeenCalledWith(data);
    expect(ctx.repo.save).toHaveBeenCalledWith(created);
    expect(ctx.logger.info).toHaveBeenCalledWith('User created', {
      userId: created.id,
    });
    expect(result).toEqual(created);
  });

  it('incrementRefreshTokenVersion should increment and return current version', async () => {
    ctx.repo.findOne.mockResolvedValue({
      id: '1',
      refreshTokenVersion: 2,
    });

    const result = await ctx.service.incrementRefreshTokenVersion('1');

    expect(ctx.repo.increment).toHaveBeenCalledWith(
      { id: '1' },
      'refreshTokenVersion',
      1,
    );
    expect(result).toBe(2);
  });

  it('incrementRefreshTokenVersion should throw when user is missing after update', async () => {
    ctx.repo.findOne.mockResolvedValue(null);

    await expect(ctx.service.incrementRefreshTokenVersion('1')).rejects.toThrow(
      'User not found',
    );
  });
});
