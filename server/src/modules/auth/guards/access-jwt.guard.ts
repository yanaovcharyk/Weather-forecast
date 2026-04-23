import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthTokenService } from '../services/auth-token.service';
import { AuthService } from '../services/auth.service';
import { AuthCookieService } from '../services';

@Injectable()
export class AccessJwtGuard implements CanActivate {
  constructor(
    private readonly tokenService: AuthTokenService,
    private readonly authService: AuthService,
    private readonly cookies: AuthCookieService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    const res = ctx.getContext().res;
    const reqAny = req as any;

    if (!reqAny.reqId) {
      reqAny.reqId = Math.random().toString(36).slice(2, 8);
    }
    const id = reqAny.reqId;

    const accessToken = this.cookies.getAccessToken(req);

    if (accessToken) {
      try {
        const verifiedAccess = await this.tokenService.verifyAccessToken(accessToken);
        req.user = verifiedAccess;
        return true;
      } catch (error) {
      }
    }

    try {
      await this.authService.refreshTokensUsingRefreshToken(req, res);
      return true;
    } catch (error) {
      console.log(`[REQ ${id}] ⛔ GUARD: Refresh failed`);
      throw new UnauthorizedException();
    }
  }
}