import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { LoginInput, RegisterInput, AuthOutput } from '../dto';
import { GQLContext } from '../../cities/interfaces';
import { AuthService } from '../services';
import { AccessJwtGuard, RefreshJwtGuard } from '../guards';
import { AppLoggerService } from '../../logger/services/app-logger.service';
import { LogResolver } from '../../../shared/logging';
import { MeOutput } from '../dto/me.output';

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
  async login(@Args('input') input: LoginInput, @Context() ctx: GQLContext) {
    return this.authService.login({
      input,
      req: ctx.req,
      res: ctx.res,
    });
  }

  @Mutation(() => AuthOutput)
  @LogResolver()
  async register(
    @Args('input') input: RegisterInput,
    @Context() ctx: GQLContext,
  ) {
    return this.authService.register({
      input,
      req: ctx.req,
      res: ctx.res,
    });
  }

  @Mutation(() => AuthOutput)
  @UseGuards(RefreshJwtGuard)
  @LogResolver()
  async logout(@Context() ctx: GQLContext) {
    return this.authService.logout({
      userId: ctx.req.user.userId,
      res: ctx.res,
    });
  }

  @Mutation(() => AuthOutput)
  @UseGuards(RefreshJwtGuard)
  @LogResolver()
  async refreshTokens(@Context() ctx: GQLContext) {
    return this.authService.rotateRefreshToken({
      oldToken: ctx.req.user.refreshToken,
      req: ctx.req,
      res: ctx.res,
    });
  }

  @Query(() => MeOutput)
  @UseGuards(AccessJwtGuard)
  async me(@Context() ctx: GQLContext) {
    return {
      userId: ctx.req.user.userId,
    };
  }
}
