import { IBaseEntity } from "../../../shared/types/base.entity.interface";

export interface IUserEntity extends IBaseEntity {
  email: string;
  password: string;
  salt: string;
  refreshTokenVersion: number;
}
