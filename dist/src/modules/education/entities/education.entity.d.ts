import { DegreeType } from 'src/modules/degree-type/entities/degree-type.entity';
import { ProfileDetails } from 'src/modules/profile-details/entities/profile-details.entity';
import { BaseEntity } from 'typeorm';
export declare class Education extends BaseEntity {
    id: string;
    school: string;
    field: string;
    start_date: Date;
    end_date: Date;
    grade: string;
    description: string;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
    profile_details: ProfileDetails;
    degree_type: DegreeType[];
}
