export interface AuthContext {
  token: string;
  tokenType: 'access' | 'refresh';
  version?: number;
}
