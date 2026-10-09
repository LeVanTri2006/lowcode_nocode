import { Router } from 'express';
import { getAllowedOrigins, getAuthConfig, hasTrustedOrigin, verifyPassword } from '../auth/config';
import { requireAuthenticatedUser } from '../auth/session';

const router = Router();
const loginFailures = new Map<string, { count: number; startedAt: number }>();
const LOGIN_LIMIT = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const COOKIE_NAME = 'aca.sid';

function originIsAllowed(req: import('express').Request) {
  return hasTrustedOrigin(req.get('origin'), getAllowedOrigins());
}

router.post('/login', async (req, res, next) => {
  const config = getAuthConfig();
  if (!config) {
    res.status(503).json({ success: false, code: 'AUTH_NOT_CONFIGURED', message: 'Đăng nhập chưa được cấu hình trên máy chủ.' });
    return;
  }
  if (!originIsAllowed(req)) {
    res.status(403).json({ success: false, code: 'ORIGIN_NOT_ALLOWED', message: 'Nguồn yêu cầu không được phép.' });
    return;
  }

  const now = Date.now();
  const key = req.ip || req.socket.remoteAddress || 'unknown';
  const current = loginFailures.get(key);
  const attempts = current && now - current.startedAt < LOGIN_WINDOW_MS ? current : { count: 0, startedAt: now };
  if (attempts.count >= LOGIN_LIMIT) {
    res.status(429).json({ success: false, code: 'LOGIN_RATE_LIMITED', message: 'Bạn đã thử đăng nhập quá nhiều lần. Vui lòng đợi 15 phút rồi thử lại.' });
    return;
  }

  const username = typeof req.body?.username === 'string' ? req.body.username.trim() : '';
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  try {
    const passwordMatches = await verifyPassword(password, config.passwordHash);
    if (username !== config.username || !passwordMatches) {
      attempts.count += 1;
      loginFailures.set(key, attempts);
      res.status(401).json({ success: false, code: 'INVALID_CREDENTIALS', message: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
      return;
    }

    loginFailures.delete(key);
    req.session.regenerate((error) => {
      if (error) { next(error); return; }
      req.session.authUser = { username: config.username, role: config.role };
      req.session.save((saveError) => {
        if (saveError) { next(saveError); return; }
        res.json({ success: true, data: { user: { username: config.username, role: config.role } } });
      });
    });
  } catch (error) {
    next(error);
  }
});

router.get('/session', requireAuthenticatedUser, (req, res) => {
  res.json({ success: true, data: { user: req.session.authUser } });
});

router.post('/logout', (req, res, next) => {
  if (!originIsAllowed(req)) {
    res.status(403).json({ success: false, code: 'ORIGIN_NOT_ALLOWED', message: 'Nguồn yêu cầu không được phép.' });
    return;
  }
  req.session.destroy((error) => {
    if (error) { next(error); return; }
    res.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: 'lax', secure: req.secure, path: '/' });
    res.json({ success: true, data: { loggedOut: true } });
  });
});

export default router;
