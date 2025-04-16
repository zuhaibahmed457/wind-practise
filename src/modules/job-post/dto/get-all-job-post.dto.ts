import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { GetAllDto } from 'src/shared/dtos/getAll.dto';
import { JobStatus } from '../entities/job-post.entity';
import { ToBoolean } from 'src/utils/to-boolean';
import * as dayjs from 'dayjs';
import { Transform } from 'class-transformer';

export class GetAllJobPostDto extends GetAllDto {
  @IsNumber()
  @IsPositive({ message: 'number should be positive' })
  @IsOptional()
  min_experience: number;

  @IsNumber()
  @IsPositive({ message: 'number should be positive' })
  @IsOptional()
  max_experience: number;

  @IsEnum(JobStatus)
  @IsOptional()
  status: JobStatus;

  @ToBoolean()
  @IsOptional()
  is_archive: boolean;

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

  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  job_type_id: string[];

  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  designation_id: string[];

  @ToBoolean()
  @IsBoolean()
  @IsOptional()
  exclude_applied_jobs: boolean;
}
