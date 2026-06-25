import { AuthTokenService } from './auth-token.service';
import { createAuthTokenContext } from '@auth/test';
import {
  ACCESS_SECRET_FIXTURE,
  ACCESS_TOKEN_FIXTURE,
  RAW_TOKEN_FIXTURE,
  REFRESH_SECRET_FIXTURE,
  REFRESH_TOKEN_FIXTURE,
  accessJwtPayloadFixture,
  refreshJwtPayloadFixture,
} from '@auth/test/fixtures';

describe('AuthTokenService', () => {
  let service: AuthTokenService;
  let ctx: Awaited<ReturnType<typeof createAuthTokenContext>>;

  beforeEach(async () => {
    ctx = await createAuthTokenContext();
    service = ctx.service;
  });

  describe('createAccessToken', () => {
    it('should create access token', async () => {
      ctx.jwt.signAsync.mockResolvedValue(ACCESS_TOKEN_FIXTURE);

      const payload = accessJwtPayloadFixture;

      const result = await service.createAccessToken(payload);

      expect(result).toBe(ACCESS_TOKEN_FIXTURE);

      expect(ctx.jwt.signAsync).toHaveBeenCalledWith(
        payload,
        expect.objectContaining({
          secret: ACCESS_SECRET_FIXTURE,
        }),
      );
    });
  });

  describe('createRefreshToken', () => {
    it('should create refresh token', async () => {
      ctx.jwt.signAsync.mockResolvedValue(REFRESH_TOKEN_FIXTURE);

      const payload = refreshJwtPayloadFixture;

      const result = await service.createRefreshToken(payload);

      expect(result).toBe(REFRESH_TOKEN_FIXTURE);

      expect(ctx.jwt.signAsync).toHaveBeenCalledWith(
        payload,
        expect.objectContaining({
          secret: REFRESH_SECRET_FIXTURE,
        }),
      );
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify access token', async () => {
      const payload = accessJwtPayloadFixture;

      ctx.jwt.verifyAsync.mockResolvedValue(payload);

      const result = await service.verifyAccessToken(RAW_TOKEN_FIXTURE);

      expect(result).toEqual(payload);

      expect(ctx.jwt.verifyAsync).toHaveBeenCalledWith(
        RAW_TOKEN_FIXTURE,
        expect.objectContaining({
          secret: ACCESS_SECRET_FIXTURE,
        }),
      );
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify refresh token', async () => {
      const payload = refreshJwtPayloadFixture;

      ctx.jwt.verifyAsync.mockResolvedValue(payload);

      const result = await service.verifyRefreshToken(RAW_TOKEN_FIXTURE);

      expect(result).toEqual(payload);

      expect(ctx.jwt.verifyAsync).toHaveBeenCalledWith(
        RAW_TOKEN_FIXTURE,
        expect.objectContaining({
          secret: REFRESH_SECRET_FIXTURE,
        }),
      );
    });
  });
});
