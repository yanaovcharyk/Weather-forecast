import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { IRefreshJwtPayload } from '../interfaces/jwt-payload.interfaces';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: (req: Request) => req.cookies?.refreshToken,
      secretOrKey: config.get<string>('jwt.refreshSecret')!,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: IRefreshJwtPayload): IRefreshJwtPayload & { refreshToken: string } {
    if (payload.type !== 'refresh') {
      throw new Error('Invalid token type');
    }

    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new Error('Missing refresh token');
    }

    return {
      userId: payload.userId,
      type: payload.type,
      version: payload.version,
      refreshToken,
    };
  }
}
