import { TokenName } from '@auth/types';
import { AuthCookieService } from '@auth/services';
import {
  ACCESS_TOKEN_FIXTURE,
  REFRESH_TOKEN_FIXTURE,
} from '@auth/testing/fixtures';
import { createAuthCookieContext } from '@auth/testing/contexts/services';

describe('AuthCookieService', () => {
  let service: AuthCookieService;
  let ctx: Awaited<ReturnType<typeof createAuthCookieContext>>;

  beforeEach(async () => {
    ctx = await createAuthCookieContext();
    service = ctx.service;
  });

  describe('getAccessToken', () => {
    it('should return access token', () => {
      ctx.req.cookies.accessToken = ACCESS_TOKEN_FIXTURE;
      const result = service.getAccessToken(ctx.req);
      expect(result).toBe(ACCESS_TOKEN_FIXTURE);
    });

    it('should return null when access token is missing', () => {
      const result = service.getAccessToken(ctx.req);
      expect(result).toBeNull();
    });
  });

  describe('getRefreshToken', () => {
    it('should return refresh token', () => {
      ctx.req.cookies.refreshToken = REFRESH_TOKEN_FIXTURE;
      const result = service.getRefreshToken(ctx.req);
      expect(result).toBe(REFRESH_TOKEN_FIXTURE);
    });

    it('should return null when refresh token is missing', () => {
      const result = service.getRefreshToken(ctx.req);
      expect(result).toBeNull();
    });
  });

  describe('setAccessToken', () => {
    it('should set access token cookie', () => {
      service.setAccessToken(ctx.res, ACCESS_TOKEN_FIXTURE);
      expect(ctx.res.cookie).toHaveBeenCalledTimes(1);
      expect(ctx.res.cookie).toHaveBeenCalledWith(
        TokenName.ACCESS,
        ACCESS_TOKEN_FIXTURE,
        expect.objectContaining({
          maxAge: expect.any(Number),
        }),
      );
    });
  });

  describe('setRefreshToken', () => {
    it('should set refresh token cookie', () => {
      ctx.config.getOrThrow.mockReturnValue('7d');
      service.setRefreshToken(ctx.res, REFRESH_TOKEN_FIXTURE);
      expect(ctx.res.cookie).toHaveBeenCalledTimes(1);
      expect(ctx.res.cookie).toHaveBeenCalledWith(
        TokenName.REFRESH,
        REFRESH_TOKEN_FIXTURE,
        expect.objectContaining({
          maxAge: expect.any(Number),
        }),
      );
    });
  });

  describe('clearAccessToken', () => {
    it('should clear access token cookie', () => {
      service.clearAccessToken(ctx.res);
      expect(ctx.res.clearCookie).toHaveBeenCalledTimes(1);
      expect(ctx.res.clearCookie).toHaveBeenCalledWith(
        TokenName.ACCESS,
        expect.any(Object),
      );
    });
  });

  describe('clearRefreshToken', () => {
    it('should clear refresh token cookie', () => {
      service.clearRefreshToken(ctx.res);
      expect(ctx.res.clearCookie).toHaveBeenCalledTimes(1);
      expect(ctx.res.clearCookie).toHaveBeenCalledWith(
        TokenName.REFRESH,
        expect.any(Object),
      );
    });
  });

  describe('clearAuthCookies', () => {
    it('should clear both cookies', () => {
      service.clearAccessAndRefreshTokens(ctx.res);
      expect(ctx.res.clearCookie).toHaveBeenCalledTimes(2);
      expect(ctx.res.clearCookie).toHaveBeenNthCalledWith(
        1,
        TokenName.ACCESS,
        expect.any(Object),
      );
      expect(ctx.res.clearCookie).toHaveBeenNthCalledWith(
        2,
        TokenName.REFRESH,
        expect.any(Object),
      );
    });
  });
});
