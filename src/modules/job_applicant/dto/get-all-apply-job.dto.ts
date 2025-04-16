import {
  IsDateString,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
} from 'class-validator';
import { JobApplicantStatus } from '../entities/job_applicant.entity';
import { GetAllDto } from 'src/shared/dtos/getAll.dto';
import * as dayjs from 'dayjs';
import { Transform } from 'class-transformer';

export class GetAllApplyJobDto extends GetAllDto {
  @IsEnum(JobApplicantStatus)
  @IsOptional()
  status: JobApplicantStatus;

  @IsIn(['ASC', 'DESC'])
  @IsString()
  @IsOptional()
  order?: 'ASC' | 'DESC';

  @IsDateString()
  @Transform(({ value }) => dayjs(value).toISOString())
  @IsOptional()
  date_from?: string;

  @IsDateString()
  @Transform(({ value }) => dayjs(value).toISOString())
  @IsOptional()
  date_to?: string;
}
