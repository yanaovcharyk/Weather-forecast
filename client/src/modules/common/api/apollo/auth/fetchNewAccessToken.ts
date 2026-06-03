import type { GraphQLResponse } from '@/common/types';
import { config } from '@/common/config';

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
      query: `
        mutation {
          refreshTokens {
            success
          }
        }
      `,
    }),
  });

  const json: GraphQLResponse<RefreshTokensResponse> = await res.json();
  return json.data?.refreshTokens.success === true;
};
