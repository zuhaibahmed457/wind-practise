import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AccessRequest } from 'src/modules/access-request/entities/access-request.entity';
import { Certificate } from 'src/modules/certificates/entities/certificate.entity';
import { Portfolio } from 'src/modules/portfolio/entities/portfolio.entity';
export declare class AccessRequestGuard implements CanActivate {
    private accessRequestRepo;
    private readonly portfolioRepo;
    private readonly certificateRepo;
    constructor(accessRequestRepo: Repository<AccessRequest>, portfolioRepo: Repository<Portfolio>, certificateRepo: Repository<Certificate>);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
