import { GetAllDto } from 'src/shared/dtos/getAll.dto';
import { DesignationStatus } from '../entities/designation.entity';
import { IsEnum, IsOptional } from 'class-validator';

export class GetAllDesignationDto extends GetAllDto {
  @IsEnum(DesignationStatus)
  @IsOptional()
  status: DesignationStatus;
}
