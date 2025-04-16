import { PlanFor, PlanType } from 'src/modules/plans/entities/plan.entity';
import { GetAllDto } from 'src/shared/dtos/getAll.dto';
export declare class GetUsersSubscriptionsDto extends GetAllDto {
    type?: PlanType;
    for?: PlanFor;
    plan_id?: string;
}
