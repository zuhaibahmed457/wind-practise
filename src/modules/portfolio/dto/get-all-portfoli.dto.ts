import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
} from 'class-validator';
import { GetAllDto } from 'src/shared/dtos/getAll.dto';

export class GetALLPortfolioDto extends GetAllDto {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  project_duration: number;

  @IsUUID('all', { message: 'Invalid id' })
  @IsOptional()
  profile_details_id: string;

  @Transform(({ value }) => value.toLowerCase())
  @IsEmail({}, { message: 'invalid email format' })
  @IsOptional()
  email: string;
}
