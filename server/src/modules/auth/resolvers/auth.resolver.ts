import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { LoginInput, AuthOutput } from '@auth/dto';
import { AuthCookieService, AuthService } from '@auth/services';
import { RefreshJwtGuard } from '@auth/guards';
import { AppLoggerService } from '@logger/services';
import { LogResolver } from '@logger/decorators';
import { CurrentUser } from '@auth/decorators';
import { ICurrentUser, IGQLContext } from '@auth/interfaces';

@Resolver()
export class AuthResolver {
  private readonly logger;

  constructor(
    private readonly authService: AuthService,
    private readonly authCookieService: AuthCookieService,
    loggerService: AppLoggerService,
  ) {
    this.logger = loggerService.child(AuthResolver.name);
  }

  @Mutation(() => AuthOutput)
  @LogResolver()
  async login(
    @Args('input') input: LoginInput,
    @Context() ctx: IGQLContext,
  ): Promise<AuthOutput> {
    return this.authService.login({
      input,
      res: ctx.res,
    });
  }

  @Mutation(() => AuthOutput)
  @UseGuards(RefreshJwtGuard)
  @LogResolver()
  async logout(
    @CurrentUser() user: ICurrentUser,
    @Context() ctx: IGQLContext,
  ): Promise<AuthOutput> {
    if (!user?.id) {
      throw new UnauthorizedException('Missing user id');
    }

    return this.authService.logout({
      userId: user.id,
      res: ctx.res,
    });
  }

  @Mutation(() => AuthOutput)
  @LogResolver()
  async refreshTokens(@Context() ctx: IGQLContext): Promise<AuthOutput> {
    return this.authService.rotateRefreshToken({
      oldToken: this.authCookieService.getRefreshToken(ctx.req),
      res: ctx.res,
    });
  }
}
