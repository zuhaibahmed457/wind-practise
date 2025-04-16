import { PlanFor, PlanType } from 'src/modules/plans/entities/plan.entity';
import { GetAllDto } from 'src/shared/dtos/getAll.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class GetUsersSubscriptionsDto extends GetAllDto {
  @IsEnum(PlanType)
  @IsOptional()
  type?: PlanType;

  @IsEnum(PlanFor)
  @IsOptional()
  for?: PlanFor;

  @IsString()
  @IsOptional()
  plan_id?: string;
}
