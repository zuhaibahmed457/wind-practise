import { MemoryStoredFile } from 'nestjs-form-data';
export declare class CreateCertificateDto {
    name: string;
    issuing_authority?: string;
    issuing_date: Date;
    expiration_date: Date;
    notification_date: Date;
    profile_details_id: string;
    certificate_pdf: MemoryStoredFile;
}
