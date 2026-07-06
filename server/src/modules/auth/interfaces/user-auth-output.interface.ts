export interface IUserAuthOutput {
  userId: string;
  passwordHash: string;
  salt: string;
  refreshTokenVersion: number;
}
