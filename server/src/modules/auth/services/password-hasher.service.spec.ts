import { Pbkdf2PasswordHasher } from './password-hasher.service';
import { createPasswordHasherContext } from '@test/auth';

describe('Pbkdf2PasswordHasher', () => {
  let service: Pbkdf2PasswordHasher;
  let ctx: Awaited<ReturnType<typeof createPasswordHasherContext>>;

  beforeEach(async () => {
    ctx = await createPasswordHasherContext();
    service = ctx.service;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('hash', () => {
    it('should create hash and salt', async () => {
      const result = await service.hash({
        password: '123456',
      });

      expect(result.hash).toBeDefined();
      expect(result.salt).toBeDefined();
    });
  });

  describe('validatePassword', () => {
    it('should validate correct password', async () => {
      const { hash, salt } = await service.hash({
        password: '123456',
      });

      const result = await service.validatePassword({
        password: '123456',
        expectedHashPassword: hash,
        salt,
      });

      expect(result).toBe(true);
    });

    it('should reject invalid password', async () => {
      const { hash, salt } = await service.hash({
        password: '123456',
      });

      const result = await service.validatePassword({
        password: 'wrong',
        expectedHashPassword: hash,
        salt,
      });

      expect(result).toBe(false);
    });
  });
});
