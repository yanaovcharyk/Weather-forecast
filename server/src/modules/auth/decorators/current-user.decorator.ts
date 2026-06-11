import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ICurrentUser } from '@auth/interfaces';

export const mapJwtToUser = (authPayload: any): ICurrentUser => ({
  id: authPayload.userId,
  email: authPayload.email,
});

export const CurrentUser = createParamDecorator(
  (_, context: ExecutionContext) => {
    const gqlContext = GqlExecutionContext.create(context).getContext();
    return mapJwtToUser(gqlContext.jwtPayload);
  },
);