import {
  createUserServiceContext,
  UserServiceTestContext,
} from '@users/test/contexts/user-service.context';

describe('UserService', () => {
  let ctx: UserServiceTestContext;

  beforeEach(async () => {
    ctx = await createUserServiceContext();
  });

  it('findByEmail should call repository.findOne with email', async () => {
    const user = { id: '1', email: 'test@example.com' };
    ctx.repo.findOne.mockResolvedValue(user);

    const result = await ctx.service.findByEmail('test@example.com');

    expect(ctx.repo.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
    expect(result).toEqual(user);
  });

  it('findById should call repository.findOne with id', async () => {
    const user = { id: '1', email: 'test@example.com' };
    ctx.repo.findOne.mockResolvedValue(user);

    const result = await ctx.service.findById('1');

    expect(ctx.repo.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    expect(result).toEqual(user);
  });

  it('register should hash password, create and save user', async () => {
    ctx.passwordHasher.hash.mockResolvedValue({ hash: 'hashed', salt: 'salt' });
    const created = { id: '1', email: 'test@example.com', password: 'hashed', salt: 'salt' };
    ctx.repo.create.mockReturnValue(created);
    ctx.repo.save.mockResolvedValue(created);

    const result = await ctx.service.register({ email: 'test@example.com', password: 'plain' });

    expect(ctx.passwordHasher.hash).toHaveBeenCalledWith({ password: 'plain' });
    expect(ctx.repo.create).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'hashed',
      salt: 'salt',
    });
    expect(ctx.repo.save).toHaveBeenCalledWith(created);
    expect(ctx.logger.info).toHaveBeenCalledWith('User registered', { userId: created.id });
    expect(result).toEqual(created);
  });

  it('createUser should call repository.create and save', async () => {
    const data = { email: 'new@example.com' };
    const created = { id: '2', ...data };
    ctx.repo.create.mockReturnValue(created);
    ctx.repo.save.mockResolvedValue(created);

    const result = await ctx.service.createUser(data);

    expect(ctx.repo.create).toHaveBeenCalledWith(data);
    expect(ctx.repo.save).toHaveBeenCalledWith(created);
    expect(result).toEqual(created);
  });

  it('updateRefreshTokenVersion should call repository.update', async () => {
    await ctx.service.updateRefreshTokenVersion({ userId: '1', version: 2 });

    expect(ctx.repo.update).toHaveBeenCalledWith('1', { refreshTokenVersion: 2 });
  });
});
