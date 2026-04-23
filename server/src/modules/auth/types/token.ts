export enum TokenType {
  ACCESS = 'access',
  REFRESH = 'refresh',
}

export enum TokenName {
  ACCESS = 'accessToken',
  REFRESH = 'refreshToken',
}

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};