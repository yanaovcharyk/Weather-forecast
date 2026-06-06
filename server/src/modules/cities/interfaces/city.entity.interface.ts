import { IBaseEntity } from "@shared/types";

export interface ICityEntity extends IBaseEntity {
  city: string;
  lat: number;
  lon: number;
  userId: string;
  isPinned: boolean;
}
