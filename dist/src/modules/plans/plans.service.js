"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlansService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const plan_entity_1 = require("./entities/plan.entity");
const typeorm_2 = require("typeorm");
const validation_exception_formatter_1 = require("../../utils/validation-exception-formatter");
const stripe_1 = require("stripe");
const nestjs_typeorm_paginate_1 = require("nestjs-typeorm-paginate");
let PlansService = class PlansService {
    constructor(planRepository, stripe) {
        this.planRepository = planRepository;
        this.stripe = stripe;
    }
    async create(createPlanDto) {
        const existingPlan = await this.planRepository.findOne({
            where: [
                {
                    name: createPlanDto.name,
                    for: createPlanDto.for,
                },
                {
                    type: createPlanDto.type,
                    for: createPlanDto.for,
                },
            ],
        });
        if (existingPlan && existingPlan.name === createPlanDto.name) {
            throw new validation_exception_formatter_1.ValidationException({
                name: 'Plan with this name already exists',
            });
        }
        const plan = this.planRepository.create(createPlanDto);
        if (plan.type !== plan_entity_1.PlanType.FREE) {
            const stripePlan = await this.stripe.products.create({
                name: createPlanDto.name,
                description: createPlanDto.description,
            });
            const interval = {
                [plan_entity_1.PlanType.MONTHLY]: 'month',
                [plan_entity_1.PlanType.YEARLY]: 'year',
            };
            const stripePrice = await this.stripe.prices.create({
                product: stripePlan.id,
                unit_amount: Math.round(createPlanDto.price * 100),
                currency: 'EUR',
                recurring: {
                    interval: interval[createPlanDto.type],
                    interval_count: 1,
                },
            });
            plan.stripe_product_id = stripePlan.id;
            plan.stripe_price_id = stripePrice.id;
        }
        return plan.save();
    }
    async findAll(currentUser, getAllPlansDto) {
        const { plan_for, status, types, page, per_page, search } = getAllPlansDto;
        const plansQuery = this.planRepository
            .createQueryBuilder('plan')
            .orderBy('plan.type', 'ASC')
            .addOrderBy('plan.created_at', 'DESC');
        if (search) {
            plansQuery.andWhere('plan.name ILIKE :search', { search: `%${search}%` });
        }
        if (plan_for) {
            plansQuery.andWhere('plan.for IN (:...plan_for)', { plan_for });
        }
        if (types) {
            plansQuery.andWhere('plan.type IN (:...types)', { types });
        }
        if (status) {
            plansQuery.andWhere('plan.status = :status', { status });
        }
        const paginationOptions = {
            page,
            limit: per_page,
        };
        return await (0, nestjs_typeorm_paginate_1.paginate)(plansQuery, paginationOptions);
    }
    findOne(id) {
        return `This action returns a #${id} plan`;
    }
    async update({ id }, updatePlanDto) {
        const existingPlan = await this.planRepository.findOne({
            where: { id, for: updatePlanDto.for, type: updatePlanDto.type },
        });
        if (!existingPlan) {
            throw new common_1.NotFoundException('Plan not found');
        }
        const planWithSameNameOrType = await this.planRepository.findOne({
            where: [
                {
                    id: (0, typeorm_2.Not)(id),
                    name: updatePlanDto.name,
                    for: updatePlanDto.for,
                },
                {
                    id: (0, typeorm_2.Not)(id),
                    type: updatePlanDto.type,
                    for: updatePlanDto.for,
                },
            ],
        });
        if (planWithSameNameOrType &&
            planWithSameNameOrType.name === updatePlanDto.name) {
            throw new validation_exception_formatter_1.ValidationException({
                name: 'Plan with this name already exists',
            });
        }
        if (existingPlan.type !== plan_entity_1.PlanType.FREE &&
            Number(existingPlan.price) !== updatePlanDto.price) {
            await this.stripe.prices.update(existingPlan.stripe_price_id, {
                active: false,
            });
            const interval = {
                [plan_entity_1.PlanType.MONTHLY]: 'month',
                [plan_entity_1.PlanType.YEARLY]: 'year',
            };
            const stripePrice = await this.stripe.prices.create({
                product: existingPlan.stripe_product_id,
                unit_amount: Math.round(updatePlanDto.price * 100),
                currency: 'USD',
                recurring: {
                    interval: interval[updatePlanDto.type],
                    interval_count: 1,
                },
            });
            existingPlan.stripe_price_id = stripePrice.id;
        }
        if (existingPlan.type !== plan_entity_1.PlanType.FREE &&
            (existingPlan.name !== updatePlanDto.name ||
                existingPlan.description !== updatePlanDto.description)) {
            await this.stripe.products.update(existingPlan.stripe_product_id, {
                name: updatePlanDto.name,
                description: updatePlanDto.description,
            });
        }
        Object.assign(existingPlan, updatePlanDto);
        return existingPlan.save();
    }
    async toggleStatus({ id }) {
        const plan = await this.planRepository.findOne({
            where: { id },
        });
        if (!plan) {
            throw new common_1.NotFoundException(`Subscription plan with ID ${id} not found`);
        }
        plan.status =
            plan.status === plan_entity_1.PlanStatus.ACTIVE
                ? plan_entity_1.PlanStatus.INACTIVE
                : plan_entity_1.PlanStatus.ACTIVE;
        await this.planRepository.save(plan);
        if (plan.type !== plan_entity_1.PlanType.FREE) {
            await this.stripe.prices.update(plan.stripe_price_id, {
                active: plan.status === plan_entity_1.PlanStatus.ACTIVE ? true : false,
            });
            await this.stripe.products.update(plan.stripe_product_id, {
                active: plan.status === plan_entity_1.PlanStatus.ACTIVE ? true : false,
            });
        }
        return {
            message: `Plan status updated to ${plan.status}`,
            details: plan,
        };
    }
};
exports.PlansService = PlansService;
exports.PlansService = PlansService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(plan_entity_1.Plan)),
    __param(1, (0, common_1.Inject)('STRIPE_CLIENT')),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        stripe_1.default])
], PlansService);
//# sourceMappingURL=plans.service.js.map