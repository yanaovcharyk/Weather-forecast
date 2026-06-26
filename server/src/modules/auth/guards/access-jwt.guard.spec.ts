import { TokenType } from '@auth/types';
import { AUTH_GRAPHQL_ERRORS, JwtConfigKey } from '@auth/constants';

import {
  createGuardContext,
  GuardContext,
} from '@auth/test/contexts/guards';
import { AccessJwtGuard } from './access-jwt.guard';

describe('AccessJwtGuard', () => {
  let ctx: GuardContext<AccessJwtGuard>;

  beforeEach(async () => {
    ctx = await createGuardContext(AccessJwtGuard);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('canActivate', () => {
    it('should authorize valid access token', async () => {
      const token = 'access-token';

      const payload = {
        sub: '1',
        type: TokenType.ACCESS,
      };

      ctx.cookieService.getAccessToken.mockReturnValue(token);
      ctx.configService.get.mockReturnValue('access-secret');
      ctx.jwtService.verifyAsync.mockResolvedValue(payload);

      await expect(ctx.guard.canActivate({} as any)).resolves.toBe(true);

      expect(ctx.cookieService.getAccessToken).toHaveBeenCalledWith(
        ctx.gqlContext.req,
      );

      expect(ctx.configService.get).toHaveBeenCalledWith(
        JwtConfigKey.ACCESS_SECRET,
      );

      expect(ctx.jwtService.verifyAsync).toHaveBeenCalledWith(token, {
        secret: 'access-secret',
      });

      expect(ctx.gqlContext.jwtPayload).toEqual(payload);
      expect(ctx.gqlContext.jwtToken).toBe(token);
    });

    it('should throw when token is missing', async () => {
      ctx.cookieService.getAccessToken.mockReturnValue(null);

      await expect(ctx.guard.canActivate({} as any)).rejects.toBe(
        AUTH_GRAPHQL_ERRORS.UNAUTHORIZED,
      );

      expect(ctx.jwtService.verifyAsync).not.toHaveBeenCalled();
    });

    it('should throw when jwt verification fails', async () => {
      const token = 'access-token';

      ctx.cookieService.getAccessToken.mockReturnValue(token);
      ctx.jwtService.verifyAsync.mockRejectedValue(new Error('jwt error'));

      await expect(ctx.guard.canActivate({} as any)).rejects.toBe(
        AUTH_GRAPHQL_ERRORS.UNAUTHORIZED,
      );
    });

    it('should throw when token type is invalid', async () => {
      const token = 'access-token';

      ctx.cookieService.getAccessToken.mockReturnValue(token);
      ctx.configService.get.mockReturnValue('access-secret');

      ctx.jwtService.verifyAsync.mockResolvedValue({
        sub: '1',
        type: TokenType.REFRESH,
      });

      await expect(ctx.guard.canActivate({} as any)).rejects.toBe(
        AUTH_GRAPHQL_ERRORS.UNAUTHORIZED,
      );
    });
  });
});
