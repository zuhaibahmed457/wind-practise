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
exports.PlansController = void 0;
const common_1 = require("@nestjs/common");
const plans_service_1 = require("./plans.service");
const create_plan_dto_1 = require("./dto/create-plan.dto");
const update_plan_dto_1 = require("./dto/update-plan.dto");
const paramId_dto_1 = require("../../shared/dtos/paramId.dto");
const roles_decorator_1 = require("../../shared/decorators/roles.decorator");
const authentication_guard_1 = require("../../shared/guards/authentication.guard");
const roles_guard_1 = require("../../shared/guards/roles.guard");
const user_entity_1 = require("../users/entities/user.entity");
const get_all_plans_dto_1 = require("./dto/get-all-plans.dto");
const optionalAuthentication_guard_1 = require("../../shared/guards/optionalAuthentication.guard");
const current_user_decorator_1 = require("../../shared/decorators/current-user.decorator");
let PlansController = class PlansController {
    constructor(plansService) {
        this.plansService = plansService;
    }
    async create(createPlanDto) {
        const plan = await this.plansService.create(createPlanDto);
        return {
            message: 'Plan created successfully',
            details: plan,
        };
    }
    async findAll(currentUser, getAllPlansDto) {
        const { items, meta } = await this.plansService.findAll(currentUser, getAllPlansDto);
        return {
            message: 'Plans fetched successfully',
            details: items,
            extra: meta,
        };
    }
    findOne(id) {
        return this.plansService.findOne(+id);
    }
    async update(paramIdDto, updatePlanDto) {
        const plan = await this.plansService.update(paramIdDto, updatePlanDto);
        return {
            message: 'Plan updated successfully',
            details: plan,
        };
    }
    async toggleStatus(paramIdDto) {
        return await this.plansService.toggleStatus(paramIdDto);
    }
};
exports.PlansController = PlansController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_plan_dto_1.CreatePlanDto]),
    __metadata("design:returntype", Promise)
], PlansController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(optionalAuthentication_guard_1.OptionalAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        get_all_plans_dto_1.GetAllPlansDto]),
    __metadata("design:returntype", Promise)
], PlansController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PlansController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto,
        update_plan_dto_1.UpdatePlanDto]),
    __metadata("design:returntype", Promise)
], PlansController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)('toggle-status/:id'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto]),
    __metadata("design:returntype", Promise)
], PlansController.prototype, "toggleStatus", null);
exports.PlansController = PlansController = __decorate([
    (0, common_1.Controller)('plans'),
    __metadata("design:paramtypes", [plans_service_1.PlansService])
], PlansController);
//# sourceMappingURL=plans.controller.js.map