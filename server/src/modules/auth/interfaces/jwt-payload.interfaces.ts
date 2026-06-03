export interface IBaseJwtPayload {
  userId: string;
}

export interface IAccessJwtPayload extends IBaseJwtPayload {
  email: string;
  type: 'access';
}

export interface IRefreshJwtPayload extends IBaseJwtPayload {
  type: 'refresh';
  version: number;
}
export interface IRefreshJwtUser extends IRefreshJwtPayload {
  refreshToken: string;
}

export interface IAccessJwtUser extends IAccessJwtPayload {}
