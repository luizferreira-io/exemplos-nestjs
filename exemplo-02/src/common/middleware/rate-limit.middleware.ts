import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private readonly requests = new Map<string, number[]>();
  private readonly windowMs = 15 * 60 * 1000; // 15 minutes
  private readonly maxRequests = 100; // max 100 requests per window

  use(req: Request, res: Response, next: NextFunction): void {
    const clientIp = req.ip || (req as any).connection?.remoteAddress || 'unknown';
    const now = Date.now();

    if (!this.requests.has(clientIp)) {
      this.requests.set(clientIp, []);
    }

    const clientRequests = this.requests.get(clientIp) || [];
    const validRequests = clientRequests.filter((time) => now - time < this.windowMs);

    if (validRequests.length >= this.maxRequests) {
      res.status(429).json({
        message: 'Too many requests',
        retryAfter: this.windowMs / 1000,
      });
      return;
    }

    validRequests.push(now);
    this.requests.set(clientIp, validRequests);
    next();
  }
}
