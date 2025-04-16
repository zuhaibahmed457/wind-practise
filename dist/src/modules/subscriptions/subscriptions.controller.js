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
exports.SubscriptionsController = void 0;
const common_1 = require("@nestjs/common");
const subscriptions_service_1 = require("./subscriptions.service");
const create_subscription_dto_1 = require("./dto/create-subscription.dto");
const update_subscription_dto_1 = require("./dto/update-subscription.dto");
const current_user_decorator_1 = require("../../shared/decorators/current-user.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const authentication_guard_1 = require("../../shared/guards/authentication.guard");
const create_customer_portal_dto_1 = require("./dto/create-customer-portal.dto");
const roles_guard_1 = require("../../shared/guards/roles.guard");
const roles_decorator_1 = require("../../shared/decorators/roles.decorator");
const paramId_dto_1 = require("../../shared/dtos/paramId.dto");
const manage_subscription_dto_1 = require("./dto/manage-subscription.dto");
const text_capitalize_1 = require("../../utils/text-capitalize");
const stripe_1 = require("stripe");
const config_1 = require("@nestjs/config");
const subscriptions_webhook_service_1 = require("./subscriptions-webhook.service");
const get_users_subscription_dto_1 = require("./dto/get-users-subscription.dto");
let SubscriptionsController = class SubscriptionsController {
    constructor(subscriptionsService, stripe, configService, subscriptionWebhookService) {
        this.subscriptionsService = subscriptionsService;
        this.stripe = stripe;
        this.configService = configService;
        this.subscriptionWebhookService = subscriptionWebhookService;
    }
    async create(currentUser, createSubscriptionDto) {
        return await this.subscriptionsService.create(currentUser, createSubscriptionDto);
    }
    async createCustomerPortal(currentUser, createCustomerPortalDto) {
        const customerPortalUrl = await this.subscriptionsService.createCustomerPortal(currentUser, createCustomerPortalDto);
        return {
            message: 'Redirecting to customer portal',
            details: {
                customer_portal_url: customerPortalUrl,
            },
        };
    }
    async manageSubscription(currentUser, id, manageSubscriptionDto) {
        const subscription = await this.subscriptionsService.manageSubscription(id, manageSubscriptionDto, currentUser);
        return {
            message: `Your subscription will ${(0, text_capitalize_1.textCapitalize)(manageSubscriptionDto.action)} on period end`,
            details: subscription,
        };
    }
    async handleSubscriptionWebhook(req, res, signature) {
        let event;
        try {
            event = this.stripe.webhooks.constructEvent(req.body, signature, this.configService.get('STRIPE_SUBSCRIPTION_WEBHOOK_SECRET'));
        }
        catch (err) {
            console.error('Webhook signature verification failed:', err.message);
            throw new common_1.BadRequestException('Invalid webhook signature');
        }
        switch (event.type) {
            case 'invoice.payment_succeeded':
                await this.subscriptionWebhookService.subscriptionInvoicePaid(event.data.object);
                break;
            case 'customer.subscription.deleted':
                await this.subscriptionWebhookService.subscriptionDeleted(event.data.object);
                break;
            case 'invoice.payment_failed':
                await this.subscriptionWebhookService.handleFailedPayment(event.data.object);
                break;
            case 'customer.subscription.updated':
                await this.subscriptionWebhookService.updateSubscription(event.data.object);
                break;
            default:
                break;
        }
        return res.status(200).json({
            message: 'Webhook received successfully',
        });
    }
    async findAll(getUsersSubscriptionDto) {
        const { items, meta } = await this.subscriptionsService.findAll(getUsersSubscriptionDto);
        return {
            message: 'Subscription of each user fetched successfully',
            details: items,
            extra: meta,
        };
    }
    findOne(id) {
        return this.subscriptionsService.findOne(+id);
    }
    update(id, updateSubscriptionDto) {
        return this.subscriptionsService.update(+id, updateSubscriptionDto);
    }
    remove(id) {
        return this.subscriptionsService.remove(+id);
    }
};
exports.SubscriptionsController = SubscriptionsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.ORGANIZATION, user_entity_1.UserRole.TECHNICIAN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        create_subscription_dto_1.CreateSubscriptionDto]),
    __metadata("design:returntype", Promise)
], SubscriptionsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('customer-portal'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.ORGANIZATION, user_entity_1.UserRole.TECHNICIAN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        create_customer_portal_dto_1.CreateCustomerPortalDto]),
    __metadata("design:returntype", Promise)
], SubscriptionsController.prototype, "createCustomerPortal", null);
__decorate([
    (0, common_1.Patch)('manage-subscription/:id'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.ORGANIZATION, user_entity_1.UserRole.TECHNICIAN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        paramId_dto_1.ParamIdDto,
        manage_subscription_dto_1.ManageSubscriptionDto]),
    __metadata("design:returntype", Promise)
], SubscriptionsController.prototype, "manageSubscription", null);
__decorate([
    (0, common_1.Post)('webhook'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Headers)('stripe-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], SubscriptionsController.prototype, "handleSubscriptionWebhook", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_users_subscription_dto_1.GetUsersSubscriptionsDto]),
    __metadata("design:returntype", Promise)
], SubscriptionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SubscriptionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_subscription_dto_1.UpdateSubscriptionDto]),
    __metadata("design:returntype", void 0)
], SubscriptionsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SubscriptionsController.prototype, "remove", null);
exports.SubscriptionsController = SubscriptionsController = __decorate([
    (0, common_1.Controller)('subscriptions'),
    __param(1, (0, common_1.Inject)('STRIPE_CLIENT')),
    __metadata("design:paramtypes", [subscriptions_service_1.SubscriptionsService,
        stripe_1.default,
        config_1.ConfigService,
        subscriptions_webhook_service_1.SubscriptionWebhookService])
], SubscriptionsController);
//# sourceMappingURL=subscriptions.controller.js.map