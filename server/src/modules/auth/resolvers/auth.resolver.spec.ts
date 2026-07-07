import { AuthResolver } from './auth.resolver';
import { LoginInputFixture } from '@auth/testing/fixtures/auth-input.fixture';
import { MockUser, RAW_TOKEN_FIXTURE } from '@auth/testing/fixtures';
import { createAuthResolverContext } from '@auth/testing/contexts/resolvers/auth-resolver.context';

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
      ctx.authCookieService.getRefreshToken.mockReturnValue(RAW_TOKEN_FIXTURE);
      ctx.authService.rotateRefreshToken.mockResolvedValue({
        success: true,
      });

      const result = await resolver.refreshTokens(ctx.gqlContext);

      expect(result).toEqual({
        success: true,
      });

      expect(ctx.authService.rotateRefreshToken).toHaveBeenCalledWith({
        oldToken: RAW_TOKEN_FIXTURE,
        res: ctx.res,
      });
      expect(ctx.authCookieService.getRefreshToken).toHaveBeenCalledWith(
        ctx.req,
      );
    });

    it('should pass null when refresh token cookie is missing', async () => {
      ctx.authCookieService.getRefreshToken.mockReturnValue(null);
      ctx.authService.rotateRefreshToken.mockResolvedValue({
        success: true,
      });

      const result = await resolver.refreshTokens(ctx.gqlContext);

      expect(ctx.authService.rotateRefreshToken).toHaveBeenCalledWith({
        oldToken: null,
        res: ctx.res,
      });

      expect(result).toEqual({
        success: true,
      });
    });
  });

});
