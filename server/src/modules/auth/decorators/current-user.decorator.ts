import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ICurrentUser } from '../interfaces';

export const CurrentUser = createParamDecorator<ICurrentUser>(
  (_, context: ExecutionContext): ICurrentUser => {
    const gqlContext = GqlExecutionContext
      .create(context)
      .getContext();
    const authPayload = gqlContext.jwtPayload;

    const user = {
      id: authPayload.userId,
      email: authPayload.email,
    };

    return user;
  },
);
