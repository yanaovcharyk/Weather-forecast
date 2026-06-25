import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { ClientLoggerService } from '@logger/services';
import { ClientLogInput } from '@logger/dto';
import {
  graphqlListType,
  graphqlType,
} from '@shared/decorators';

const clientLogListType = graphqlListType(ClientLogInput);
const booleanType = graphqlType(Boolean);

@Resolver()
export class ClientLogsResolver {
  constructor(private readonly clientLoggerService: ClientLoggerService) {}

  @Mutation(booleanType)
  async sendClientLogs(
    @Args('input', {
      type: clientLogListType,
    })
    input: ClientLogInput[],
  ): Promise<boolean> {
    this.clientLoggerService.writeLogs(input);

    return true;
  }
}
