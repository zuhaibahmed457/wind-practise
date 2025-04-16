import { PlansService } from './plans.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { User } from '../users/entities/user.entity';
import { GetAllPlansDto } from './dto/get-all-plans.dto';
export declare class PlansController {
    private readonly plansService;
    constructor(plansService: PlansService);
    create(createPlanDto: CreatePlanDto): Promise<IResponse>;
    findAll(currentUser: User, getAllPlansDto: GetAllPlansDto): Promise<IResponse>;
    findOne(id: string): string;
    update(paramIdDto: ParamIdDto, updatePlanDto: UpdatePlanDto): Promise<IResponse>;
    toggleStatus(paramIdDto: ParamIdDto): Promise<{
        message: string;
        details: import("./entities/plan.entity").Plan;
    }>;
}
