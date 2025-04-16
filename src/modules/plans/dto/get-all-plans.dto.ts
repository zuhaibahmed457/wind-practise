import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { GetAllDto } from 'src/shared/dtos/getAll.dto';
import { PlanFor, PlanStatus, PlanType } from '../entities/plan.entity';

export class GetAllPlansDto extends GetAllDto {
  @IsEnum(PlanStatus)
  @IsOptional()
  status: PlanStatus;

  @IsArray()
  @IsEnum(PlanType, { each: true })
  @IsOptional()
  types: PlanType[];

  @IsArray()
  @IsEnum(PlanFor, { each: true })
  @IsOptional()
  plan_for: PlanFor[];
}
