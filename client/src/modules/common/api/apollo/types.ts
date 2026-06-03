export interface IRefreshTokensResponse {
  refreshTokens: {
    success: boolean;
  };
}

export interface GraphQLFormattedError {
  message: string;
  extensions?: {
    code?: string;
    [key: string]: unknown;
  };
}

export interface GraphQLResponse<T> {
  data?: T;
  errors?: GraphQLFormattedError[];
}
