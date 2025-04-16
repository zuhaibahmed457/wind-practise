import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response, NextFunction } from 'express';
import { RequestResponseTime } from '../entities/request-response-time.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(RequestResponseTime)
    private readonly requestResponseTimeRepository: Repository<RequestResponseTime>,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const request = `[${new Date().toISOString()}] Incoming Request: ${req.method} ${req.url}`;
    console.log('🚀 ~ LoggerMiddleware ~ ~ request:', request);

    res.on('finish', async () => {
      const responseTime = Date.now();
      const duration = responseTime - start;

      const response = `[${new Date().toISOString()}] Request Completed: ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`;
      console.log('🚀 ~ LoggerMiddleware ~ ~ response:', response);

      const requestResponseTime = this.requestResponseTimeRepository.create({
        request_time: new Date(start),
        response_time: new Date(responseTime),
        duration: duration,
        request: request,
        response: response,
      });

      await requestResponseTime.save();
    });

    next();
  }
}
