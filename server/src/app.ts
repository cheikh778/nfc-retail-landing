import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type NextFunction, type Request, type Response } from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { invalidCsrfTokenError } from './middleware/csrf.js';
import { logger } from './lib/logger.js';
import { createApiRouter } from './routes/api.js';
import type { LeadService } from './services/LeadService.js';

export function createApp(leadService: LeadService) {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  app.use(helmet());
  app.use(cors({ origin: env.ALLOWED_ORIGIN, credentials: true }));
  app.use(express.json({ limit: '32kb' }));
  app.use(cookieParser());

  app.use('/api', createApiRouter(leadService, logger));

  app.use((_req, res) => {
    res.status(404).json({ error: 'not_found' });
  });

  // Deliberately 4-arg: Express only treats this as an error handler with this exact signature.
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    const asError = err as { code?: string; type?: string; status?: number } | undefined;

    if (asError?.code === invalidCsrfTokenError.code) {
      res.status(403).json({ error: 'invalid_csrf_token' });
      return;
    }
    if (asError?.type === 'entity.parse.failed') {
      res.status(400).json({ error: 'invalid_json' });
      return;
    }

    // Never leak stack traces, internal messages, or CRM/API details (brief §34).
    logger.error('unhandled_request_error', { error: String(err) });
    res.status(500).json({ error: 'internal_error' });
  });

  return app;
}
