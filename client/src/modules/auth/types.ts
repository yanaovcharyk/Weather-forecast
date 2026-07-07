export interface ILoginMutationResponse {
  login: {
    success: boolean;
  };
}

export interface ILogoutMutationResponse {
  logout: {
    success: boolean;
  };
}

export type ICurrentUser = {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export interface IMeQuery {
  me: ICurrentUser | null;
}

export interface IAuthContextValue {
  currentUser: ICurrentUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}
