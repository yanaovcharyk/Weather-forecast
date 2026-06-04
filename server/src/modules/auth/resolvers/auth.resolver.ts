import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { LoginInput, RegisterInput, AuthOutput } from '../dto';
import { IGQLContext } from '../../cities/interfaces';
import { AuthService } from '../services';
import { AccessJwtGuard, RefreshJwtGuard } from '../guards';
import { AppLoggerService } from '../../logger/services/app-logger.service';
import { LogResolver } from '../../../shared/logging';
import { MeOutput } from '../dto/me.output';
import {
  IAccessJwtUser,
  IRefreshJwtUser,
} from '../interfaces/jwt-payload.interfaces';
import { CurrentUser } from '../decorators/current-user.decorator';

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
      req: ctx.req,
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
      req: ctx.req,
      res: ctx.res,
    });
  }

  @Mutation(() => AuthOutput)
  @UseGuards(RefreshJwtGuard)
  @LogResolver()
  async logout(
    @CurrentUser() user: IRefreshJwtUser,
    @Context() ctx: IGQLContext,
  ) {
    return this.authService.logout({
      userId: user.userId,
      res: ctx.res,
    });
  }

  @Mutation(() => AuthOutput)
  @UseGuards(RefreshJwtGuard)
  @LogResolver()
  async refreshTokens(
    @CurrentUser() user: IRefreshJwtUser,
    @Context() ctx: IGQLContext,
  ) {
    return this.authService.rotateRefreshToken({
      oldToken: user.refreshToken,
      req: ctx.req,
      res: ctx.res,
    });
  }

  @Query(() => MeOutput)
  @UseGuards(AccessJwtGuard)
  async me(@CurrentUser() user: IAccessJwtUser) {
    return {
      userId: user.userId,
    };
  }
}
