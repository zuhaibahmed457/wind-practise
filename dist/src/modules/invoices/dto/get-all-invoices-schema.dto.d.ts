import { UserRole } from 'src/modules/users/entities/user.entity';
import { GetAllDto } from 'src/shared/dtos/getAll.dto';
import { PlanType } from 'src/modules/plans/entities/plan.entity';
export declare class GetAllInvoiceDto extends GetAllDto {
    subscription_id: string;
    user_id: string;
    plan_type: PlanType;
    role: UserRole;
    order?: 'ASC' | 'DESC';
    date_from?: string;
    date_to?: string;
}
