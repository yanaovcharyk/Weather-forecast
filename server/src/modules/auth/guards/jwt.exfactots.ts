import { Request } from 'express';

export const extractAccessToken = (req: Request): string | null =>
  req.cookies?.accessToken ?? null;

export const extractRefreshToken = (req: Request): string | null =>
  req.cookies?.refreshToken ?? null;
