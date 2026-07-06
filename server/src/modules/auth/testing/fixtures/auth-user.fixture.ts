import { IUserEntity } from '@users/interfaces';

export const MockUser: IUserEntity = {
  id: '1',
  email: 'test@test.com',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const MockUserAuth = {
  id: 'auth-1',
  userId: MockUser.id,
  passwordHash: 'hashed-password',
  salt: 'salt',
  refreshTokenVersion: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};
