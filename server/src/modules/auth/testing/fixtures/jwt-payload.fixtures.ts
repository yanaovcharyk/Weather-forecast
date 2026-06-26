import { IAccessJwtPayload, IRefreshJwtPayload } from '@auth/interfaces';
import { TokenType } from '@auth/types';

export const accessJwtPayloadFixture: IAccessJwtPayload = {
  userId: '1',
  type: TokenType.ACCESS,
};

export const refreshJwtPayloadFixture: IRefreshJwtPayload = {
  userId: '1',
  version: 1,
  type: TokenType.REFRESH,
};
