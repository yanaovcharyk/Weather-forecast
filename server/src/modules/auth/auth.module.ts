import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthResolver } from './resolvers';

import { AuthTokenService } from './services/auth-token.service';

import { UsersModule } from '../users/user.module';
import { AuthService } from './services/auth.service';
import { Pbkdf2PasswordHasher } from './services';
import { AuthCookieService } from './services/auth-cookie.service';

@Module({
  imports: [UsersModule, PassportModule, JwtModule.register({})],
  providers: [
    AuthResolver,

    AuthService,

    AuthTokenService,
    AuthCookieService,

    Pbkdf2PasswordHasher,
  ],
  exports: [AuthService, AuthTokenService, AuthCookieService],
})
export class AuthModule {}
