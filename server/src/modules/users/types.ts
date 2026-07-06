export type CreateUserWithAuthParams = {
  email: string;
  passwordHash: string;
  salt: string;
};

export type UserAuthParams = {
  userId: string;
};
