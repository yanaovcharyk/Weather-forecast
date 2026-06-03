export interface ILoginMutationResponse {
  login: {
    success: boolean;
  };
}

export interface IMeQuery {
  me: {
    userId: string;
  };
}

export interface IAuthContextValue {
  login: () => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}
