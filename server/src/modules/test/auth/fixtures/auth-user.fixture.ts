import { IUserEntity } from '@users/interfaces';

export const mockUser: IUserEntity = {
  id: '1',
  email: 'test@test.com',
  password: 'hashed-password',
  salt: 'salt',
  refreshTokenVersion: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};
