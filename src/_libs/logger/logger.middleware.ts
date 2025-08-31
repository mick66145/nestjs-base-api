import { NextFunction, Request, Response } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { ApiLoggerService } from './api-logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: ApiLoggerService) {}

  public use(request: Request, response: Response, next: NextFunction): void {
    response.on('close', () => {
      const { method, originalUrl, ip } = request;
      const { statusCode } = response;

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${JSON.stringify({ ip })} `,
      );
    });

    next();
  }
}
