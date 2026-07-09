import { REFRESH_TOKENS_MUTATION_STRING } from '@/auth/graphql/mutations';
import type {
  GraphQLResponse,
  IRefreshTokensResponse,
} from '@/common/api/apollo/types';
import { createApiUrl, postGraphQL } from '@/common/api/http';
import { config } from '@/common/config';

export const fetchNewAccessToken = async (): Promise<boolean> => {
  const json: GraphQLResponse<IRefreshTokensResponse> = await postGraphQL(
    createApiUrl(config.graphqlPath),
    {
      query: REFRESH_TOKENS_MUTATION_STRING,
    },
    {
      keepalive: true,
    },
  );

  return json.data?.refreshTokens.success === true;
};
