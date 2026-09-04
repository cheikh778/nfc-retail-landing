import { doubleCsrf } from 'csrf-csrf';
import type { Request } from 'express';
import { env } from '../config/env.js';

export const { generateCsrfToken, doubleCsrfProtection, invalidCsrfTokenError } = doubleCsrf({
  getSecret: () => env.CSRF_SECRET,
  getSessionIdentifier: (req: Request) => req.ip ?? 'anonymous',
  cookieName: env.NODE_ENV === 'production' ? '__Host-nfcr.csrf' : 'nfcr.csrf',
  cookieOptions: {
    sameSite: 'lax',
    secure: env.NODE_ENV === 'production',
    httpOnly: true,
    path: '/',
  },
});
