import { IsEnum, IsNotEmpty } from 'class-validator';
import { DesignationStatus } from '../entities/designation.entity';

export class DesignationManageStatusDto {
  @IsEnum(DesignationStatus)
  @IsNotEmpty()
  status: DesignationStatus;
}
