import { Response } from 'express';
import { IAuthInput } from './interfaces';

export enum TokenType {
  ACCESS = 'access',
  REFRESH = 'refresh',
}

export enum TokenName {
  ACCESS = 'accessToken',
  REFRESH = 'refreshToken',
}

export type LoginParams = {
  input: IAuthInput;
  res: Response;
};

export type LogoutParams = {
  userId: string;
  res: Response;
};

export type RotateRefreshTokenParams = {
  oldToken: string | null;
  res: Response;
};

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
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
