import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { ClientLoggerService } from '@logger/services';
import { ClientLogInput } from '@logger/dto';

@Resolver()
export class ClientLogsResolver {
  constructor(private readonly clientLoggerService: ClientLoggerService) {}

  @Mutation(() => Boolean)
  async sendClientLogs(
    @Args('input', {
      type: () => [ClientLogInput],
    })
    input: ClientLogInput[],
  ): Promise<boolean> {
    this.clientLoggerService.writeLogs(input);

    return true;
  }
}
