export interface ILoginMutationResponse {
  login: {
    success: boolean;
  };
}

export interface IMeQuery {
  me: {
    id: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface IAuthContextValue {
  login: () => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}
