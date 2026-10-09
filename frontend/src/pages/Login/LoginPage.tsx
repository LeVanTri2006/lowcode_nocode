import React, { useEffect, useState } from 'react';
import { Loader2, LockKeyhole } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ApiError } from '../../services/api/client';
import { useAuth } from '../../hooks/useAuth';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const returnTo = (location.state as { returnTo?: string } | null)?.returnTo;
  const safeReturnTo = returnTo?.startsWith('/') && !returnTo.startsWith('//') ? returnTo : '/wf01';
  useEffect(() => { if (user) navigate(safeReturnTo, { replace: true }); }, [user, navigate, safeReturnTo]);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); if (submitting) return;
    setSubmitting(true); setError('');
    try { await signIn(username.trim(), password); navigate(safeReturnTo, { replace: true }); }
    catch (cause) { setError(cause instanceof ApiError && cause.status === 503 ? 'Đăng nhập chưa được cấu hình trên máy chủ.' : cause instanceof ApiError && cause.status === 429 ? cause.message : 'Tên đăng nhập hoặc mật khẩu không đúng.'); }
    finally { setSubmitting(false); }
  };
  return <main className="login-page"><section className="login-card"><div className="login-mark"><LockKeyhole size={23} /></div><h1>Đăng nhập hệ thống</h1><p>Đăng nhập để quản lý quyền vận hành WF01.</p><form onSubmit={submit}><label htmlFor="login-username">Tên đăng nhập</label><input id="login-username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} required disabled={submitting} /><label htmlFor="login-password">Mật khẩu</label><input id="login-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required disabled={submitting} />{error && <div role="alert" className="login-error">{error}</div>}<button type="submit" disabled={submitting || !username || !password}>{submitting && <Loader2 className="spin-icon" size={17} />}{submitting ? 'Đang đăng nhập…' : 'Đăng nhập'}</button></form></section></main>;
};
