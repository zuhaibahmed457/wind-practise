import { Designation } from 'src/modules/designation/entities/designation.entity';
import { EmploymentType } from 'src/modules/employment-type/entities/employment-type.entity';
import { JobApplicant } from 'src/modules/job_applicant/entities/job_applicant.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { BaseEntity } from 'typeorm';
export declare enum JobStatus {
    ACITVE = "active",
    INACTIVE = "inactive"
}
export declare class JobPost extends BaseEntity {
    id: string;
    title: string;
    address: string;
    city: string;
    country: string;
    min_salary: number;
    max_salary: number;
    min_experience: number;
    max_experience: number;
    qualification: string[];
    description: string;
    status: JobStatus;
    is_archive: boolean;
    applicant_count: number;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
    user: User;
    job_type: EmploymentType[];
    designation_type: Designation[];
    job_applicants: JobApplicant[];
}
