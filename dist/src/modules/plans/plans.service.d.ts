import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { Plan } from './entities/plan.entity';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { GetAllPlansDto } from './dto/get-all-plans.dto';
import { User } from '../users/entities/user.entity';
export declare class PlansService {
    private readonly planRepository;
    private readonly stripe;
    constructor(planRepository: Repository<Plan>, stripe: Stripe);
    create(createPlanDto: CreatePlanDto): Promise<Plan>;
    findAll(currentUser: User, getAllPlansDto: GetAllPlansDto): Promise<import("nestjs-typeorm-paginate").Pagination<Plan, import("nestjs-typeorm-paginate").IPaginationMeta>>;
    findOne(id: number): string;
    update({ id }: ParamIdDto, updatePlanDto: UpdatePlanDto): Promise<Plan>;
    toggleStatus({ id }: ParamIdDto): Promise<{
        message: string;
        details: Plan;
    }>;
}
