import { IAccessJwtPayload } from './jwt-payload.interfaces';

export interface IJwtProvider<TPayload extends IAccessJwtPayload> {
  sign(payload: TPayload): Promise<string>;
  verify(token: string): Promise<TPayload>;
}

export const ACCESS_TOKEN_PROVIDER = Symbol('ACCESS_TOKEN_PROVIDER');
export const REFRESH_TOKEN_PROVIDER = Symbol('REFRESH_TOKEN_PROVIDER');
