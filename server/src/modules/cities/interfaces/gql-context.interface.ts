import { Request, Response } from 'express';
import { IAccessJwtUser } from '@auth/interfaces/jwt-payload.interfaces';

export interface IGQLContext {
  req: Request;
  res: Response;
  user: IAccessJwtUser;
}
