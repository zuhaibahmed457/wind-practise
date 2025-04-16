import { GetAllDto } from 'src/shared/dtos/getAll.dto';
export declare enum CertificateStatus {
    VALID = "valid",
    EXPIRED = "expired",
    EXPIRING_SOON = "expiring_soon"
}
export declare class GetAllCertificatesDto extends GetAllDto {
    profile_details_id?: string;
    status?: CertificateStatus;
    sort?: string;
    order?: 'asc' | 'desc';
    issue_date_from?: string;
    issue_date_to?: string;
    expiration_date_from?: string;
    expiration_date_to?: string;
    email: string;
}
