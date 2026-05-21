import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';

import { UseGuards } from '@nestjs/common';

import { LoginInput, RegisterInput, LoginOutput, AuthOutput } from '../dto';

import { GQLContext } from '../../cities/interfaces';
import { AuthService } from '../services';
import { AccessJwtGuard, RefreshJwtGuard } from '../guards';
import { AppLoggerService } from '../../logger/services/app-logger.service';

@Resolver()
export class AuthResolver {
  private readonly logger;

  constructor(
    private readonly authService: AuthService,
    loggerService: AppLoggerService,
  ) {
    this.logger = loggerService.child(AuthResolver.name);
  }

  @Mutation(() => LoginOutput)
  async login(@Args('input') input: LoginInput, @Context() ctx: GQLContext) {
    this.logger.info('Login mutation called', {
      email: input.email,
      ip: ctx.req.ip,
    });

    await this.authService.login(input, ctx.req, ctx.res);

    return { success: true };
  }

  @Mutation(() => LoginOutput)
  async register(
    @Args('input') input: RegisterInput,
    @Context() ctx: GQLContext,
  ) {
    this.logger.info('Register mutation called', {
      email: input.email,
      ip: ctx.req.ip,
    });

    await this.authService.register(input, ctx.req, ctx.res);

    return { success: true };
  }

  @Mutation(() => AuthOutput)
  @UseGuards(RefreshJwtGuard)
  async logout(@Context() ctx: GQLContext) {
    this.logger.info('Logout mutation called', {
      userId: ctx.req.user.userId,
    });

    return this.authService.logout(ctx.req.user.userId, ctx.res);
  }

  @Mutation(() => AuthOutput)
  @UseGuards(RefreshJwtGuard)
  async refreshTokens(@Context() ctx: GQLContext) {
    this.logger.info('Refresh tokens mutation called', {
      userId: ctx.req.user.userId,
      ip: ctx.req.ip,
    });

    return this.authService.rotateRefreshToken(
      ctx.req.user.refreshToken,
      ctx.req,
      ctx.res,
    );
  }

  @Query(() => Boolean)
  @UseGuards(AccessJwtGuard)
  async me(@Context() ctx: GQLContext) {
    this.logger.debug('Me query accessed');

    return true;
  }
}
