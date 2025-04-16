import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Plan, PlanStatus, PlanType } from './entities/plan.entity';
import { Not, Repository } from 'typeorm';
import { ValidationException } from 'src/utils/validation-exception-formatter';
import Stripe from 'stripe';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { GetAllPlansDto } from './dto/get-all-plans.dto';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,

    @Inject('STRIPE_CLIENT') private readonly stripe: Stripe,
  ) {}

  async create(createPlanDto: CreatePlanDto) {
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
      throw new ValidationException({
        name: 'Plan with this name already exists',
      });
    }

    // ** IF WE NEED TO RESTRICT ON TYPE AS WELL
    // if (existingPlan && existingPlan.type === createPlanDto.type) {
    //   throw new ValidationException({
    //     type: 'Plan with this type already exists',
    //   });
    // }

    const plan = this.planRepository.create(createPlanDto);

    if (plan.type !== PlanType.FREE) {
      const stripePlan = await this.stripe.products.create({
        name: createPlanDto.name,
        description: createPlanDto.description,
      });

      const interval = {
        [PlanType.MONTHLY]: 'month',
        [PlanType.YEARLY]: 'year',
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

  async findAll(currentUser: User, getAllPlansDto: GetAllPlansDto) {
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

    const paginationOptions: IPaginationOptions = {
      page,
      limit: per_page,
    };

    return await paginate<Plan>(plansQuery, paginationOptions);
  }

  findOne(id: number) {
    return `This action returns a #${id} plan`;
  }

  async update({ id }: ParamIdDto, updatePlanDto: UpdatePlanDto) {
    const existingPlan = await this.planRepository.findOne({
      where: { id, for: updatePlanDto.for, type: updatePlanDto.type },
    });

    if (!existingPlan) {
      throw new NotFoundException('Plan not found');
    }

    const planWithSameNameOrType = await this.planRepository.findOne({
      where: [
        {
          id: Not(id),
          name: updatePlanDto.name,
          for: updatePlanDto.for,
        },
        {
          id: Not(id),
          type: updatePlanDto.type,
          for: updatePlanDto.for,
        },
      ],
    });

    if (
      planWithSameNameOrType &&
      planWithSameNameOrType.name === updatePlanDto.name
    ) {
      throw new ValidationException({
        name: 'Plan with this name already exists',
      });
    }

    // ** IF WE NEED TO RESTRICT ON TYPE AS WELL
    // if (
    //   planWithSameNameOrType &&
    //   planWithSameNameOrType.type === updatePlanDto.type
    // ) {
    //   throw new ValidationException({
    //     type: 'Plan with this type already exists',
    //   });
    // }

    if (
      existingPlan.type !== PlanType.FREE &&
      Number(existingPlan.price) !== updatePlanDto.price
    ) {
      // ** archive old price on stripe
      await this.stripe.prices.update(existingPlan.stripe_price_id, {
        active: false,
      });

      const interval = {
        [PlanType.MONTHLY]: 'month',
        [PlanType.YEARLY]: 'year',
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

    if (
      existingPlan.type !== PlanType.FREE &&
      (existingPlan.name !== updatePlanDto.name ||
        existingPlan.description !== updatePlanDto.description)
    ) {
      // ** Update product on stripe
      await this.stripe.products.update(existingPlan.stripe_product_id, {
        name: updatePlanDto.name,
        description: updatePlanDto.description,
      });
    }

    Object.assign(existingPlan, updatePlanDto);

    return existingPlan.save();
  }

  async toggleStatus({ id }: ParamIdDto) {
    const plan = await this.planRepository.findOne({
      where: { id },
    });

    if (!plan) {
      throw new NotFoundException(`Subscription plan with ID ${id} not found`);
    }

    plan.status =
      plan.status === PlanStatus.ACTIVE
        ? PlanStatus.INACTIVE
        : PlanStatus.ACTIVE;

    await this.planRepository.save(plan);

    if (plan.type !== PlanType.FREE) {
      await this.stripe.prices.update(plan.stripe_price_id, {
        active: plan.status === PlanStatus.ACTIVE ? true : false,
      });

      await this.stripe.products.update(plan.stripe_product_id, {
        active: plan.status === PlanStatus.ACTIVE ? true : false,
      });
    }

    return {
      message: `Plan status updated to ${plan.status}`,
      details: plan,
    };
  }
}
