import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { EmploymentTypeStatus } from '../entities/employment-type.entity';
import { Transform } from 'class-transformer';

export class CreateEmploymentTypeDto {
  @Transform(({ value }) =>
    `${value?.slice(0, 1)?.toUpperCase()}${value?.slice(1)?.toLowerCase()}`.trim(),
  )
  @Matches(/^[^!@#$%^&*(),.?":{}|<>]*$/, {
    message: 'name should not contain special characters!',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
