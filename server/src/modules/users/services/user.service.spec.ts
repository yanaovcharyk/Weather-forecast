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

  it('createUserWithPassword should hash password and create user with auth data', async () => {
    ctx.passwordHasher.hash.mockResolvedValue({
      hash: 'hashed',
      salt: 'salt',
    });

    const created = {
      id: '2',
      email: 'new@example.com',
    };

    ctx.repo.create.mockReturnValue(created);
    ctx.repo.save.mockResolvedValue(created);
    ctx.authRepo.create.mockReturnValue({
      userId: created.id,
      salt: 'salt',
    });

    const result = await ctx.service.createUserWithPassword({
      email: 'new@example.com',
      password: 'password',
    });

    expect(ctx.passwordHasher.hash).toHaveBeenCalledWith({
      password: 'password',
    });
    expect(ctx.repo.create).toHaveBeenCalledWith({
      email: 'new@example.com',
    });
    expect(ctx.authRepo.create).toHaveBeenCalledWith({
      userId: created.id,
      passwordHash: 'hashed',
      salt: 'salt',
    });
    expect(ctx.logger.info).toHaveBeenCalledWith('User created', {
      userId: created.id,
    });
    expect(result).toEqual(created);
  });

  it('findAuthByUserId should call auth repository.findOne with userId', async () => {
    const userAuth = { id: 'auth-1', userId: '1' };
    ctx.authRepo.findOne.mockResolvedValue(userAuth);

    const result = await ctx.service.findAuthByUserId({ userId: '1' });

    expect(ctx.authRepo.findOne).toHaveBeenCalledWith({
      where: { userId: '1' },
    });
    expect(result).toEqual(userAuth);
  });

  it('incrementRefreshTokenVersion should increment and return current version', async () => {
    ctx.authRepo.findOne.mockResolvedValue({
      id: '1',
      userId: '1',
      refreshTokenVersion: 2,
    });

    const result = await ctx.service.incrementRefreshTokenVersion({
      userId: '1',
    });

    expect(ctx.authRepo.increment).toHaveBeenCalledWith(
      { userId: '1' },
      'refreshTokenVersion',
      1,
    );
    expect(result).toBe(2);
  });

  it('incrementRefreshTokenVersion should throw when user is missing after update', async () => {
    ctx.authRepo.findOne.mockResolvedValue(null);

    await expect(
      ctx.service.incrementRefreshTokenVersion({ userId: '1' }),
    ).rejects.toThrow('User auth not found');
  });
});
