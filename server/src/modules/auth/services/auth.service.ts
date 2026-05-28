import { Injectable, UnauthorizedException } from '@nestjs/common';
import { GraphQLError } from 'graphql';

import { AuthTokenService } from './auth-token.service';
import { Pbkdf2PasswordHasher } from './password-hasher.service';
import { AuthCookieService } from './auth-cookie.service';

import { UserService } from '@users/services/user.service';

import { AppLoggerService } from '../../logger/services/app-logger.service';
import { LoggerContextService } from '../../logger/services/logger-context.service';

import { IUserEntity } from '../../users/interfaces';

import {
  LoginParams,
  RegisterParams,
  LogoutParams,
  RotateRefreshTokenParams,
  TokenPair,
} from '../types';

import { IAuthOutput } from '../interfaces/auth.output.interface';

import { LogMethod } from '@shared/logging/decorators/log-method.decorator';

@Injectable()
export class AuthService {
  private readonly logger;

  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: AuthTokenService,
    private readonly cookieService: AuthCookieService,
    private readonly passwordHasher: Pbkdf2PasswordHasher,
    loggerService: AppLoggerService,
    private contextService: LoggerContextService,
  ) {
    this.logger = loggerService.child(AuthService.name);
  }

  @LogMethod()
  async login(params: LoginParams): Promise<IAuthOutput> {
    const { input, res } = params;

    const user = await this.validateUser(input.email, input.password);

    const tokens = await this.generateTokens(user);

    this.setCookies(res, tokens);

    this.logger.info('User login success', {
      userId: user.id,
      email: user.email,
    });

    this.contextService.printContext('AUTH SERVICE');

    return { success: true };
  }

  @LogMethod()
  async register(params: RegisterParams): Promise<IAuthOutput> {
    const { input, res } = params;

    const user = await this.usersService.register(input);

    const tokens = await this.generateTokens(user);

    this.setCookies(res, tokens);

    this.logger.info('User registered successfully', {
      userId: user.id,
      email: user.email,
    });

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

      throw new UnauthorizedException();
    }

    const nextVersion = user.refreshTokenVersion + 1;

    await this.usersService.updateRefreshTokenVersion({
      userId: user.id,
      version: nextVersion,
    });

    this.cookieService.clearAuthCookies(res);

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

    const payload = await this.jwtService.verifyRefreshToken(oldToken);

    const user = await this.usersService.findById(payload.userId);

    if (!user) {
      this.logger.warn('Refresh token rotation failed: user not found', {
        userId: payload.userId,
      });

      throw new GraphQLError('Unauthorized', {
        extensions: { code: 'UNAUTHENTICATED' },
      });
    }

    if (payload.version !== user.refreshTokenVersion) {
      this.logger.warn('Refresh token version mismatch', {
        userId: user.id,
        tokenVersion: payload.version,
        currentVersion: user.refreshTokenVersion,
      });

      throw new GraphQLError('Unauthorized', {
        extensions: { code: 'UNAUTHENTICATED' },
      });
    }

    const newVersion = user.refreshTokenVersion + 1;

    await this.usersService.updateRefreshTokenVersion({
      userId: user.id,
      version: newVersion,
    });

    user.refreshTokenVersion = newVersion;

    const tokens = await this.generateTokens(user);

    this.setCookies(res, tokens);

    this.logger.info('Refresh token rotated', {
      userId: user.id,
      version: newVersion,
    });

    return { success: true };
  }

  private async validateUser(
    email: string,
    password: string,
  ): Promise<IUserEntity> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      this.logger.warn('Login failed: user not found', {
        email,
      });

      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await this.passwordHasher.compare({
      password,
      hash: user.password,
      salt: user.salt,
    });

    if (!isValid) {
      this.logger.warn('Login failed: invalid password', {
        userId: user.id,
        email,
      });

      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  private async generateTokens(user: IUserEntity): Promise<TokenPair> {
    const accessToken = await this.jwtService.createAccessToken({
      userId: user.id,
      email: user.email,
      type: 'access',
    });

    const refreshToken = await this.jwtService.createRefreshToken({
      userId: user.id,
      version: user.refreshTokenVersion,
      type: 'refresh',
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
