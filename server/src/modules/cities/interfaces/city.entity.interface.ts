import { IBaseEntity } from "../../../shared/types/base.entity.interface";

export interface ICityEntity extends IBaseEntity {
  city: string;
  lat: number;
  lon: number;
  userId: string;
  isPinned: boolean;
}
