import { PlanType, PlanFor } from '../entities/plan.entity';
export declare class CreatePlanDto {
    name: string;
    description?: string;
    type: PlanType;
    for: PlanFor;
    features: string[];
    free_duration?: number;
    price?: number;
    number_of_employees_allowed: number;
}
