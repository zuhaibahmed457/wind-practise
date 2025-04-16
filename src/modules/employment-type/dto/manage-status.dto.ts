import { IsEnum, IsNotEmpty } from 'class-validator';
import { EmploymentTypeStatus } from '../entities/employment-type.entity';

export class EmploymentTypeManageStatusDto {
  @IsEnum(EmploymentTypeStatus)
  @IsNotEmpty()
  status: EmploymentTypeStatus;
}
