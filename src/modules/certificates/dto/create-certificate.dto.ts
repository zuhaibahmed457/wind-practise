import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import * as dayjs from 'dayjs';
import {
  HasExtension,
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';

export class CreateCertificateDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  issuing_authority?: string;

  @IsDateString()
  @Transform(({ value }) => dayjs(value).toISOString())
  @IsNotEmpty()
  issuing_date: Date;

  @IsDateString()
  @Transform(({ value }) => dayjs(value).toISOString())
  @IsNotEmpty()
  expiration_date: Date;

  @IsDateString()
  @Transform(({ value }) => dayjs(value).toISOString())
  @IsNotEmpty()
  notification_date: Date;

  @IsUUID()
  @IsNotEmpty()
  profile_details_id: string;

  @HasExtension(['pdf'])
  @HasMimeType(['application/pdf'])
  @IsFile({ message: 'Certificate must be a pdf' })
  @MaxFileSize(5e6)
  @IsNotEmpty({ message: 'certificate should not be empty' })
  certificate_pdf: MemoryStoredFile;
}
