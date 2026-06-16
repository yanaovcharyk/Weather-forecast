export const createUser = (overrides = {}) => ({
  userId: '1',
  email: 'test@test.com',
  ...overrides,
});
