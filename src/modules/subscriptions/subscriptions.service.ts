import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import {
  Plan,
  PlanFor,
  PlanStatus,
  PlanType,
} from '../plans/entities/plan.entity';
import { In, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import Stripe from 'stripe';
import {
  Subscription,
  SubscriptionStatus,
} from './entities/subscription.entity';
import { TransactionManagerService } from 'src/shared/services/transaction-manager.service';
import * as dayjs from 'dayjs';
import { CreateCustomerPortalDto } from './dto/create-customer-portal.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import {
  ManageSubscriptionDto,
  SubscriptionActions,
} from './dto/manage-subscription.dto';
import { GetUsersSubscriptionsDto } from './dto/get-users-subscription.dto';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionsRepository: Repository<Subscription>,

    @InjectRepository(Plan)
    private readonly plansRepository: Repository<Plan>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly transactionManagerService: TransactionManagerService,

    @Inject('STRIPE_CLIENT') private readonly stripe: Stripe,

    private readonly configService: ConfigService,
  ) {}

  async create(
    currentUser: User,
    createSubscriptionDto: CreateSubscriptionDto,
  ) {
    return this.transactionManagerService.executeInTransaction(
      async (queryRunner) => {
        if (
          currentUser.latest_subscription &&
          currentUser.latest_subscription.plan.type !== PlanType.FREE
        ) {
          throw new BadRequestException(
            'You already have subscription, please use manage subscription route',
          );
        }

        const plan = await queryRunner.manager.findOne(Plan, {
          where: {
            id: createSubscriptionDto.plan_id,
            status: PlanStatus.ACTIVE,
            for: currentUser.role as unknown as PlanFor,
          },
        });

        if (!plan) {
          throw new NotFoundException('Subscription plan does not exist');
        }

        if (plan.type === PlanType.FREE && currentUser.has_used_free_trial) {
          throw new BadRequestException('Free trial has already used');
        }

        // ** subscribing to free trial
        if (plan.type === PlanType.FREE) {
          const subscription = queryRunner.manager.create(Subscription, {
            status: SubscriptionStatus.ACTIVE,
            user: currentUser,
            plan: plan,
            start_date: dayjs().toDate(),
            end_date: dayjs().add(plan.free_duration, 'days').toDate(),
          });

          await queryRunner.manager.save(Subscription, subscription);

          currentUser.latest_subscription = subscription;
          currentUser.has_used_free_trial = true;
          currentUser.has_taken_subscription = true;
          await queryRunner.manager.save(User, currentUser);

          return {
            message: 'Free trial has been activated',
            details: subscription,
          };
        }

        // ** organization can only purchase plans which have higher or equal number of employees allowed than organization currently have
        if (currentUser.role === UserRole.ORGANIZATION) {
          const numberOfEmployee = await this.userRepository.count({
            where: {
              role: UserRole.EMPLOYEE,
              created_by: {
                id: currentUser.id,
              },
            },
          });

          if (numberOfEmployee > plan.number_of_employees_allowed) {
            throw new BadRequestException(
              `You have currently ${numberOfEmployee} employees, please take plan which correspond to your number of employees`,
            );
          }
        }

        if (!currentUser.stripe_customer_id) {
          const stripeCustomer = await this.stripe.customers.create({
            email: currentUser.email,
          });

          currentUser.stripe_customer_id = stripeCustomer.id;

          await currentUser.save();
        }

        const stripeSubscription = await this.stripe.subscriptions.create({
          customer: currentUser.stripe_customer_id,
          items: [
            {
              price: plan.stripe_price_id,
            },
          ],
          payment_behavior: 'default_incomplete',
          expand: ['latest_invoice.payment_intent'],
        });

        const invoice = stripeSubscription.latest_invoice as Stripe.Invoice;
        const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

        return {
          message: 'Please subscribe by providing credit card',
          details: {
            stripe_subscription_id: stripeSubscription.id,
            stripe_client_secret: paymentIntent.client_secret,
          },
        };
      },
    );
  }

  async createCustomerPortal(
    currentUser: User,
    createCustomerPortalDto: CreateCustomerPortalDto,
  ) {
    if (
      !currentUser.latest_subscription ||
      currentUser.latest_subscription.plan.type === PlanType.FREE
    ) {
      throw new BadRequestException('Please subscribe to paid plan first');
    }

    const numberOfEmployee = await this.userRepository.count({
      where: {
        role: UserRole.EMPLOYEE,
        created_by: {
          id: currentUser.id,
        },
      },
    });

    const plans = await this.plansRepository.find({
      where: {
        type: In([PlanType.MONTHLY, PlanType.YEARLY]),
        status: PlanStatus.ACTIVE,
        for: currentUser.role as unknown as PlanFor,
        ...(currentUser.role === UserRole.ORGANIZATION && {
          number_of_employees_allowed: MoreThanOrEqual(numberOfEmployee),
        }),
      },
    });

    const configuration = await this.stripe.billingPortal.configurations.create(
      {
        business_profile: {
          headline: 'WindTech Pro',
        },
        features: {
          subscription_update: {
            enabled: true,
            proration_behavior: 'always_invoice',
            default_allowed_updates: ['price'],
            products: plans.map((p) => ({
              product: p.stripe_product_id,
              prices: [p.stripe_price_id],
            })),
          },
          payment_method_update: {
            enabled: true,
          },
          subscription_cancel: {
            enabled: true,
          },
          invoice_history: {
            enabled: true,
          },
        },
      },
    );

    const portalSession = await this.stripe.billingPortal.sessions.create({
      customer: currentUser.stripe_customer_id,
      return_url: createCustomerPortalDto.return_url,
      configuration: configuration.id,
    });

    return portalSession.url;
  }

  async findAll(getUsersSubscriptionDto: GetUsersSubscriptionsDto) {
    const {
      search,
      page = 1,
      per_page = 10,
      type,
      for: plan_for,
      plan_id,
    } = getUsersSubscriptionDto;

    const query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.latest_subscription', 'latest_subscription')
      .leftJoinAndSelect('latest_subscription.plan', 'plan')
      .where(
        'user.role NOT IN (:...excludeRoles) AND user.deleted_at IS NULL',
        {
          excludeRoles: [
            UserRole.SUPER_ADMIN,
            UserRole.ADMIN,
            UserRole.EMPLOYEE,
          ],
        },
      )
      .orderBy('latest_subscription.updated_at', 'DESC');

    if (search) {
      query.andWhere(
        '(user.full_name ILIKE :search OR user.email ILIKE :search OR plan.name ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (type) {
      query.andWhere('plan.type = :type', { type });
    }

    if (plan_for) {
      query.andWhere('plan.for = :plan_for', { plan_for });
    }

    if (plan_id) {
      query.andWhere('plan.id = :plan_id', { plan_id });
    }

    const paginationOptions: IPaginationOptions = {
      page: page,
      limit: per_page,
    };

    return await paginate<User>(query, paginationOptions);
  }

  findOne(id: number) {
    return `This action returns a #${id} subscription`;
  }

  update(id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
    return `This action updates a #${id} subscription`;
  }

  remove(id: number) {
    return `This action removes a #${id} subscription`;
  }

  async manageSubscription(
    id: ParamIdDto,
    manageSubscriptionDto: ManageSubscriptionDto,
    currentUser: User,
  ) {
    const { action } = manageSubscriptionDto;

    const latestSubscription = currentUser.latest_subscription;

    if (!latestSubscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (latestSubscription.plan.type === PlanType.FREE) {
      throw new BadRequestException(`You can't ${action} trial subscription`);
    }

    if (latestSubscription.status !== SubscriptionStatus.ACTIVE) {
      throw new BadRequestException(`Subscription can not be ${action}`);
    }

    if (
      (latestSubscription.cancel_at_period_end &&
        action === SubscriptionActions.CANCEL) ||
      (!latestSubscription.cancel_at_period_end &&
        action === SubscriptionActions.RENEW)
    ) {
      throw new BadRequestException(`Subscription is already ${action}`);
    }

    if (action === SubscriptionActions.CANCEL) {
      await this.stripe.subscriptions.update(
        latestSubscription.stripe_subscription_id,
        {
          cancel_at_period_end: true,
        },
      );
      latestSubscription.cancel_at_period_end = true;
    } else {
      await this.stripe.subscriptions.update(
        latestSubscription.stripe_subscription_id,
        {
          cancel_at_period_end: false,
        },
      );
      latestSubscription.cancel_at_period_end = false;
    }

    return await this.subscriptionsRepository.save(latestSubscription);
  }

  @Cron(CronExpression.EVERY_3_HOURS)
  async checkExpiredTrials() {
    if (
      !this.configService.get('CRON_ENABLED') ||
      this.configService.get('CRON_ENABLED') === 'false'
    ) {
      return;
    }

    const now = dayjs().toDate();

    console.log('Subscription expiry cron job started');

    await this.transactionManagerService.executeInTransaction(
      async (queryRunner) => {
        const trialSubscriptions = await queryRunner.manager.find(
          Subscription,
          {
            where: {
              status: SubscriptionStatus.ACTIVE,
              plan: {
                type: PlanType.FREE,
              },
              end_date: LessThanOrEqual(now),
            },
            relations: { user: true, plan: true },
          },
        );

        const users = [] as User[];
        const subscriptions = [] as Subscription[];

        trialSubscriptions.forEach((trialSub) => {
          trialSub.status = SubscriptionStatus.CANCELED;
          trialSub.user.latest_subscription = null;
          users.push(trialSub.user);
          subscriptions.push(trialSub);
        });

        await queryRunner.manager.save(subscriptions);
        await queryRunner.manager.save(users);
      },
    );

    console.log('Subscription expiry cron job ended');
  }
}
