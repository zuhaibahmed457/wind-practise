import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RequestResponseTime } from '../entities/request-response-time.entity';
import { Repository } from 'typeorm';
export declare class LoggerMiddleware implements NestMiddleware {
    private readonly requestResponseTimeRepository;
    constructor(requestResponseTimeRepository: Repository<RequestResponseTime>);
    use(req: Request, res: Response, next: NextFunction): void;
}
