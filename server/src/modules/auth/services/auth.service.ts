import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { GraphQLError } from 'graphql';

import { AuthTokenService } from './auth-token.service';
import { Pbkdf2PasswordHasher } from './password-hasher.service';
import { AuthCookieService } from './auth-cookie.service';

import { LoginInput, RegisterInput } from '../dto';

import { UserService } from '@users/services/user.service';
import { UserEntity } from '@users/entities';

import { AppLoggerService } from '../../logger/services/app-logger.service';
import { LoggerContextService } from '../../logger/services/logger-context.service';

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

  async login(input: LoginInput, req: Request, res: Response) {
    this.logger.info('Login attempt started', {
      email: input.email,
      ip: req.ip,
    });

    const user = await this.validateUser(input.email, input.password);

    this.logger.debug('User credentials validated', {
      email: user.email,
    });

    const tokens = await this.generateTokens(user);

    this.logger.debug('JWT tokens generated');

    this.setCookies(res, tokens);

    this.logger.debug('Authentication cookies set');

    this.logger.info('User login success', {
      email: user.email,
      ip: req.ip,
    });

    this.contextService.printContext('AUTH SERVICE');

    return { success: true };
  }

  async register(input: RegisterInput, req: Request, res: Response) {
    this.logger.info('User registration started', {
      email: input.email,
      ip: req.ip,
    });

    const user = await this.usersService.register(input);

    this.logger.debug('User created successfully', {
      email: user.email,
    });

    const tokens = await this.generateTokens(user);

    this.logger.debug('JWT tokens generated after registration');

    this.setCookies(res, tokens);

    this.logger.debug('Authentication cookies set after registration');

    this.logger.info('User registered successfully', {
      email: user.email,
      ip: req.ip,
    });

    return { success: true };
  }

  async logout(userId: string, res: Response) {
    this.logger.info('Logout started');

    const user = await this.usersService.findById(userId);

    if (!user) {
      this.logger.warn('Logout failed: user not found');

      throw new UnauthorizedException();
    }

    const nextVersion = user.refreshTokenVersion + 1;

    await this.usersService.updateRefreshTokenVersion(user.id, nextVersion);

    this.logger.debug('Refresh token version incremented during logout', {
      oldVersion: user.refreshTokenVersion,
      newVersion: nextVersion,
    });

    this.cookieService.clearAuthCookies(res);

    this.logger.debug('Authentication cookies cleared');

    this.logger.info('User logout success', {
      email: user.email,
    });

    return { success: true };
  }

  async rotateRefreshToken(oldToken: string, req: Request, res: Response) {
    this.logger.info('Refresh token rotation started', {
      ip: req.ip,
    });

    const payload = await this.jwtService.verifyRefreshToken(oldToken);

    this.logger.debug('Refresh token verified', {
      version: payload.version,
    });

    const user = await this.usersService.findById(payload.userId);

    if (!user) {
      this.logger.warn('Refresh token rotation failed: user not found');

      throw new GraphQLError('Unauthorized', {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      });
    }

    if (payload.version !== user.refreshTokenVersion) {
      this.logger.warn('Invalid refresh token version detected', {
        tokenVersion: payload.version,
        actualVersion: user.refreshTokenVersion,
      });

      throw new GraphQLError('Unauthorized', {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      });
    }

    const newVersion = user.refreshTokenVersion + 1;

    await this.usersService.updateRefreshTokenVersion(user.id, newVersion);

    this.logger.debug('Refresh token version updated', {
      oldVersion: user.refreshTokenVersion,
      newVersion,
    });

    user.refreshTokenVersion = newVersion;

    const tokens = await this.generateTokens(user);

    this.logger.debug('JWT tokens generated during refresh rotation', {
      version: newVersion,
    });

    this.setCookies(res, tokens);

    this.logger.debug('Authentication cookies updated after refresh rotation');

    this.logger.info('Refresh token rotated successfully', {
      version: newVersion,
      ip: req.ip,
    });

    return { success: true };
  }

  private async validateUser(email: string, password: string) {
    this.logger.debug('Validating user credentials', {
      email,
    });

    const user = await this.usersService.findByEmail(email);

    if (!user) {
      this.logger.warn('Login failed: user not found', {
        email,
      });

      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await this.passwordHasher.compare(
      password,
      user.password,
      user.salt,
    );

    if (!isValid) {
      this.logger.warn('Login failed: invalid password', {
        email,
      });

      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.debug('User credentials validation successful', {
      email: user.email,
    });

    return user;
  }

  private async generateTokens(user: UserEntity) {
    this.logger.debug('Generating JWT tokens', {
      refreshTokenVersion: user.refreshTokenVersion,
    });

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

    this.logger.debug('JWT tokens generated successfully');

    return {
      accessToken,
      refreshToken,
    };
  }

  private setCookies(
    res: Response,
    tokens: {
      accessToken: string;
      refreshToken: string;
    },
  ) {
    this.logger.debug('Setting authentication cookies');

    this.cookieService.setAccessToken(res, tokens.accessToken);

    this.cookieService.setRefreshToken(res, tokens.refreshToken);

    this.logger.debug('Authentication cookies set successfully');
  }
}
