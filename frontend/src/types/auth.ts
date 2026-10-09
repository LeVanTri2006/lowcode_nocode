export type AuthRole = 'operator' | 'viewer';
export interface AuthUser { username: string; role: AuthRole }
