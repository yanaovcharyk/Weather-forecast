import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { createAuthContext } from '@auth/testing';
import {
  ACCESS_TOKEN_FIXTURE,
  RAW_TOKEN_FIXTURE,
  REFRESH_TOKEN_FIXTURE,
  refreshJwtPayloadFixture,
  MockUser,
  MockUserAuth,
  LoginInputFixture,
} from '@auth/testing/fixtures';

describe('AuthService', () => {
  let service: AuthService;
  let ctx: Awaited<ReturnType<typeof createAuthContext>>;

  beforeEach(async () => {
    ctx = await createAuthContext();
    service = ctx.service;
  });

  describe('login', () => {
    it('should login successfully', async () => {
      ctx.usersService.findByEmail.mockResolvedValue(MockUser);
      ctx.usersService.findAuthByUserId.mockResolvedValue(MockUserAuth);
      ctx.passwordHasher.validatePassword.mockResolvedValue(true);

      ctx.tokenService.createAccessToken.mockResolvedValue(
        ACCESS_TOKEN_FIXTURE,
      );

      ctx.tokenService.createRefreshToken.mockResolvedValue(
        REFRESH_TOKEN_FIXTURE,
      );

      const result = await service.login({
        input: {
          ...LoginInputFixture,
          email: MockUser.email,
        },
        res: ctx.res,
      });

      expect(result).toEqual({ success: true });

      expect(ctx.cookieService.setAccessToken).toHaveBeenCalledWith(
        ctx.res,
        ACCESS_TOKEN_FIXTURE,
      );

      expect(ctx.cookieService.setRefreshToken).toHaveBeenCalledWith(
        ctx.res,
        REFRESH_TOKEN_FIXTURE,
      );
    });

    it('should throw when user not found', async () => {
      ctx.usersService.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({
          input: LoginInputFixture,
          res: ctx.res,
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw when password is invalid', async () => {
      ctx.usersService.findByEmail.mockResolvedValue(MockUser);
      ctx.usersService.findAuthByUserId.mockResolvedValue(MockUserAuth);
      ctx.passwordHasher.validatePassword.mockResolvedValue(false);

      await expect(
        service.login({
          input: {
            ...LoginInputFixture,
            email: MockUser.email,
            password: 'wrong-password',
          },
          res: ctx.res,
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should logout user', async () => {
      ctx.usersService.findById.mockResolvedValue(MockUser);

      const result = await service.logout({
        userId: MockUser.id,
        res: ctx.res,
      });

      expect(result).toEqual({ success: true });

      expect(ctx.usersService.incrementRefreshTokenVersion).toHaveBeenCalledWith({
        userId: MockUser.id,
      });

      expect(ctx.cookieService.clearAccessAndRefreshTokens).toHaveBeenCalledWith(
        ctx.res,
      );
    });

    it('should throw when user not found', async () => {
      ctx.usersService.findById.mockResolvedValue(null);

      await expect(
        service.logout({
          userId: 'unknown-user',
          res: ctx.res,
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('rotateRefreshToken', () => {
    it('should rotate refresh token', async () => {
      ctx.tokenService.verifyRefreshToken.mockResolvedValue({
        ...refreshJwtPayloadFixture,
        userId: MockUser.id,
        version: MockUserAuth.refreshTokenVersion,
      });

      ctx.usersService.findById.mockResolvedValue({
        ...MockUser,
      });
      ctx.usersService.findAuthByUserId.mockResolvedValue({
        ...MockUserAuth,
      });
      ctx.usersService.incrementRefreshTokenVersion.mockResolvedValue(
        MockUserAuth.refreshTokenVersion + 1,
      );

      ctx.tokenService.createAccessToken.mockResolvedValue(
        ACCESS_TOKEN_FIXTURE,
      );

      ctx.tokenService.createRefreshToken.mockResolvedValue(
        REFRESH_TOKEN_FIXTURE,
      );

      const result = await service.rotateRefreshToken({
        oldToken: RAW_TOKEN_FIXTURE,
        res: ctx.res,
      });

      expect(result).toEqual({ success: true });

      expect(ctx.usersService.incrementRefreshTokenVersion).toHaveBeenCalledWith({
        userId: MockUser.id,
      });

      expect(ctx.cookieService.setAccessToken).toHaveBeenCalledWith(
        ctx.res,
        ACCESS_TOKEN_FIXTURE,
      );

      expect(ctx.cookieService.setRefreshToken).toHaveBeenCalledWith(
        ctx.res,
        REFRESH_TOKEN_FIXTURE,
      );
    });

    it('should throw when user not found', async () => {
      ctx.tokenService.verifyRefreshToken.mockResolvedValue(
        refreshJwtPayloadFixture,
      );

      ctx.usersService.findById.mockResolvedValue(null);

      await expect(
        service.rotateRefreshToken({
          oldToken: RAW_TOKEN_FIXTURE,
          res: ctx.res,
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw when refresh token version mismatch', async () => {
      ctx.tokenService.verifyRefreshToken.mockResolvedValue(
        refreshJwtPayloadFixture,
      );

      ctx.usersService.findById.mockResolvedValue({
        ...MockUser,
      });
      ctx.usersService.findAuthByUserId.mockResolvedValue({
        ...MockUserAuth,
        refreshTokenVersion: 999,
      });

      await expect(
        service.rotateRefreshToken({
          oldToken: RAW_TOKEN_FIXTURE,
          res: ctx.res,
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
