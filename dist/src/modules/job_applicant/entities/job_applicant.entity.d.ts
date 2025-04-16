import { JobPost } from 'src/modules/job-post/entities/job-post.entity';
import { ProfileDetails } from 'src/modules/profile-details/entities/profile-details.entity';
import { BaseEntity } from 'typeorm';
export declare enum JobApplicantStatus {
    APPLIED = "applied",
    VIEWED = "viewed",
    ACCEPT = "accept",
    REJECT = "reject"
}
export declare class JobApplicant extends BaseEntity {
    id: string;
    status: JobApplicantStatus;
    applied_at: Date;
    job_post: JobPost;
    profile_detail: ProfileDetails;
    feedback: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
