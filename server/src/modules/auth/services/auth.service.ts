import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthTokenService } from './auth-token.service';
import { LoginInput, RegisterInput } from '../dto';
import { UserService } from '../../users/services/user.service';
import { Request, Response } from 'express';
import { Pbkdf2PasswordHasher } from './password-hasher.service';
import { GraphQLError } from 'graphql';
import { AuthCookieService } from './auth-cookie.service';
import { UserEntity } from '../../users/entities';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: AuthTokenService,
    private readonly cookieService: AuthCookieService,
    private readonly passwordHasher: Pbkdf2PasswordHasher,
  ) {}

  async login(input: LoginInput, req: Request, res: Response) {
    const user = await this.validateUser(input.email, input.password);
    const tokens = await this.generateTokens(user);
    this.setCookies(res, tokens);

    return { success: true };
  }

  async register(input: RegisterInput, req: Request, res: Response) {
    const user = await this.usersService.register(input);
    const tokens = await this.generateTokens(user);
    this.setCookies(res, tokens);

    return { success: true };
  }

  async logout(userId: string, res: Response) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    await this.usersService.updateRefreshTokenVersion(
      user.id,
      user.refreshTokenVersion + 1,
    );
    this.cookieService.clearAuthCookies(res);

    return { success: true };
  }

  async rotateRefreshToken(oldToken: string, req: Request, res: Response) {
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
    await this.usersService.updateRefreshTokenVersion(user.id, newVersion);
    user.refreshTokenVersion = newVersion;
    const tokens = await this.generateTokens(user);
    this.setCookies(res, tokens);
    return { success: true };
  }

  private async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isValid = await this.passwordHasher.compare(
      password,
      user.password,
      user.salt,
    );

    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  private async generateTokens(user: UserEntity) {
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

    return { accessToken, refreshToken };
  }

  private setCookies(
    res: Response,
    tokens: { accessToken: string; refreshToken: string },
  ) {
    this.cookieService.setAccessToken(res, tokens.accessToken);
    this.cookieService.setRefreshToken(res, tokens.refreshToken);
  }
}
