import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthTokenService } from './auth-token.service';
import { LoginInput, RegisterInput } from '../dto';
import { UserService } from '../../users/services/user.service';
import { Request, Response } from 'express';
import { AuthCookieService } from './auth-cookie.service';
import { UserEntity } from '../../users/entities';
import { TokenType } from '../types/token';

@Injectable()
export class AuthService {
  private gracePeriodCache = new Map<string, { version: number; timestamp: number }>();
  private refreshLocks = new Map<string, Promise<void>>();
  private tokenCache = new Map<string, {
    tokens: { accessToken: string; refreshToken: string };
    timestamp: number;
  }>();

  private readonly TOKEN_CACHE_TTL = 1500;
  private readonly CACHE_TTL = 5000;

  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: AuthTokenService,
    private readonly cookieService: AuthCookieService,
  ) {}

  async login(input: LoginInput, req: Request, res: Response) {
    const user = await this.usersService.validateUser(input.email, input.password);
    return this.authenticate(user, res);
  }

  async register(input: RegisterInput, req: Request, res: Response) {
    const user = await this.usersService.register(input);
    return this.authenticate(user, res);
  }

  async refreshTokensUsingRefreshToken(req: Request, res: Response) {
    const id = (req as any).reqId;
    const refreshToken = this.cookieService.getRefreshToken(req);
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const verifiedRefreshToken = await this.jwtService.verifyRefreshToken(refreshToken);
    const userId = verifiedRefreshToken.userId;

    const lastUpdate = this.gracePeriodCache.get(userId);
    if (
      lastUpdate &&
      lastUpdate.version === verifiedRefreshToken.version &&
      Date.now() - lastUpdate.timestamp < this.TOKEN_CACHE_TTL
    ) {
      console.log(`[REQ ${id}] 🛡️  GRACE PERIOD: Bypass (Fast path)`);
      await this.applyTokensFromCacheOrGenerate(userId, req, res);
      return;
    }

    if (this.refreshLocks.has(userId)) {
      console.log(`[REQ ${id}] ⏳ LOCK: Waiting for primary refresh...`);
      await this.refreshLocks.get(userId);

      const updated = this.gracePeriodCache.get(userId);
      if (updated && updated.version === verifiedRefreshToken.version) {
        console.log(`[REQ ${id}] 🟢 RELEASED: Bypass via Grace Period after wait`);
        await this.applyTokensFromCacheOrGenerate(userId, req, res);
        return;
      }
    }

    const refreshProcess = (async () => {
      const user = await this.usersService.findByIdOrThrow(userId);

      if (user.refreshTokenVersion !== verifiedRefreshToken.version) {
        console.log(
          `[REQ ${id}] ❌ VERSION MISMATCH: DB=${user.refreshTokenVersion}, Token=${verifiedRefreshToken.version}`,
        );
        throw new UnauthorizedException('Token expired');
      }

      const oldVersion = user.refreshTokenVersion;
      console.log(`[REQ ${id}] ⬆️  Primary Refresh: Incrementing version ${oldVersion}`);

      const newVersion = await this.usersService.incrementRefreshTokenVersion(user.id);
      user.refreshTokenVersion = newVersion;

      this.gracePeriodCache.set(userId, {
        version: oldVersion,
        timestamp: Date.now(),
      });

      const tokens = await this.generateTokens(user);

      this.tokenCache.set(userId, {
        tokens,
        timestamp: Date.now(),
      });

      this.cookieService.setAuthCookies(res, tokens);
      this.setUserInRequest(req, user);
    })();

    this.refreshLocks.set(userId, refreshProcess);

    try {
      await refreshProcess;
      console.log(`[REQ ${id}] ✅ REFRESH DONE (Primary)`);
    } finally {
      this.refreshLocks.delete(userId);
      setTimeout(() => this.gracePeriodCache.delete(userId), this.CACHE_TTL);
    }
  }

  private async applyTokensFromCacheOrGenerate(
    userId: string,
    req: Request,
    res: Response,
  ): Promise<void> {
    const cached = this.tokenCache.get(userId);

    if (cached && Date.now() - cached.timestamp < this.TOKEN_CACHE_TTL) {
      this.cookieService.setAuthCookies(res, cached.tokens);
    } else {
      const user = await this.usersService.findByIdOrThrow(userId);
      const tokens = await this.generateTokens(user);

      this.tokenCache.set(userId, {
        tokens,
        timestamp: Date.now(),
      });

      this.cookieService.setAuthCookies(res, tokens);
    }

    const user = await this.usersService.findByIdOrThrow(userId);
    this.setUserInRequest(req, user);
  }

  private setUserInRequest(req: Request, user: UserEntity) {
    (req as any).user = {
      userId: user.id,
      email: user.email,
      type: TokenType.ACCESS,
    };
  }

  private async authenticate(user: UserEntity, res: Response) {
    const tokens = await this.generateTokens(user);
    this.cookieService.setAuthCookies(res, tokens);
    return { success: true };
  }

  private async generateTokens(user: UserEntity) {
    return {
      accessToken: await this.jwtService.createAccessToken({
        userId: user.id,
        email: user.email,
        type: TokenType.ACCESS,
      }),
      refreshToken: await this.jwtService.createRefreshToken({
        userId: user.id,
        version: user.refreshTokenVersion,
        type: TokenType.REFRESH,
      }),
    };
  }
}
