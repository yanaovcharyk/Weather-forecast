import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { CurrentUser } from '@auth/decorators';
import { AccessJwtGuard } from '@auth/guards';
import { ICurrentUser } from '@auth/interfaces';
import { AppLoggerService } from '@logger/services';
import { LogResolver } from '@logger/decorators';
import { CreateUserInput, UserOutput } from '@users/dto';
import { IUserEntity } from '@users/interfaces';
import { UserService } from '@users/services';

@Resolver()
export class UsersResolver {
  private readonly logger;

  constructor(
    private readonly userService: UserService,
    loggerService: AppLoggerService,
  ) {
    this.logger = loggerService.child(UsersResolver.name);
  }

  @Mutation(() => UserOutput)
  @LogResolver()
  async createUser(@Args('input') input: CreateUserInput): Promise<UserOutput> {
    const user = await this.userService.createUserWithPassword(input);

    return this.toUserOutput(user);
  }

  @Query(() => UserOutput)
  @UseGuards(AccessJwtGuard)
  @LogResolver()
  async me(@CurrentUser() user: ICurrentUser): Promise<UserOutput> {
    const currentUser = await this.userService.findById(user.id);

    if (!currentUser) {
      throw new UnauthorizedException('Unauthorized');
    }

    return this.toUserOutput(currentUser);
  }

  private toUserOutput(user: IUserEntity): UserOutput {
    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt!,
      updatedAt: user.updatedAt!,
    };
  }
}
