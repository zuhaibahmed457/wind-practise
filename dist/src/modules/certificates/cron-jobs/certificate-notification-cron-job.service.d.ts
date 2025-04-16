import { Repository } from 'typeorm';
import { Certificate } from '../entities/certificate.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
export declare class CertificateCronService {
    private readonly certificateRepository;
    private readonly eventEmitter;
    private readonly configService;
    private readonly logger;
    constructor(certificateRepository: Repository<Certificate>, eventEmitter: EventEmitter2, configService: ConfigService);
    scheduleCertificateProcessing(): Promise<void>;
}
