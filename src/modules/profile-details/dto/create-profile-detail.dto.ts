import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsString,
  Length,
  Matches,
  Validate,
} from 'class-validator';
import { SignUpDto } from 'src/modules/auth/dto/sign-up.dto';
import { IsUrlOrEmpty } from 'src/utils/validate-url-format';

export class CreateProfileDetailDto extends PartialType(SignUpDto) {
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

  @Transform(({ value }) =>
    `${value?.slice(0, 1)?.toUpperCase()}${value?.slice(1)?.toLowerCase()}`.trim(),
  )
  @Matches(/^[^!@#$%^&*(),.?":{}|<>]*$/, {
    message: 'city should not contain special characters!',
  })
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
}
