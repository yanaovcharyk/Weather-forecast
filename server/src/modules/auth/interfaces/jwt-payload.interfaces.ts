import { TokenType } from '@auth/types';

export interface IAccessJwtPayload {
  userId: string;
  type: TokenType.ACCESS;
}

export interface IRefreshJwtPayload {
  userId: string;
  version: number;
  type: TokenType.REFRESH;
}

export type JwtPayload = IAccessJwtPayload | IRefreshJwtPayload;
