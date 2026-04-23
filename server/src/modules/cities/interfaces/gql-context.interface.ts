import { Request, Response } from 'express';

export interface GQLContext {
  req: Request & {
    user: {
      userId: string;
      email: string;
      refreshToken: string;
    };
  };
  res: Response;
}
