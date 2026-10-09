import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ApiError } from '../services/api/client';
import { getCurrentUser, login as loginRequest, logout as logoutRequest } from '../services/api/authApi';
import type { AuthUser } from '../types/auth';
import { AuthContext } from './authContext';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(async () => {
    try { const result = await getCurrentUser(); setUser(result.user); return result.user; }
    catch (error) { if (error instanceof ApiError && error.status === 401) { setUser(null); return null; } throw error; }
  }, []);
  useEffect(() => { let active = true; getCurrentUser().then((result) => { if (active) setUser(result.user); }).catch(() => { if (active) setUser(null); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, []);
  const signIn = useCallback(async (username: string, password: string) => { const result = await loginRequest(username, password); setUser(result.user); return result.user; }, []);
  const signOut = useCallback(async () => { await logoutRequest(); setUser(null); }, []);
  const value = useMemo(() => ({ user, loading, refresh, signIn, signOut }), [user, loading, refresh, signIn, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
