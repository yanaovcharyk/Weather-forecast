import { TokenType } from '@auth/types';
import { AuthTokenService } from './auth-token.service';
import { createAuthTokenContext } from '../../test/auth/auth-token.context';

describe('AuthTokenService', () => {
  let service: AuthTokenService;
  let ctx: Awaited<ReturnType<typeof createAuthTokenContext>>;

  beforeEach(async () => {
    ctx = await createAuthTokenContext();
    service = ctx.service;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create access token', async () => {
    ctx.jwt.signAsync.mockResolvedValue('access-token');

    const result = await service.createAccessToken({
      userId: '1',
      type: TokenType.ACCESS,
    });

    expect(result).toBe('access-token');

    expect(ctx.jwt.signAsync).toHaveBeenCalled();
  });

  it('should verify refresh token', async () => {
    const payload = {
      userId: '1',
      version: 1,
      type: TokenType.REFRESH,
    };

    ctx.jwt.verifyAsync.mockResolvedValue(payload);

    const result = await service.verifyRefreshToken('token');

    expect(result).toEqual(payload);

    expect(ctx.jwt.verifyAsync).toHaveBeenCalledWith(
      'token',
      expect.objectContaining({
        secret: 'refresh-secret',
      }),
    );
  });
});
