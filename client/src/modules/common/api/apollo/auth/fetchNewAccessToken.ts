import type { GraphQLResponse } from '@/common/types';
import { config } from '@/common/config';
import { REFRESH_TOKENS_MUTATION_STRING } from '../graphql/mutations';

interface RefreshTokensResponse {
  refreshTokens: {
    success: boolean;
  };
}

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

  const json: GraphQLResponse<RefreshTokensResponse> = await res.json();
  return json.data?.refreshTokens.success === true;
};
