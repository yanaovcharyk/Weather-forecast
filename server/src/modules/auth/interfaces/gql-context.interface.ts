import { Request, Response } from 'express';
import { ICurrentUser } from '@auth/interfaces';
import { TokenType } from '@auth/types';

export interface IGQLContext {
  req: Request;
  res: Response;
  user: ICurrentUser;

  jwtToken: string;

  jwtPayload?: {
    userId: string;
    email?: string;
    type: TokenType.ACCESS | TokenType.REFRESH;
    version?: number;
  };
}
