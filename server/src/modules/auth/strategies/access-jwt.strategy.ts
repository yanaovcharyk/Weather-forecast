import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { IAccessJwtPayload } from '../interfaces/jwt-payload.interfaces';
import { AppLoggerService } from '../../logger/services/app-logger.service';
import { LoggerContextService } from '../../logger/services/logger-context.service';

@Injectable()
export class AccessJwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger;

  constructor(
    config: ConfigService,
    loggerService: AppLoggerService,
    private readonly loggerContext: LoggerContextService,
  ) {
    super({
      jwtFromRequest: (req: Request) => req.cookies?.accessToken,
      secretOrKey: config.get<string>('jwt.accessSecret')!,
    });

    this.logger = loggerService.child(AccessJwtStrategy.name);
    this.logger.info('AccessJwtStrategy initialized');
  }

  validate(payload: IAccessJwtPayload): IAccessJwtPayload {
    this.logger.debug('Validating access token payload', {
      userId: payload.userId,
      email: payload.email,
    });

    if (payload.type !== 'access') {
      this.logger.warn('Invalid access token type', {
        type: payload.type,
        userId: payload.userId,
      });

      throw new UnauthorizedException('Invalid token type');
    }

    this.loggerContext.printContext('ACCESS_JWT.STRATEGY');
    this.loggerContext.set({
      userId: payload.userId,
    });

    return {
      userId: payload.userId,
      email: payload.email,
      type: payload.type,
    };
  }
}
