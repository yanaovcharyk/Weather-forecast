import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { LoginInput, RegisterInput, AuthOutput } from '@auth/dto';
import { AuthService } from '@auth/services';
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
    loggerService: AppLoggerService,
  ) {
    this.logger = loggerService.child(AuthResolver.name);
  }

  @Mutation(() => AuthOutput)
  @LogResolver()
  async login(@Args('input') input: LoginInput, @Context() ctx: IGQLContext) {
    return this.authService.login({
      input,
      res: ctx.res,
    });
  }

  @Mutation(() => AuthOutput)
  @LogResolver()
  async register(
    @Args('input') input: RegisterInput,
    @Context() ctx: IGQLContext,
  ) {
    return this.authService.register({
      input,
      res: ctx.res,
    });
  }

  @Mutation(() => AuthOutput)
  @UseGuards(RefreshJwtGuard)
  @LogResolver()
  async logout(@CurrentUser() user: ICurrentUser, @Context() ctx: IGQLContext) {
    if (!user?.id) {
      throw new UnauthorizedException('Missing user id');
    }

    return this.authService.logout({
      userId: user.id,
      res: ctx.res,
    });
  }

  @Mutation(() => AuthOutput)
  @UseGuards(RefreshJwtGuard)
  @LogResolver()
  async refreshTokens(@Context() ctx: IGQLContext) {
    return this.authService.rotateRefreshToken({
      oldToken: ctx.jwtToken,
      res: ctx.res,
    });
  }

}
