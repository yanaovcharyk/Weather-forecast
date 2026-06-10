import { AuthResolver } from './auth.resolver';
import {
  LoginInputFixture,
  RegisterInputFixture,
} from '@test/auth/fixtures/auth-input.fixture';
import { MockUser } from '@test/auth/fixtures';
import { createAuthResolverContext } from '../../test/auth/contexts/resolvers/auth-resolver.context';

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let ctx: Awaited<ReturnType<typeof createAuthResolverContext>>;

  beforeEach(async () => {
    ctx = await createAuthResolverContext();
    resolver = ctx.resolver;
  });

  describe('login', () => {
    it('should call authService.login', async () => {
      ctx.authService.login.mockResolvedValue({
        success: true,
      });

      const result = await resolver.login(LoginInputFixture, ctx.gqlContext);

      expect(result).toEqual({
        success: true,
      });

      expect(ctx.authService.login).toHaveBeenCalledWith({
        input: LoginInputFixture,
        req: ctx.req,
        res: ctx.res,
      });
    });
  });

  describe('register', () => {
    it('should call authService.register', async () => {
      ctx.authService.register.mockResolvedValue({
        success: true,
      });

      const result = await resolver.register(
        RegisterInputFixture,
        ctx.gqlContext,
      );

      expect(result).toEqual({
        success: true,
      });

      expect(ctx.authService.register).toHaveBeenCalledWith({
        input: RegisterInputFixture,
        req: ctx.req,
        res: ctx.res,
      });
    });
  });

  describe('logout', () => {
    it('should call authService.logout', async () => {
      ctx.authService.logout.mockResolvedValue({
        success: true,
      });

      const result = await resolver.logout(
        {
          id: MockUser.id,
        },
        ctx.gqlContext,
      );

      expect(result).toEqual({
        success: true,
      });

      expect(ctx.authService.logout).toHaveBeenCalledWith({
        userId: MockUser.id,
        res: ctx.res,
      });
    });
  });

  describe('refreshTokens', () => {
    it('should call authService.rotateRefreshToken', async () => {
      ctx.authService.rotateRefreshToken.mockResolvedValue({
        success: true,
      });

      const result = await resolver.refreshTokens(ctx.gqlContext);

      expect(result).toEqual({
        success: true,
      });

      expect(ctx.authService.rotateRefreshToken).toHaveBeenCalledWith({
        oldToken: ctx.gqlContext.jwtToken,
        res: ctx.res,
      });
    });
  });

  describe('me', () => {
    it('should return current user', async () => {
      const result = await resolver.me({
        id: MockUser.id,
      });

      expect(result).toEqual({
        userId: MockUser.id,
      });
    });
  });
});
