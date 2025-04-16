import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PlanType } from 'src/modules/plans/entities/plan.entity';

export class SubscriptionStatsDto {
  @IsEnum(PlanType)
  plan_type: PlanType;

  @IsOptional()
  @IsString()
  year: string;
}
