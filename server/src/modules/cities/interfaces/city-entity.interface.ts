export interface ICityEntity {
  id: string;
  city: string;
  lat: number;
  lon: number;
  userId: string;
  isPinned: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
