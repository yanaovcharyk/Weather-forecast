import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthResolver } from './resolvers';
import { jwtConfig } from './config';

import { AuthTokenService } from './services/auth-token.service';

import { UsersModule } from '@users/index';
import { AuthService } from './services/auth.service';
import { Pbkdf2PasswordHasher } from './services';
import { AuthCookieService } from './services/auth-cookie.service';
import { AccessJwtGuard, RefreshJwtGuard } from './guards';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: jwtConfig,
    }),
  ],
  providers: [
    AuthResolver,
    AuthService,
    AuthTokenService,
    AuthCookieService,
    Pbkdf2PasswordHasher,
    AccessJwtGuard,
    RefreshJwtGuard,
  ],
  exports: [AccessJwtGuard],
})
export class AuthModule {}
