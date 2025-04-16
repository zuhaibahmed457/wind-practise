import { User } from 'src/modules/users/entities/user.entity';
import { BaseEntity } from 'typeorm';
import { Certificate } from './certificate.entity';
export declare class CertificateHistory extends BaseEntity {
    id: string;
    name: string;
    issuing_authority: string;
    issuing_date: Date;
    expiration_date: Date;
    notification_date: Date;
    certificate_url: string;
    modified_at: Date;
    modified_by: User;
    certificate: Certificate;
}
