import { config } from '@/common/config';
import { REFRESH_TOKENS_MUTATION_STRING } from '@/auth/graphql/mutations';
import type {
  GraphQLResponse,
  IRefreshTokensResponse,
} from '@/common/api/apollo/types';

export const fetchNewAccessToken = async (): Promise<boolean> => {
  const res = await fetch(config.apiBaseUrl + config.graphqlPath, {
    method: 'POST',
    credentials: 'include',
    keepalive: true,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: REFRESH_TOKENS_MUTATION_STRING,
    }),
  });

  const json: GraphQLResponse<IRefreshTokensResponse> = await res.json();
  return json.data?.refreshTokens.success === true;
};
