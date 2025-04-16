import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { GetAllDto } from 'src/shared/dtos/getAll.dto';
import { UserRole, UserStatus } from '../entities/user.entity';
import { Transform } from 'class-transformer';
import * as dayjs from 'dayjs';

export class GetAllUserDto extends GetAllDto {
  @IsEnum([UserRole.ORGANIZATION, UserRole.TECHNICIAN, UserRole.ADMIN], {
    message: `the role must be ${UserRole.ADMIN}, ${UserRole.TECHNICIAN} OR ${UserRole.ORGANIZATION}`,
  })
  @IsOptional()
  role: UserRole;

  @IsEnum(UserStatus)
  @IsOptional()
  status: UserStatus;

  @IsDateString()
  @Transform(({ value }) => dayjs(value).toISOString())
  @IsOptional()
  date_from: Date;

  @IsDateString()
  @Transform(({ value }) => dayjs(value).toISOString())
  @IsOptional()
  date_to: Date;
}
