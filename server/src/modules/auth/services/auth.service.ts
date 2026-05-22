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

  async login(params: LoginParams): Promise<IAuthOutput> {
    const { input, req, res } = params;

    this.logger.info('Login attempt started', {
      email: input.email,
      ip: req.ip,
    });

    const user = await this.validateUser(input.email, input.password);

    const tokens = await this.generateTokens(user);

    this.setCookies(res, tokens);

    this.logger.info('User login success', {
      email: user.email,
    });

    this.contextService.printContext('AUTH SERVICE');

    return { success: true };
  }

  async register(params: RegisterParams): Promise<IAuthOutput> {
    const { input, req, res } = params;

    this.logger.info('User registration started', {
      email: input.email,
    });

    const user = await this.usersService.register(input);

    const tokens = await this.generateTokens(user);

    this.setCookies(res, tokens);

    this.logger.info('User registered successfully', {
      email: user.email,
      ip: req.ip,
    });

    return { success: true };
  }

  async logout(params: LogoutParams): Promise<IAuthOutput> {
    const { userId, res } = params;

    this.logger.info('Logout started');

    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    const nextVersion = user.refreshTokenVersion + 1;

    await this.usersService.updateRefreshTokenVersion({
      userId: user.id,
      version: nextVersion,
    });

    this.cookieService.clearAuthCookies(res);

    return { success: true };
  }

  async rotateRefreshToken(
    params: RotateRefreshTokenParams,
  ): Promise<IAuthOutput> {
    const { oldToken, req, res } = params;

    this.logger.info('Refresh token rotation started', {
      ip: req.ip,
    });

    const payload = await this.jwtService.verifyRefreshToken(oldToken);

    const user = await this.usersService.findById(payload.userId);

    if (!user) {
      throw new GraphQLError('Unauthorized', {
        extensions: { code: 'UNAUTHENTICATED' },
      });
    }

    if (payload.version !== user.refreshTokenVersion) {
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

    return { success: true };
  }

  private async validateUser(
    email: string,
    password: string,
  ): Promise<IUserEntity> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await this.passwordHasher.compare({
      password,
      hash: user.password,
      salt: user.salt,
    }
    );

    if (!isValid) {
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
