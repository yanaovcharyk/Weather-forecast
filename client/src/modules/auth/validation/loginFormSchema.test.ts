import { loginFormSchema } from './loginFormSchema';

describe('loginFormSchema', () => {
  it('accepts valid email and password', () => {
    const result = loginFormSchema.safeParse({
      email: 'test@test.com',
      password: '123456',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = loginFormSchema.safeParse({
      email: 'not-an-email',
      password: '123456',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Invalid email');
    }
  });

  it('rejects short password', () => {
    const result = loginFormSchema.safeParse({
      email: 'test@test.com',
      password: '12',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'Password must be at least 3 characters',
      );
    }
  });
});
