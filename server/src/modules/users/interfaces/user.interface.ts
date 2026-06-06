import { IBaseEntity } from "@shared/types";

export interface IUserEntity extends IBaseEntity {
  email: string;
  password: string;
  salt: string;
  refreshTokenVersion: number;
}
