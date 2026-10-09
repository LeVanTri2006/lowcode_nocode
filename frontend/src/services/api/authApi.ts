import { apiRequest } from './client';
import type { AuthUser } from '../../types/auth';

export const getCurrentUser = () => apiRequest<{ user: AuthUser }>('/api/auth/session');
export const login = (username: string, password: string) =>
  apiRequest<{ user: AuthUser }>('/api/auth/login', { method: 'POST', body: { username, password } });
export const logout = () => apiRequest<{ loggedOut: boolean }>('/api/auth/logout', { method: 'POST' });
export const requestWf01Run = () => apiRequest<{ status: 'accepted' }>('/api/workflows/wf01/run', { method: 'POST' });
