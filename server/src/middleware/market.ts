import type { NextFunction, Request, Response } from 'express';
import { isSupportedMarket } from '../config/markets.js';

/** Guards any `/:market/...` route — an unknown country code never reaches the controller. */
export function requireSupportedMarket(req: Request, res: Response, next: NextFunction): void {
  const { market } = req.params;
  if (typeof market !== 'string' || !isSupportedMarket(market)) {
    res.status(404).json({ error: 'unsupported_market' });
    return;
  }
  next();
}
