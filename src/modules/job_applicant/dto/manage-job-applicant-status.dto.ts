import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { JobApplicantStatus } from '../entities/job_applicant.entity';

export class ManageJobApplicantStatusDto {
  @IsEnum(JobApplicantStatus)
  @IsNotEmpty()
  status: JobApplicantStatus;

  @IsOptional()
  @IsString()
  feedback?: string;
}
