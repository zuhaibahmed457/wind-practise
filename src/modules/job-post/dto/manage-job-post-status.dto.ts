import { IsEnum, IsNotEmpty } from 'class-validator';
import { JobStatus } from '../entities/job-post.entity';

export class ManageJobPostStatusDto {
  @IsEnum(JobStatus)
  @IsNotEmpty()
  status: JobStatus;
}
