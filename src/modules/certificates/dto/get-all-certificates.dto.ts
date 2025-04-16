import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsUUID,
  IsIn,
  IsEnum,
  IsDateString,
  IsEmail,
} from 'class-validator';
import { GetAllDto } from 'src/shared/dtos/getAll.dto';
import * as dayjs from 'dayjs';

export enum CertificateStatus {
  VALID = 'valid',
  EXPIRED = 'expired',
  EXPIRING_SOON = 'expiring_soon',
}

export class GetAllCertificatesDto extends GetAllDto {
  @IsUUID('all', { message: 'Invalid id' })
  @IsOptional()
  profile_details_id?: string;

  @IsEnum(CertificateStatus)
  @IsOptional()
  status?: CertificateStatus;

  @IsIn(['name', 'expiration_date', 'issuing_date', 'created_at'])
  @IsString()
  @IsOptional()
  sort?: string;

  @IsIn(['asc', 'desc'])
  @IsString()
  @IsOptional()
  order?: 'asc' | 'desc';

  @IsDateString()
  @Transform(({ value }) => dayjs(value).toISOString())
  @IsOptional()
  issue_date_from?: string;

  @IsDateString()
  @Transform(({ value }) => dayjs(value).toISOString())
  @IsOptional()
  issue_date_to?: string;

  @IsDateString()
  @Transform(({ value }) => dayjs(value).toISOString())
  @IsOptional()
  expiration_date_from?: string;

  @IsDateString()
  @Transform(({ value }) => dayjs(value).toISOString())
  @IsOptional()
  expiration_date_to?: string;

  @Transform(({ value }) => value.toLowerCase())
  @IsEmail({}, { message: 'invalid email format' })
  @IsOptional()
  email: string;
}
