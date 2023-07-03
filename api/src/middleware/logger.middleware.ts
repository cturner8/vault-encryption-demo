import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);

  use(request: Request, _response: Response, next: NextFunction) {
    this.logger.log(`Request: ${request.method}, ${request.path}`);
    next();
  }
}
