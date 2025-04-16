import { GetAllDto } from 'src/shared/dtos/getAll.dto';
import { JobApplicantStatus } from '../entities/job_applicant.entity';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class GetAllApplicantsDto extends GetAllDto {
  @IsEnum(JobApplicantStatus)
  @IsOptional()
  status: JobApplicantStatus;

  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  job_type_id: string[];

  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  designation_id: string[];
}
