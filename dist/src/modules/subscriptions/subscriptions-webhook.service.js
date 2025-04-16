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
exports.SubscriptionWebhookService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const stripe_1 = require("stripe");
const transaction_manager_service_1 = require("../../shared/services/transaction-manager.service");
const user_entity_1 = require("../users/entities/user.entity");
const subscription_entity_1 = require("./entities/subscription.entity");
const invoice_entity_1 = require("../invoices/entities/invoice.entity");
const plan_entity_1 = require("../plans/entities/plan.entity");
const dayjs = require("dayjs");
const event_emitter_1 = require("@nestjs/event-emitter");
const email_template_enum_1 = require("../notifications/enums/email-template.enum");
const notification_entity_1 = require("../notifications/entities/notification.entity");
let SubscriptionWebhookService = class SubscriptionWebhookService {
    constructor(subscriptionsRepository, userRepository, plansRepository, invoiceRepository, stripe, transactionManagerService, eventEmitter) {
        this.subscriptionsRepository = subscriptionsRepository;
        this.userRepository = userRepository;
        this.plansRepository = plansRepository;
        this.invoiceRepository = invoiceRepository;
        this.stripe = stripe;
        this.transactionManagerService = transactionManagerService;
        this.eventEmitter = eventEmitter;
    }
    async subscriptionInvoicePaid(eventData) {
        if (eventData.billing_reason === 'subscription_create') {
            const stripeSubscription = await this.stripe.subscriptions.retrieve(eventData.subscription);
            const subscriptionPlan = await this.plansRepository.findOne({
                where: {
                    stripe_product_id: stripeSubscription.items.data[0].plan
                        .product,
                },
            });
            if (!subscriptionPlan) {
                throw new common_1.NotFoundException('Plan with this id does not exists');
            }
            const user = await this.userRepository.findOne({
                where: {
                    email: eventData.customer_email,
                },
                relations: {
                    latest_subscription: {
                        plan: true,
                    },
                },
            });
            if (!user) {
                throw new common_1.NotFoundException('User with this email does not exists');
            }
            if (user.latest_subscription) {
                user.latest_subscription.status = subscription_entity_1.SubscriptionStatus.CANCELED;
                await this.subscriptionsRepository.save(user.latest_subscription);
            }
            const subscription = this.subscriptionsRepository.create({
                price: subscriptionPlan.price,
                status: subscription_entity_1.SubscriptionStatus.ACTIVE,
                stripe_subscription_id: stripeSubscription.id,
                start_date: dayjs
                    .unix(stripeSubscription.current_period_start)
                    .toDate(),
                end_date: dayjs.unix(stripeSubscription.current_period_end).toDate(),
                payment_status: subscription_entity_1.PaymentStatus.PAID,
                payment_failed_count: 0,
                plan: subscriptionPlan,
                user: user,
            });
            await subscription.save();
            const invoice = await this.createInvoice({
                eventDataObject: eventData,
                subscription,
                user,
            });
            user.latest_subscription = subscription;
            user.has_taken_subscription = true;
            user.has_used_free_trial = true;
            await user.save();
            const allAdmins = await this.userRepository.find({
                where: {
                    role: (0, typeorm_2.In)([user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.SUPER_ADMIN]),
                },
            });
            await this.eventEmitter.emitAsync('create-send-notification', {
                user_ids: allAdmins.map((a) => a.id),
                title: 'Hurry! A user purchased subscription',
                message: `Plan ${subscriptionPlan.name} has been subscribed by user ${user.first_name} ${user.last_name}`,
                template: email_template_enum_1.EmailTemplate.SUBSCRIPTION_PURCHASED,
                notification_type: notification_entity_1.NotificationType.TRANSACTION,
                is_displayable: true,
                bypass_user_preferences: true,
                channels: [notification_entity_1.NotificationChannel.EMAIL, notification_entity_1.NotificationChannel.IN_APP],
                entity_type: notification_entity_1.NotificationEntityType.SUBSCRIPTION,
                entity_id: subscription.id,
                meta_data: {
                    user_name: `${user.first_name} ${user.last_name}`,
                    user_email: user.email,
                    plan_name: subscriptionPlan.name,
                    amount_paid: `${invoice.amount_paid}`,
                    admin_dashboard_url: 'will be provided',
                },
            });
        }
        if (eventData.billing_reason === 'subscription_cycle') {
            const subscription = await this.subscriptionsRepository.findOne({
                where: {
                    stripe_subscription_id: eventData.subscription,
                },
                relations: {
                    user: true,
                },
            });
            if (!subscription) {
                throw new common_1.NotFoundException('Subscription does not exists');
            }
            const stripeSubscription = await this.stripe.subscriptions.retrieve(eventData.subscription);
            subscription.start_date = dayjs
                .unix(stripeSubscription.current_period_start)
                .toDate();
            subscription.end_date = dayjs
                .unix(stripeSubscription.current_period_end)
                .toDate();
            subscription.status = subscription_entity_1.SubscriptionStatus.ACTIVE;
            subscription.payment_status = subscription_entity_1.PaymentStatus.PAID;
            subscription.payment_failed_count = 0;
            await subscription.save();
            await this.createInvoice({
                eventDataObject: eventData,
                subscription,
                user: subscription.user,
            });
        }
        if (eventData.billing_reason === 'subscription_update') {
            const subscription = await this.subscriptionsRepository.findOne({
                where: {
                    stripe_subscription_id: eventData.subscription,
                },
                relations: {
                    user: true,
                    plan: true,
                },
            });
            const previousSubscriptionPlan = subscription.plan;
            if (!subscription) {
                throw new common_1.NotFoundException('Subscription does not exists');
            }
            const stripeSubscription = await this.stripe.subscriptions.retrieve(eventData.subscription);
            const subscriptionPlan = await this.plansRepository.findOne({
                where: {
                    stripe_product_id: stripeSubscription.items.data[0].plan
                        .product,
                },
            });
            if (!subscriptionPlan) {
                throw new common_1.NotFoundException('Plan with this id does not exists');
            }
            subscription.plan = subscriptionPlan;
            subscription.start_date = dayjs
                .unix(stripeSubscription.current_period_start)
                .toDate();
            subscription.end_date = dayjs
                .unix(stripeSubscription.current_period_end)
                .toDate();
            subscription.status = subscription_entity_1.SubscriptionStatus.ACTIVE;
            subscription.price = subscriptionPlan.price;
            subscription.payment_status = subscription_entity_1.PaymentStatus.PAID;
            subscription.payment_failed_count = 0;
            await subscription.save();
            const invoice = await this.createInvoice({
                eventDataObject: eventData,
                subscription,
                user: subscription.user,
            });
            const allAdmins = await this.userRepository.find({
                where: {
                    role: (0, typeorm_2.In)([user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.SUPER_ADMIN]),
                },
            });
            await this.eventEmitter.emitAsync('create-send-notification', {
                user_ids: allAdmins.map((a) => a.id),
                title: 'A user updated his subscription plan',
                message: `Plan ${subscriptionPlan.name} has been subscribed by user ${subscription.user.first_name} ${subscription.user.last_name}`,
                template: email_template_enum_1.EmailTemplate.SUBSCRIPTION_UPDATED,
                notification_type: notification_entity_1.NotificationType.TRANSACTION,
                is_displayable: true,
                bypass_user_preferences: true,
                channels: [notification_entity_1.NotificationChannel.EMAIL, notification_entity_1.NotificationChannel.IN_APP],
                entity_type: notification_entity_1.NotificationEntityType.SUBSCRIPTION,
                entity_id: subscription.id,
                meta_data: {
                    user_name: `${subscription.user.first_name} ${subscription.user.last_name}`,
                    user_email: subscription.user.email,
                    new_plan_name: subscriptionPlan.name,
                    previous_plan_name: previousSubscriptionPlan.name,
                    amount_paid: `${invoice.amount_paid}`,
                    admin_dashboard_url: 'will be provided',
                },
            });
        }
    }
    async handleFailedPayment(eventDataObject) {
        const subscription = await this.subscriptionsRepository.findOne({
            where: {
                stripe_subscription_id: eventDataObject.subscription,
            },
            relations: {
                user: true,
            },
        });
        if (!subscription) {
            throw new common_1.BadRequestException('Subscription not found');
        }
        subscription.payment_failed_count++;
        subscription.status = subscription_entity_1.SubscriptionStatus.PAST_DUE;
        if (subscription.payment_failed_count >= 2) {
            const latestInvoice = (await this.stripe.subscriptions.retrieve(subscription.stripe_subscription_id)).latest_invoice;
            await this.stripe.invoices.voidInvoice(latestInvoice.toString());
            await this.stripe.subscriptions.cancel(subscription.stripe_subscription_id);
            subscription.status = subscription_entity_1.SubscriptionStatus.CANCELED;
            subscription.user.latest_subscription = null;
            return await this.userRepository.save(subscription.user);
        }
        await subscription.save();
    }
    async subscriptionDeleted(data) {
        const subscription = await this.subscriptionsRepository.findOne({
            where: {
                stripe_subscription_id: data.id,
                status: subscription_entity_1.SubscriptionStatus.ACTIVE,
            },
            relations: {
                user: true,
            },
        });
        if (!subscription) {
            return;
        }
        subscription.user.latest_subscription = null;
        await this.userRepository.save(subscription.user);
        subscription.status = subscription_entity_1.SubscriptionStatus.CANCELED;
        return await subscription.save();
    }
    async updateSubscription(eventDataObject) {
        const subscription = await this.subscriptionsRepository.findOne({
            where: {
                stripe_subscription_id: eventDataObject.id,
            },
            relations: {
                user: true,
            },
        });
        if (!subscription) {
            return;
        }
        subscription.cancel_at_period_end = eventDataObject.cancel_at_period_end;
        return await subscription.save();
    }
    async createInvoice({ eventDataObject, subscription, user }) {
        const invoice = this.invoiceRepository.create({
            stripe_invoice_id: eventDataObject.id,
            stripe_hosted_invoice_url: eventDataObject.hosted_invoice_url,
            stripe_invoice_pdf: eventDataObject.invoice_pdf,
            status: invoice_entity_1.InvoiceStatus.PAID,
            amount_paid: eventDataObject.amount_paid / 100,
            amount_due: eventDataObject.amount_due / 100,
            payment_date: new Date(),
            subscription,
            user,
        });
        return await this.invoiceRepository.save(invoice);
    }
};
exports.SubscriptionWebhookService = SubscriptionWebhookService;
exports.SubscriptionWebhookService = SubscriptionWebhookService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(subscription_entity_1.Subscription)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(plan_entity_1.Plan)),
    __param(3, (0, typeorm_1.InjectRepository)(invoice_entity_1.Invoice)),
    __param(4, (0, common_1.Inject)('STRIPE_CLIENT')),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        stripe_1.default,
        transaction_manager_service_1.TransactionManagerService,
        event_emitter_1.EventEmitter2])
], SubscriptionWebhookService);
//# sourceMappingURL=subscriptions-webhook.service.js.map