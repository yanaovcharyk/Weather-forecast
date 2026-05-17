import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { LoginInput, RegisterInput, LoginOutput, AuthOutput } from '../dto';
import { GQLContext } from '../../cities/interfaces';
import { AuthService } from '../services';
import { AccessJwtGuard, RefreshJwtGuard } from '../guards';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginOutput)
  async login(@Args('input') input: LoginInput, @Context() ctx: GQLContext) {
    await this.authService.login(input, ctx.req, ctx.res);
    return { success: true };
  }

  @Mutation(() => LoginOutput)
  async register(
    @Args('input') input: RegisterInput,
    @Context() ctx: GQLContext,
  ) {
    await this.authService.register(input, ctx.req, ctx.res);
    return { success: true };
  }

  @Mutation(() => AuthOutput)
  @UseGuards(RefreshJwtGuard)
  async logout(@Context() ctx: GQLContext) {
    return this.authService.logout(ctx.req.user.userId, ctx.res);
  }

  @Mutation(() => AuthOutput)
  @UseGuards(RefreshJwtGuard)
  async refreshTokens(@Context() ctx: GQLContext) {
    return this.authService.rotateRefreshToken(
      ctx.req.user.refreshToken,
      ctx.req,
      ctx.res,
    );
  }

  @Query(() => Boolean)
  @UseGuards(AccessJwtGuard)
  async me() {
    return true;
  }
}
