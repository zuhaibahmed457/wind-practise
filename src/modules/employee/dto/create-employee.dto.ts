import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  Validate,
} from 'class-validator';

import * as dayjs from 'dayjs';
import { IsUrlOrEmpty } from 'src/utils/validate-url-format';

export class CreateEmployeeDto {
  @Transform(({ value }) =>
    `${value?.slice(0, 1)?.toUpperCase()}${value?.slice(1)?.toLowerCase()}`.trim(),
  )
  @Matches(/^[^!@#$%^&*(),.?":{}|<>]*$/, {
    message: 'first_name should not contain special characters!',
  })
  @Length(3, 80, {
    message: 'first_name must be 3 to 80 characters long',
  })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @Transform(({ value }) =>
    `${value?.slice(0, 1)?.toUpperCase()}${value?.slice(1)?.toLowerCase()}`.trim(),
  )
  @Matches(/^[^!@#$%^&*(),.?":{}|<>]*$/, {
    message: 'last_name should not contain special characters!',
  })
  @Length(3, 80, {
    message: 'last_name must be 3 to 80 characters long',
  })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @Transform(({ value }) => value.toLowerCase())
  @IsEmail({}, { message: 'invalid email format' })
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  phone_no: string;

  @Transform(({ value }) =>
    `${value?.slice(0, 1)?.toUpperCase()}${value?.slice(1)?.toLowerCase()}`.trim(),
  )
  @Matches(/^[^!@#$%^&*(),.?":{}|<>]*$/, {
    message: 'country should not contain special characters!',
  })
  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  tagline?: string;

  @IsString()
  @IsOptional()
  about?: string;

  @IsDateString()
  @Transform(({ value }) => dayjs(value).toISOString())
  @IsOptional()
  join_date?: Date;

  @Transform(({ value }) => value ?? '')
  @Validate(IsUrlOrEmpty)
  @IsOptional()
  linkedin_url?: string;

  @Transform(({ value }) => value ?? '')
  @Validate(IsUrlOrEmpty)
  @IsOptional()
  facebook_url?: string;

  @Transform(({ value }) => value ?? '')
  @Validate(IsUrlOrEmpty)
  @IsOptional()
  twitter_url?: string;

  @Transform(({ value }) => value ?? '')
  @Validate(IsUrlOrEmpty)
  @IsOptional()
  website_url?: string;

  @IsUUID('all', { message: 'Invalid id' })
  @IsNotEmpty()
  designation_id?: string;

  @IsUUID('all', { message: 'Invalid id' })
  @IsNotEmpty()
  employment_type_id?: string;

  @IsUUID('all', { message: 'Invalid id' })
  @IsOptional()
  organization_id?: string;
}
