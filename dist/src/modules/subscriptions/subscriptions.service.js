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
exports.SubscriptionsService = void 0;
const common_1 = require("@nestjs/common");
const plan_entity_1 = require("../plans/entities/plan.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const stripe_1 = require("stripe");
const subscription_entity_1 = require("./entities/subscription.entity");
const transaction_manager_service_1 = require("../../shared/services/transaction-manager.service");
const dayjs = require("dayjs");
const schedule_1 = require("@nestjs/schedule");
const manage_subscription_dto_1 = require("./dto/manage-subscription.dto");
const nestjs_typeorm_paginate_1 = require("nestjs-typeorm-paginate");
const config_1 = require("@nestjs/config");
let SubscriptionsService = class SubscriptionsService {
    constructor(subscriptionsRepository, plansRepository, userRepository, transactionManagerService, stripe, configService) {
        this.subscriptionsRepository = subscriptionsRepository;
        this.plansRepository = plansRepository;
        this.userRepository = userRepository;
        this.transactionManagerService = transactionManagerService;
        this.stripe = stripe;
        this.configService = configService;
    }
    async create(currentUser, createSubscriptionDto) {
        return this.transactionManagerService.executeInTransaction(async (queryRunner) => {
            if (currentUser.latest_subscription &&
                currentUser.latest_subscription.plan.type !== plan_entity_1.PlanType.FREE) {
                throw new common_1.BadRequestException('You already have subscription, please use manage subscription route');
            }
            const plan = await queryRunner.manager.findOne(plan_entity_1.Plan, {
                where: {
                    id: createSubscriptionDto.plan_id,
                    status: plan_entity_1.PlanStatus.ACTIVE,
                    for: currentUser.role,
                },
            });
            if (!plan) {
                throw new common_1.NotFoundException('Subscription plan does not exist');
            }
            if (plan.type === plan_entity_1.PlanType.FREE && currentUser.has_used_free_trial) {
                throw new common_1.BadRequestException('Free trial has already used');
            }
            if (plan.type === plan_entity_1.PlanType.FREE) {
                const subscription = queryRunner.manager.create(subscription_entity_1.Subscription, {
                    status: subscription_entity_1.SubscriptionStatus.ACTIVE,
                    user: currentUser,
                    plan: plan,
                    start_date: dayjs().toDate(),
                    end_date: dayjs().add(plan.free_duration, 'days').toDate(),
                });
                await queryRunner.manager.save(subscription_entity_1.Subscription, subscription);
                currentUser.latest_subscription = subscription;
                currentUser.has_used_free_trial = true;
                currentUser.has_taken_subscription = true;
                await queryRunner.manager.save(user_entity_1.User, currentUser);
                return {
                    message: 'Free trial has been activated',
                    details: subscription,
                };
            }
            if (currentUser.role === user_entity_1.UserRole.ORGANIZATION) {
                const numberOfEmployee = await this.userRepository.count({
                    where: {
                        role: user_entity_1.UserRole.EMPLOYEE,
                        created_by: {
                            id: currentUser.id,
                        },
                    },
                });
                if (numberOfEmployee > plan.number_of_employees_allowed) {
                    throw new common_1.BadRequestException(`You have currently ${numberOfEmployee} employees, please take plan which correspond to your number of employees`);
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
            const invoice = stripeSubscription.latest_invoice;
            const paymentIntent = invoice.payment_intent;
            return {
                message: 'Please subscribe by providing credit card',
                details: {
                    stripe_subscription_id: stripeSubscription.id,
                    stripe_client_secret: paymentIntent.client_secret,
                },
            };
        });
    }
    async createCustomerPortal(currentUser, createCustomerPortalDto) {
        if (!currentUser.latest_subscription ||
            currentUser.latest_subscription.plan.type === plan_entity_1.PlanType.FREE) {
            throw new common_1.BadRequestException('Please subscribe to paid plan first');
        }
        const numberOfEmployee = await this.userRepository.count({
            where: {
                role: user_entity_1.UserRole.EMPLOYEE,
                created_by: {
                    id: currentUser.id,
                },
            },
        });
        const plans = await this.plansRepository.find({
            where: {
                type: (0, typeorm_1.In)([plan_entity_1.PlanType.MONTHLY, plan_entity_1.PlanType.YEARLY]),
                status: plan_entity_1.PlanStatus.ACTIVE,
                for: currentUser.role,
                ...(currentUser.role === user_entity_1.UserRole.ORGANIZATION && {
                    number_of_employees_allowed: (0, typeorm_1.MoreThanOrEqual)(numberOfEmployee),
                }),
            },
        });
        const configuration = await this.stripe.billingPortal.configurations.create({
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
        });
        const portalSession = await this.stripe.billingPortal.sessions.create({
            customer: currentUser.stripe_customer_id,
            return_url: createCustomerPortalDto.return_url,
            configuration: configuration.id,
        });
        return portalSession.url;
    }
    async findAll(getUsersSubscriptionDto) {
        const { search, page = 1, per_page = 10, type, for: plan_for, plan_id, } = getUsersSubscriptionDto;
        const query = this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.latest_subscription', 'latest_subscription')
            .leftJoinAndSelect('latest_subscription.plan', 'plan')
            .where('user.role NOT IN (:...excludeRoles) AND user.deleted_at IS NULL', {
            excludeRoles: [
                user_entity_1.UserRole.SUPER_ADMIN,
                user_entity_1.UserRole.ADMIN,
                user_entity_1.UserRole.EMPLOYEE,
            ],
        })
            .orderBy('latest_subscription.updated_at', 'DESC');
        if (search) {
            query.andWhere('(user.full_name ILIKE :search OR user.email ILIKE :search OR plan.name ILIKE :search)', { search: `%${search}%` });
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
        const paginationOptions = {
            page: page,
            limit: per_page,
        };
        return await (0, nestjs_typeorm_paginate_1.paginate)(query, paginationOptions);
    }
    findOne(id) {
        return `This action returns a #${id} subscription`;
    }
    update(id, updateSubscriptionDto) {
        return `This action updates a #${id} subscription`;
    }
    remove(id) {
        return `This action removes a #${id} subscription`;
    }
    async manageSubscription(id, manageSubscriptionDto, currentUser) {
        const { action } = manageSubscriptionDto;
        const latestSubscription = currentUser.latest_subscription;
        if (!latestSubscription) {
            throw new common_1.NotFoundException('Subscription not found');
        }
        if (latestSubscription.plan.type === plan_entity_1.PlanType.FREE) {
            throw new common_1.BadRequestException(`You can't ${action} trial subscription`);
        }
        if (latestSubscription.status !== subscription_entity_1.SubscriptionStatus.ACTIVE) {
            throw new common_1.BadRequestException(`Subscription can not be ${action}`);
        }
        if ((latestSubscription.cancel_at_period_end &&
            action === manage_subscription_dto_1.SubscriptionActions.CANCEL) ||
            (!latestSubscription.cancel_at_period_end &&
                action === manage_subscription_dto_1.SubscriptionActions.RENEW)) {
            throw new common_1.BadRequestException(`Subscription is already ${action}`);
        }
        if (action === manage_subscription_dto_1.SubscriptionActions.CANCEL) {
            await this.stripe.subscriptions.update(latestSubscription.stripe_subscription_id, {
                cancel_at_period_end: true,
            });
            latestSubscription.cancel_at_period_end = true;
        }
        else {
            await this.stripe.subscriptions.update(latestSubscription.stripe_subscription_id, {
                cancel_at_period_end: false,
            });
            latestSubscription.cancel_at_period_end = false;
        }
        return await this.subscriptionsRepository.save(latestSubscription);
    }
    async checkExpiredTrials() {
        if (!this.configService.get('CRON_ENABLED') ||
            this.configService.get('CRON_ENABLED') === 'false') {
            return;
        }
        const now = dayjs().toDate();
        console.log('Subscription expiry cron job started');
        await this.transactionManagerService.executeInTransaction(async (queryRunner) => {
            const trialSubscriptions = await queryRunner.manager.find(subscription_entity_1.Subscription, {
                where: {
                    status: subscription_entity_1.SubscriptionStatus.ACTIVE,
                    plan: {
                        type: plan_entity_1.PlanType.FREE,
                    },
                    end_date: (0, typeorm_1.LessThanOrEqual)(now),
                },
                relations: { user: true, plan: true },
            });
            const users = [];
            const subscriptions = [];
            trialSubscriptions.forEach((trialSub) => {
                trialSub.status = subscription_entity_1.SubscriptionStatus.CANCELED;
                trialSub.user.latest_subscription = null;
                users.push(trialSub.user);
                subscriptions.push(trialSub);
            });
            await queryRunner.manager.save(subscriptions);
            await queryRunner.manager.save(users);
        });
        console.log('Subscription expiry cron job ended');
    }
};
exports.SubscriptionsService = SubscriptionsService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_3_HOURS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SubscriptionsService.prototype, "checkExpiredTrials", null);
exports.SubscriptionsService = SubscriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(subscription_entity_1.Subscription)),
    __param(1, (0, typeorm_2.InjectRepository)(plan_entity_1.Plan)),
    __param(2, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __param(4, (0, common_1.Inject)('STRIPE_CLIENT')),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        transaction_manager_service_1.TransactionManagerService,
        stripe_1.default,
        config_1.ConfigService])
], SubscriptionsService);
//# sourceMappingURL=subscriptions.service.js.map