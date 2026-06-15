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

    it('should propagate login error', async () => {
      ctx.authService.login.mockRejectedValue(new Error('login failed'));

      await expect(
        resolver.login(LoginInputFixture, ctx.gqlContext),
      ).rejects.toThrow('login failed');
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

    it('should propagate register error', async () => {
      ctx.authService.register.mockRejectedValue(new Error('register failed'));

      await expect(
        resolver.register(RegisterInputFixture, ctx.gqlContext),
      ).rejects.toThrow('register failed');
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

    it('should throw if user id is missing', async () => {
      await expect(
        resolver.logout({ id: undefined } as any, ctx.gqlContext),
      ).rejects.toThrow();
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

    it('should handle missing jwtToken', async () => {
      const brokenCtx = {
        ...ctx.gqlContext,
        jwtToken: undefined,
      };

      ctx.authService.rotateRefreshToken.mockResolvedValue({
        success: true,
      });

      const result = await resolver.refreshTokens(brokenCtx as any);

      expect(ctx.authService.rotateRefreshToken).toHaveBeenCalledWith({
        oldToken: undefined,
        res: ctx.res,
      });

      expect(result).toEqual({
        success: true,
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

    it('should handle missing user id', async () => {
      const result = await resolver.me({ id: undefined } as any);

      expect(result).toEqual({
        userId: undefined,
      });
    });
  });
});

