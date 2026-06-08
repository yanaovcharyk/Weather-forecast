import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { createAuthContext } from '../../test/auth/auth-context';
import { mockUser } from '../../test/auth/fixtures/auth-user.fixture';

describe('AuthService', () => {
  let service: AuthService;
  let ctx: Awaited<ReturnType<typeof createAuthContext>>;

  beforeEach(async () => {
    ctx = await createAuthContext();
    service = ctx.service;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully', async () => {
      ctx.usersService.findByEmail.mockResolvedValue(mockUser);
      ctx.passwordHasher.validatePassword.mockResolvedValue(true);
      ctx.tokenService.createAccessToken.mockResolvedValue('access');
      ctx.tokenService.createRefreshToken.mockResolvedValue('refresh');

      const result = await service.login({
        input: {
          email: mockUser.email,
          password: '123456',
        },
        req: ctx.req,
        res: ctx.res,
      });

      expect(result).toEqual({ success: true });

      expect(ctx.cookieService.setAccessToken).toHaveBeenCalled();
      expect(ctx.cookieService.setRefreshToken).toHaveBeenCalled();
    });

    it('should throw when user not found', async () => {
      ctx.usersService.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({
          input: {
            email: 'test@test.com',
            password: '123456',
          },
          req: ctx.req,
          res: ctx.res,
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should logout user', async () => {
      ctx.usersService.findById.mockResolvedValue(mockUser);

      const result = await service.logout({
        userId: mockUser.id,
        res: ctx.res,
      });

      expect(result).toEqual({ success: true });

      expect(ctx.cookieService.clearAuthCookies).toHaveBeenCalled();
    });
  });

  describe('rotateRefreshToken', () => {
    it('should rotate refresh token', async () => {
      ctx.tokenService.verifyRefreshToken.mockResolvedValue({
        userId: mockUser.id,
        version: 1,
      });

      ctx.tokenService.createAccessToken.mockResolvedValue('access');
      ctx.tokenService.createRefreshToken.mockResolvedValue('refresh');

      ctx.usersService.findById.mockResolvedValue(mockUser);

      const result = await service.rotateRefreshToken({
        oldToken: 'token',
        res: ctx.res,
      });

      expect(result).toEqual({ success: true });
    });
  });
});
