export interface IAccessJwtPayload {
  userId: string;
  email: string;
  type: 'access';
}

export interface IRefreshJwtPayload {
  userId: string;
  version: number;
  type: 'refresh';
}

export type JwtPayload =
  | IAccessJwtPayload
  | IRefreshJwtPayload;
export interface IRefreshJwtUser extends IRefreshJwtPayload {
  refreshToken: string;
}

export interface IAccessJwtUser extends IAccessJwtPayload {}
