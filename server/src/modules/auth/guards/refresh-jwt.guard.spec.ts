import { UnauthorizedException } from '@nestjs/common';
import { TokenType } from '@auth/types';

import {
  createGuardContext,
  GuardContext,
} from '@auth/testing/contexts/guards';
import { RefreshJwtGuard } from './refresh-jwt.guard';

describe('RefreshJwtGuard', () => {
  let ctx: GuardContext<RefreshJwtGuard>;

  beforeEach(async () => {
    ctx = await createGuardContext(RefreshJwtGuard);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('canActivate', () => {
    it('should authorize valid refresh token', async () => {
      const token = 'refresh-token';
      const payload = { sub: '1', type: TokenType.REFRESH };

      ctx.cookieService.getRefreshToken.mockReturnValue(token);
      ctx.configService.get.mockReturnValue('refresh-secret');
      ctx.jwtService.verifyAsync.mockResolvedValue(payload);

      await expect(ctx.guard.canActivate({} as any)).resolves.toBe(true);

      expect(ctx.cookieService.getRefreshToken).toHaveBeenCalledWith(
        ctx.gqlContext.req,
      );
      expect(ctx.jwtService.verifyAsync).toHaveBeenCalledWith(token, {
        secret: 'refresh-secret',
      });
      expect(ctx.gqlContext.jwtPayload).toEqual(payload);
      expect(ctx.gqlContext.jwtToken).toBe(token);
    });

    it('should throw when token is missing', async () => {
      ctx.cookieService.getRefreshToken.mockReturnValue(null);

      await expect(ctx.guard.canActivate({} as any)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw when jwt verification fails', async () => {
      ctx.cookieService.getRefreshToken.mockReturnValue('token');
      ctx.jwtService.verifyAsync.mockRejectedValue(new Error());

      await expect(ctx.guard.canActivate({} as any)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw when token type is invalid', async () => {
      ctx.cookieService.getRefreshToken.mockReturnValue('token');
      ctx.jwtService.verifyAsync.mockResolvedValue({
        sub: '1',
        type: TokenType.ACCESS,
      });

      await expect(ctx.guard.canActivate({} as any)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
