import { GetAllDto } from 'src/shared/dtos/getAll.dto';
import { JobStatus } from '../entities/job-post.entity';
export declare class GetAllJobPostDto extends GetAllDto {
    min_experience: number;
    max_experience: number;
    status: JobStatus;
    is_archive: boolean;
    order?: 'ASC' | 'DESC';
    date_from?: string;
    date_to?: string;
    job_type_id: string[];
    designation_id: string[];
    exclude_applied_jobs: boolean;
}
