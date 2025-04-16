import { GetAllDto } from 'src/shared/dtos/getAll.dto';
import { JobApplicantStatus } from '../entities/job_applicant.entity';
export declare class GetAllApplicantsDto extends GetAllDto {
    status: JobApplicantStatus;
    job_type_id: string[];
    designation_id: string[];
}
