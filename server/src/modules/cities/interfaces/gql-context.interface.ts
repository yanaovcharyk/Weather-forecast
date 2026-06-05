import { Request, Response } from 'express';
import { ICurrentUser } from '@auth/interfaces/user-context.interface';

export interface IGQLContext {
  req: Request;
  res: Response;
  user: ICurrentUser;
}
