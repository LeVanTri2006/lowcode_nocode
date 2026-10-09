import type { NextFunction, Request, Response } from 'express';
import type { AuthRole } from './config';

declare module 'express-session' {
  interface SessionData {
    authUser?: { username: string; role: AuthRole };
  }
}

export function requireAuthenticatedUser(req: Request, res: Response, next: NextFunction) {
  if (!req.session.authUser) {
    res.status(401).json({ success: false, code: 'AUTH_REQUIRED', message: 'Vui lòng đăng nhập để tiếp tục.' });
    return;
  }
  next();
}

export function requireRole(role: AuthRole) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.authUser) {
      res.status(401).json({ success: false, code: 'AUTH_REQUIRED', message: 'Vui lòng đăng nhập để tiếp tục.' });
      return;
    }
    if (req.session.authUser.role !== role) {
      res.status(403).json({ success: false, code: 'FORBIDDEN', message: 'Tài khoản của bạn không có quyền vận hành quy trình này.' });
      return;
    }
    next();
  };
}
