import { IsEnum, IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { PlanFor } from 'src/modules/plans/entities/plan.entity';

export class CreateCustomerPortalDto {
  @IsUrl()
  @IsString()
  @IsNotEmpty()
  return_url: string;

  @IsEnum(PlanFor)
  plan_for: PlanFor;
}
