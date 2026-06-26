export const REFRESH_SUCCESS_RESPONSE = {
  data: {
    refreshTokens: {
      success: true,
    },
  },
} as const;

export const REFRESH_FAIL_RESPONSE = {
  data: {
    refreshTokens: {
      success: false,
    },
  },
} as const;

export const REFRESH_EMPTY_RESPONSE = {} as const;
