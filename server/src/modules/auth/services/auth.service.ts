import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@users/services';
import { AppLoggerService } from '@logger/services';
import { LogMethod } from '@logger/decorators';
import { IAuthOutput } from '@auth/interfaces';
import { IUserOutput } from '@users/interfaces';
import {
  LoginParams,
  LogoutParams,
  RotateRefreshTokenParams,
  TokenPair,
  TokenType,
} from '@auth/types';
import { AuthTokenService } from './auth-token.service';
import { AuthCookieService } from './auth-cookie.service';
import { Pbkdf2PasswordHasher } from './password-hasher.service';

@Injectable()
export class AuthService {
  private readonly logger;

  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: AuthTokenService,
    private readonly cookieService: AuthCookieService,
    private readonly passwordHasher: Pbkdf2PasswordHasher,
    loggerService: AppLoggerService,
  ) {
    this.logger = loggerService.child(AuthService.name);
  }

  @LogMethod()
  async login(params: LoginParams): Promise<IAuthOutput> {
    const { input, res } = params;

    const { user, refreshTokenVersion } = await this.validateUser(
      input.email,
      input.password,
    );
    const tokens = await this.generateTokens({
      userId: user.id,
      refreshTokenVersion,
    });
    this.setCookies(res, tokens);
    this.logger.info('User login success');

    return { success: true };
  }

  @LogMethod()
  async logout(params: LogoutParams): Promise<IAuthOutput> {
    const { userId, res } = params;

    const user = await this.usersService.findById(userId);
    if (!user) {
      this.logger.warn('Logout failed: user not found', {
        userId,
      });
      throw new UnauthorizedException('Unauthorized');
    }

    await this.usersService.incrementRefreshTokenVersion({ userId: user.id });

    this.cookieService.clearAccessAndRefreshTokens(res);

    this.logger.info('User logged out', {
      userId: user.id,
    });

    return { success: true };
  }

  @LogMethod()
  async rotateRefreshToken(
    params: RotateRefreshTokenParams,
  ): Promise<IAuthOutput> {
    const { oldToken, res } = params;

    try {
      if (!oldToken) {
        this.logger.warn('Refresh token rotation failed: token missing');
        throw new UnauthorizedException('Unauthorized');
      }

      const payload = await this.jwtService.verifyRefreshToken(oldToken);
      const user = await this.usersService.findById(payload.userId);
      const userAuth = await this.usersService.findAuthByUserId({
        userId: payload.userId,
      });

      if (!user || !userAuth) {
        this.logger.warn('Refresh token rotation failed: user not found', {
          userId: payload.userId,
        });

        throw new UnauthorizedException('Unauthorized');
      }

      if (payload.version !== userAuth.refreshTokenVersion) {
        this.logger.warn('Refresh token version mismatch', {
          tokenVersion: payload.version,
          currentVersion: userAuth.refreshTokenVersion,
        });

        throw new UnauthorizedException('Unauthorized');
      }

      const newVersion = await this.usersService.incrementRefreshTokenVersion({
        userId: user.id,
      });

      const tokens = await this.generateTokens({
        userId: user.id,
        refreshTokenVersion: newVersion,
      });
      this.setCookies(res, tokens);
      this.logger.info('Refresh token rotated', {
        userId: user.id,
        version: newVersion,
      });

      return { success: true };
    } catch (error) {
      this.cookieService.clearAccessAndRefreshTokens(res);
      throw error;
    }
  }

  private async validateUser(
    email: string,
    password: string,
  ): Promise<{ user: IUserOutput; refreshTokenVersion: number }> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      this.logger.warn('Login failed: user not found', {
        email,
      });

      throw new UnauthorizedException('Invalid credentials');
    }

    const userAuth = await this.usersService.findAuthByUserId({
      userId: user.id,
    });

    if (!userAuth) {
      this.logger.warn('Login failed: user auth not found', {
        userId: user.id,
        email,
      });

      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await this.passwordHasher.validatePassword({
      password,
      expectedHashPassword: userAuth.passwordHash,
      salt: userAuth.salt,
    });

    if (!isValid) {
      this.logger.warn('Login failed: invalid password', {
        userId: user.id,
        email,
      });

      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      user,
      refreshTokenVersion: userAuth.refreshTokenVersion,
    };
  }

  private async generateTokens(params: {
    userId: string;
    refreshTokenVersion: number;
  }): Promise<TokenPair> {
    const accessToken = await this.jwtService.createAccessToken({
      userId: params.userId,
      type: TokenType.ACCESS,
    });

    const refreshToken = await this.jwtService.createRefreshToken({
      userId: params.userId,
      version: params.refreshTokenVersion,
      type: TokenType.REFRESH,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  private setCookies(res: any, tokens: TokenPair): void {
    this.cookieService.setAccessToken(res, tokens.accessToken);
    this.cookieService.setRefreshToken(res, tokens.refreshToken);
  }
}
