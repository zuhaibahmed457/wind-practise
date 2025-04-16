import { ProfileDetails } from 'src/modules/profile-details/entities/profile-details.entity';
import { BaseEntity } from 'typeorm';
export declare enum RequestStatus {
    PENDING = "pending",
    APPROVED = "approved",
    DENIED = "denied"
}
export declare enum RequestType {
    PORTFOLIO = "portfolio",
    CERTIFICATE = "certificate"
}
export declare enum RequestPurpose {
    AUTO_ACCESS = "Auto access granted",
    USER_REQUESTED = "User requested access"
}
export declare class AccessRequest extends BaseEntity {
    id: string;
    requested_from: string;
    request_type: RequestType[];
    status: RequestStatus;
    purpose: RequestPurpose;
    created_at: Date;
    deleted_at: Date;
    requested_by: ProfileDetails;
}
