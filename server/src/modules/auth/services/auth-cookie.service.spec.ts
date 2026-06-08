import { AuthCookieService } from '@auth/services/auth-cookie.service';
import { createAuthCookieContext } from '../../test/auth/auth-cookie.context';

describe('AuthCookieService', () => {
  let service: AuthCookieService;
  let ctx: Awaited<ReturnType<typeof createAuthCookieContext>>;

  beforeEach(async () => {
    ctx = await createAuthCookieContext();
    service = ctx.service;
  });

  describe('getAccessToken', () => {
    it('should return access token', () => {
      ctx.req.cookies.accessToken = 'token';

      const result = service.getAccessToken(ctx.req);

      expect(result).toBe('token');
    });

    it('should return null when token missing', () => {
      const result = service.getAccessToken(ctx.req);

      expect(result).toBeNull();
    });
  });

  describe('clearAuthCookies', () => {
    it('should clear both cookies', () => {
      service.clearAuthCookies(ctx.res);

      expect(ctx.res.clearCookie).toHaveBeenCalledTimes(2);
    });
  });
});
