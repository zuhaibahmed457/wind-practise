import { ProfileDetails } from 'src/modules/profile-details/entities/profile-details.entity';
import { BaseEntity } from 'typeorm';
export declare class Skill extends BaseEntity {
    id: string;
    name: string;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
    profile_details: ProfileDetails;
}
