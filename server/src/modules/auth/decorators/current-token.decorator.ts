import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentToken = createParamDecorator(
  (_, context: ExecutionContext): string => {
    const ctx = GqlExecutionContext.create(context).getContext();

    return ctx.jwtToken;
  },
);
