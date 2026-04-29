import type { GraphQLResponse } from '@/modules/common/types';

interface RefreshTokensResponse {
  refreshTokens: {
    success: boolean;
  };
}

export const fetchNewAccessToken = async (): Promise<boolean> => {
  const res = await fetch(import.meta.env.VITE_API_BASE + '/graphql', {
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
