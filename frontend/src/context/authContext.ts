import { createContext } from 'react';
import type { AuthUser } from '../types/auth';

export interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  refresh: () => Promise<AuthUser | null>;
  signIn: (username: string, password: string) => Promise<AuthUser>;
  signOut: () => Promise<void>;
}
export const AuthContext = createContext<AuthContextValue | null>(null);
