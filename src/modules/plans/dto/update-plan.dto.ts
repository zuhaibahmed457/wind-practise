import { CreatePlanDto } from './create-plan.dto';

// ** NEVER USE PARTIAL HERE, ELSE MANUALLY HANDLE VALIDATION
export class UpdatePlanDto extends CreatePlanDto {}
