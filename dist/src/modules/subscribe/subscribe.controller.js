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
exports.SubscribeController = void 0;
const common_1 = require("@nestjs/common");
const subscribe_service_1 = require("./subscribe.service");
const create_subscribe_dto_1 = require("./dto/create-subscribe.dto");
const paramId_dto_1 = require("../../shared/dtos/paramId.dto");
const getAll_dto_1 = require("../../shared/dtos/getAll.dto");
const nestjs_form_data_1 = require("nestjs-form-data");
const authentication_guard_1 = require("../../shared/guards/authentication.guard");
const roles_guard_1 = require("../../shared/guards/roles.guard");
const roles_decorator_1 = require("../../shared/decorators/roles.decorator");
const user_entity_1 = require("../users/entities/user.entity");
let SubscribeController = class SubscribeController {
    constructor(subscribeService) {
        this.subscribeService = subscribeService;
    }
    async create(createSubscribeDto) {
        await this.subscribeService.create(createSubscribeDto);
        return {
            message: 'Subscribed successfully',
        };
    }
    async findAll(getAllDto) {
        const { items, meta } = await this.subscribeService.findAll(getAllDto);
        return {
            message: 'Subscription fetched successfully',
            details: items,
            extra: meta,
        };
    }
    async findOne(paramIdDto) {
        const subscription = await this.subscribeService.findOne(paramIdDto);
        return {
            message: 'Subscription fetched successfully',
            details: subscription,
        };
    }
    async remove(paramIdDto) {
        await this.subscribeService.remove(paramIdDto);
        return {
            message: 'Subscriber deleted successfully'
        };
    }
};
exports.SubscribeController = SubscribeController;
__decorate([
    (0, common_1.Post)(),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_subscribe_dto_1.CreateSubscribeDto]),
    __metadata("design:returntype", Promise)
], SubscribeController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [getAll_dto_1.GetAllDto]),
    __metadata("design:returntype", Promise)
], SubscribeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto]),
    __metadata("design:returntype", Promise)
], SubscribeController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto]),
    __metadata("design:returntype", Promise)
], SubscribeController.prototype, "remove", null);
exports.SubscribeController = SubscribeController = __decorate([
    (0, common_1.Controller)('subscribe'),
    __metadata("design:paramtypes", [subscribe_service_1.SubscribeService])
], SubscribeController);
//# sourceMappingURL=subscribe.controller.js.map