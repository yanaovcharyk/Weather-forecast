import {
  Args,
  Mutation,
  Resolver,
} from '@nestjs/graphql';

import { ClientLoggerService }
  from '../services/client-logger.service';
import { ClientLogInput } from '../dto/client-log.input';


@Resolver()
export class ClientLogsResolver {
  constructor(
    private readonly clientLoggerService: ClientLoggerService,
  ) {}

  @Mutation(() => Boolean)
  async sendClientLogs(
    @Args('input', {
      type: () => [ClientLogInput],
    })
    input: ClientLogInput[],
  ): Promise<boolean> {
    this.clientLoggerService
      .writeLogs(input);

    return true;
  }
}
