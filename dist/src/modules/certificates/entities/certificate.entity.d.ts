import { ProfileDetails } from 'src/modules/profile-details/entities/profile-details.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { BaseEntity } from 'typeorm';
export declare class Certificate extends BaseEntity {
    id: string;
    name: string;
    issuing_authority: string;
    issuing_date: Date;
    expiration_date: Date;
    notification_date: Date;
    last_notified_at: Date;
    certificate_url: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
    profile_details: ProfileDetails;
    created_by: User;
}
