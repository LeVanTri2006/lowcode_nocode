import { scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
export type AuthRole = 'operator' | 'viewer';

export interface OperatorAuthConfig {
  username: string;
  passwordHash: string;
  role: AuthRole;
  sessionSecret: string;
  allowedOrigins: Set<string>;
}

export function getAllowedOrigins() {
  const configured = process.env.AUTH_ALLOWED_ORIGINS ?? 'http://localhost:5173,https://enrich-tile-shale.ngrok-free.dev';
  return new Set(configured.split(',').map((origin) => origin.trim()).filter(Boolean));
}

export function getAuthConfig(): OperatorAuthConfig | null {
  const username = process.env.AUTH_USERNAME?.trim();
  const passwordHash = process.env.AUTH_PASSWORD_HASH?.trim();
  const role = process.env.AUTH_ROLE?.trim();
  const sessionSecret = process.env.SESSION_SECRET ?? '';
  const allowedOrigins = getAllowedOrigins();

  if (!username || !passwordHash || !sessionSecret || sessionSecret.length < 32 ||
    (role !== 'operator' && role !== 'viewer') || !isScryptHash(passwordHash) || allowedOrigins.size === 0) {
    return null;
  }

  return { username, passwordHash, role, sessionSecret, allowedOrigins };
}

export function isScryptHash(value: string) {
  const parts = value.split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt' || parts[1] !== '16384' || parts[2] !== '8' || parts[3] !== '1') return false;
  try {
    return Buffer.from(parts[4], 'base64url').length >= 16 && Buffer.from(parts[5], 'base64url').length === 64;
  } catch {
    return false;
  }
}

export async function verifyPassword(password: string, encodedHash: string) {
  const [, n, r, p, salt, expectedText] = encodedHash.split('$');
  const expected = Buffer.from(expectedText, 'base64url');
  const actual = await new Promise<Buffer>((resolve, reject) => {
    scryptCallback(password, Buffer.from(salt, 'base64url'), expected.length, {
      N: Number(n), r: Number(r), p: Number(p), maxmem: 32 * 1024 * 1024,
    }, (error, key) => error ? reject(error) : resolve(key as Buffer));
  });
  return timingSafeEqual(actual, expected);
}

export function hasTrustedOrigin(origin: string | undefined, allowedOrigins: Set<string>) {
  return Boolean(origin && allowedOrigins.has(origin));
}
