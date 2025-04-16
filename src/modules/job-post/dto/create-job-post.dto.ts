import { Transform } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsUUID,
  IsNumber,
  IsNotEmpty,
  IsPositive,
  IsArray,
} from 'class-validator';
import { capitalize } from 'src/utils/capatilize-each-word';

export class CreateJobPostDto {
  @Transform(capitalize)
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsNumber()
  @IsPositive({ message: 'salary should be positive' })
  @IsOptional()
  min_salary?: number;

  @IsNumber()
  @IsPositive({ message: 'salary should be positive' })
  @IsOptional()
  max_salary?: number;

  @IsNumber()
  @IsPositive({ message: 'number should be positive' })
  @IsOptional()
  min_experience?: number;

  @IsNumber()
  @IsPositive({ message: 'number should be positive' })
  @IsOptional()
  max_experience?: number;

  @IsArray()
  @IsString({each: true})
  @IsOptional()
  qualification: string[];

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsUUID('all', { each: true })
  @IsNotEmpty()
  job_type_id: string[];

  @IsArray()
  @IsUUID('all', { each: true })
  @IsNotEmpty()
  designation_id: string[];
}
