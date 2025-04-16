import { JobApplicantStatus } from '../entities/job_applicant.entity';
import { GetAllDto } from 'src/shared/dtos/getAll.dto';
export declare class GetAllApplyJobDto extends GetAllDto {
    status: JobApplicantStatus;
    order?: 'ASC' | 'DESC';
    date_from?: string;
    date_to?: string;
}
