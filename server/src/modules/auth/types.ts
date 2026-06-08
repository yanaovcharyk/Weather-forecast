import { Request, Response } from 'express';
import { LoginInput, RegisterInput } from './dto';

export enum TokenType {
  ACCESS = 'access',
  REFRESH = 'refresh',
}

export enum TokenName {
  ACCESS = 'accessToken',
  REFRESH = 'refreshToken',
}

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export type LoginParams = {
  input: LoginInput;
  req: Request;
  res: Response;
};

export type RegisterParams = {
  input: RegisterInput;
  req: Request;
  res: Response;
};

export type LogoutParams = {
  userId: string;
  res: Response;
};

export type RotateRefreshTokenParams = {
  oldToken: string;
  res: Response;
};

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

export type SetCookieParams = {
  res: Response;
  token: string;
  type: TokenType;
};

export type ClearCookieParams = {
  res: Response;
  type: TokenType;
};

export type GetTokenParams = {
  req: Request;
  type: TokenType;
};

export type HashPasswordParams = {
  password: string;
};

export type ValidatePasswordParams = {
  password: string;
  expectedHashPassword: string;
  salt: string;
};

export type HashPasswordResult = {
  hash: string;
  salt: string;
};

export type ValidatePasswordResult = boolean;
