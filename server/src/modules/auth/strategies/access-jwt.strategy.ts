import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { IAccessJwtPayload } from '../interfaces/jwt-payload.interfaces';


@Injectable()
export class AccessJwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: (req: Request) => req.cookies?.accessToken,
      secretOrKey: config.get<string>('jwt.accessSecret')!,
    });
  }

  validate(payload: IAccessJwtPayload): IAccessJwtPayload {
    if (payload.type !== 'access') {
      throw new Error('Invalid token type');
    }

    return {
      userId: payload.userId,
      email: payload.email,
      type: payload.type,
    };
  }
}
