import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ICurrentUser, JwtPayload } from '@auth/interfaces';

export const mapJwtToUser = (authPayload: JwtPayload): ICurrentUser => ({
  id: authPayload.userId,
});

export const CurrentUser = createParamDecorator(
  (_, context: ExecutionContext) => {
    const gqlContext = GqlExecutionContext.create(context).getContext<{
      jwtPayload: JwtPayload;
    }>();

    return mapJwtToUser(gqlContext.jwtPayload);
  },
);
