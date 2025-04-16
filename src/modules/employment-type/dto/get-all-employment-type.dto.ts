import { IsEnum, IsOptional } from 'class-validator';
import { EmploymentTypeStatus } from '../entities/employment-type.entity';
import { GetAllDto } from 'src/shared/dtos/getAll.dto';

export class GetAllEmploymentTypeDto extends GetAllDto {
  @IsEnum(EmploymentTypeStatus)
  @IsOptional()
  status?: EmploymentTypeStatus;
}