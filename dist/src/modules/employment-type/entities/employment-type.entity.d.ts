import { ProfileDetails } from 'src/modules/profile-details/entities/profile-details.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { BaseEntity } from 'typeorm';
export declare enum EmploymentTypeStatus {
    ACTIVE = "active",
    INACTIVE = "inactive"
}
export declare class EmploymentType extends BaseEntity {
    id: string;
    name: string;
    description: string;
    status: EmploymentTypeStatus;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
    created_by: User;
    profile_details: ProfileDetails[];
}
