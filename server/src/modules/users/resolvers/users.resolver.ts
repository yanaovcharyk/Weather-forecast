import { Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from '@auth/decorators';
import { AccessJwtGuard } from '@auth/guards';
import { ICurrentUser } from '@auth/interfaces';
import { AppLoggerService } from '@logger/services';
import { LogResolver } from '@logger/decorators';
import { MeOutput } from '@users/dto';

@Resolver()
export class UsersResolver {
  private readonly logger;

  constructor(loggerService: AppLoggerService) {
    this.logger = loggerService.child(UsersResolver.name);
  }

  @Query(() => MeOutput)
  @UseGuards(AccessJwtGuard)
  @LogResolver()
  async me(@CurrentUser() user: ICurrentUser): Promise<MeOutput> {
    return {
      userId: user.id,
    };
  }
}
