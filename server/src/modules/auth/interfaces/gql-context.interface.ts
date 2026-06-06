import { Request, Response } from 'express';
import { ICurrentUser, JwtPayload } from '@auth/interfaces';
import { TokenType } from '@auth/types';

export interface IGQLContext {
  req: Request;
  res: Response;
  user: ICurrentUser;
  jwtToken: string;
  jwtPayload?: JwtPayload;
}
