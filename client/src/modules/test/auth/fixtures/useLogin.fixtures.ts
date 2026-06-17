export const loginSuccessFixture = {
  email: 'john@test.com',
  password: 'password123',
};

export const loginFailFixture = {
  email: 'john@test.com',
  password: 'wrong-password',
};

export const mutationSuccessResponse = {
  data: { login: { success: true } },
};

export const mutationFailResponse = {
  data: { login: { success: false } },
};
