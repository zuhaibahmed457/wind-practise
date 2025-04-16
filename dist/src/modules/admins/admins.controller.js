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
exports.AdminsController = void 0;
const common_1 = require("@nestjs/common");
const authentication_guard_1 = require("../../shared/guards/authentication.guard");
const roles_decorator_1 = require("../../shared/decorators/roles.decorator");
const roles_guard_1 = require("../../shared/guards/roles.guard");
const current_user_decorator_1 = require("../../shared/decorators/current-user.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const admins_service_1 = require("./admins.service");
const subscription_stats_dto_1 = require("./dto/subscription-stats.dto");
const revenue_stats_dto_1 = require("./dto/revenue-stats.dto");
let AdminsController = class AdminsController {
    constructor(adminsService) {
        this.adminsService = adminsService;
    }
    async dashboard(user) {
        const data = await this.adminsService.dashboard(user);
        return {
            message: 'Dashboard fetched successfully',
            details: data,
        };
    }
    async subscriptions(user, subscriptionStatsDto) {
        const data = await this.adminsService.subscriptions(user, subscriptionStatsDto);
        return {
            message: 'Dashboard fetched successfully',
            details: data,
        };
    }
    async revenue(user, revenueStatsDto) {
        const data = await this.adminsService.revenue(user, revenueStatsDto);
        return {
            message: 'Dashboard fetched successfully',
            details: data,
        };
    }
};
exports.AdminsController = AdminsController;
__decorate([
    (0, common_1.Get)('dashboard/stats'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], AdminsController.prototype, "dashboard", null);
__decorate([
    (0, common_1.Get)('dashboard/subscriptions'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        subscription_stats_dto_1.SubscriptionStatsDto]),
    __metadata("design:returntype", Promise)
], AdminsController.prototype, "subscriptions", null);
__decorate([
    (0, common_1.Get)('dashboard/revenue'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        revenue_stats_dto_1.RevenueStatsDto]),
    __metadata("design:returntype", Promise)
], AdminsController.prototype, "revenue", null);
exports.AdminsController = AdminsController = __decorate([
    (0, common_1.Controller)('admins'),
    __metadata("design:paramtypes", [admins_service_1.AdminsService])
], AdminsController);
//# sourceMappingURL=admins.controller.js.map