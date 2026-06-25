import { GqlExecutionContext } from "@nestjs/graphql";
import { MockGqlContext } from "./gql-context";

export function mockGqlExecutionContext(context: MockGqlContext) {
  return jest
    .spyOn(GqlExecutionContext, 'create')
    .mockReturnValue({
      getContext: () => context,
    } as any);
}
