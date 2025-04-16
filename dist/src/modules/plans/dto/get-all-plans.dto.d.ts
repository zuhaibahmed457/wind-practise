import { GetAllDto } from 'src/shared/dtos/getAll.dto';
import { PlanFor, PlanStatus, PlanType } from '../entities/plan.entity';
export declare class GetAllPlansDto extends GetAllDto {
    status: PlanStatus;
    types: PlanType[];
    plan_for: PlanFor[];
}
