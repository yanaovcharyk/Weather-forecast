import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

import { IRefreshJwtPayload } from '../interfaces/jwt-payload.interfaces';
import { AppLoggerService } from '../../logger/services/app-logger.service';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  private readonly logger;

  constructor(config: ConfigService, loggerService: AppLoggerService) {
    super({
      jwtFromRequest: (req: Request) => req.cookies?.refreshToken,
      secretOrKey: config.get<string>('jwt.refreshSecret')!,
      passReqToCallback: true,
    });

    this.logger = loggerService.child(RefreshJwtStrategy.name);

    this.logger.info('RefreshJwtStrategy initialized');
  }

  validate(
    req: Request,
    payload: IRefreshJwtPayload,
  ): IRefreshJwtPayload & { refreshToken: string } {
    this.logger.debug('Validating refresh token payload', {
      userId: payload.userId,
      version: payload.version,
      ip: req.ip,
    });

    if (payload.type !== 'refresh') {
      this.logger.warn('Invalid refresh token type', {
        userId: payload.userId,
        receivedType: payload.type,
        ip: req.ip,
      });

      throw new UnauthorizedException('Invalid token type');
    }

    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      this.logger.warn('Missing refresh token cookie', {
        userId: payload.userId,
        ip: req.ip,
      });

      throw new UnauthorizedException('Missing refresh token');
    }

    this.logger.debug('Refresh token validated successfully', {
      userId: payload.userId,
      version: payload.version,
    });

    return {
      userId: payload.userId,
      type: payload.type,
      version: payload.version,
      refreshToken,
    };
  }
}
