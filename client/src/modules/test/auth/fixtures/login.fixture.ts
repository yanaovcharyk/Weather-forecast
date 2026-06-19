export const LOGIN_FIXTURE = {
  email: 'test@test.com',
  password: '123456',
  wrongPassword: '',
};

export const INVALID_EMAIL_FIXTURE = {
  email: 'invalid-email',
  password: '123456',
};

export const LOGIN_SUCCESS_RESPONSE = {
  data: {
    login: {
      success: true,
    },
  },
};

export const LOGIN_FAIL_RESPONSE = {
  data: {
    login: {
      success: false,
    },
  },
};
