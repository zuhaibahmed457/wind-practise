import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Length,
  IsNotEmpty,
  IsDateString,
} from 'class-validator';

import * as dayjs from 'dayjs';

export class CreateEducationDto {
  @Transform(({ value }) =>
    `${value?.slice(0, 1)?.toUpperCase()}${value?.slice(1)?.toLowerCase()}`.trim(),
  )
  @Matches(/^[^!@#$%^&*(),.?":{}|<>]*$/, {
    message: 'school name should not contain special characters!',
  })
  @Length(3, 50, {
    message: 'school name must be 3 to 50 characters long',
  })
  @IsString()
  @IsNotEmpty()
  school?: string;

  @IsString()
  @IsOptional()
  field?: string;

  @IsDateString()
  @Transform(({ value }) => dayjs(value).toISOString())
  @IsOptional()
  start_date?: Date;

  @IsDateString()
  @Transform(({ value }) => dayjs(value).toISOString())
  @IsOptional()
  end_date?: Date;

  @IsString()
  @IsOptional()
  grade?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID('all', { message: 'Invalid id' })
  @IsOptional()
  degree_type_id?: string;
}
