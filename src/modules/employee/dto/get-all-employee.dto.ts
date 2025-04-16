import { Transform } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
} from 'class-validator';
import { UserStatus } from 'src/modules/users/entities/user.entity';
import { GetAllDto } from 'src/shared/dtos/getAll.dto';
import * as dayjs from 'dayjs';

export class GetAllEmployeeDto extends GetAllDto {
  @IsEnum(UserStatus)
  @IsOptional()
  status: UserStatus;

  @IsIn(['ASC', 'DESC'])
  @IsString()
  @IsOptional()
  order?: 'ASC' | 'DESC';

  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true, message: 'invalid id' })
  @IsOptional()
  designation_id: string[];

  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true, message: 'invalid id' })
  @IsOptional()
  employment_type_id: string[];

  @IsDateString()
  @Transform(({ value }) => dayjs(value).toISOString())
  @IsOptional()
  join_date_from: Date;

  @IsDateString()
  @Transform(({ value }) => dayjs(value).toISOString())
  @IsOptional()
  join_date_to: Date;

  @Transform(({ value }) =>
    `${value?.slice(0, 1)?.toUpperCase()}${value?.slice(1)?.toLowerCase()}`.trim(),
  )
  @Matches(/^[^!@#$%^&*(),.?":{}|<>]*$/, {
    message: 'country should not contain special characters!',
  })
  @IsString()
  @IsOptional()
  country: string;

  @IsString()
  @IsOptional()
  city: string;
}
