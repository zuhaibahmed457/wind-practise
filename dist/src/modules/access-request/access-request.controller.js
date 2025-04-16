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
exports.AccessRequestController = void 0;
const common_1 = require("@nestjs/common");
const access_request_service_1 = require("./access-request.service");
const create_access_request_dto_1 = require("./dto/create-access-request.dto");
const current_user_decorator_1 = require("../../shared/decorators/current-user.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const nestjs_form_data_1 = require("nestjs-form-data");
const authentication_guard_1 = require("../../shared/guards/authentication.guard");
const roles_guard_1 = require("../../shared/guards/roles.guard");
const roles_decorator_1 = require("../../shared/decorators/roles.decorator");
const get_all_access_request_dto_1 = require("./dto/get-all-access-request.dto");
const paramId_dto_1 = require("../../shared/dtos/paramId.dto");
const manage_access_request_dto_1 = require("./dto/manage-access-request.dto");
const text_capitalize_1 = require("../../utils/text-capitalize");
const view_access_request_dto_1 = require("./dto/view-access-request.dto");
let AccessRequestController = class AccessRequestController {
    constructor(accessRequestService) {
        this.accessRequestService = accessRequestService;
    }
    async create(createAccessRequestDto) {
        const accessRequest = await this.accessRequestService.create(createAccessRequestDto);
        return {
            message: `Your request has been successfully submitted and is pending approval.`,
            details: accessRequest,
        };
    }
    async viewAccessRequest(viewAccessRequestDto) {
        const accessRequest = await this.accessRequestService.viewAccessRequest(viewAccessRequestDto);
        return {
            message: `Your Access Request Status is ${accessRequest.status}.`,
            details: accessRequest,
        };
    }
    async findAll(getAllAccessRequestDto, currentUser) {
        const { items, meta } = await this.accessRequestService.findAll(getAllAccessRequestDto, currentUser);
        return {
            message: 'Access requests fetched successfully',
            details: items,
            extra: meta,
        };
    }
    async findOne(paramIdDto, currentUser) {
        const accessRequest = await this.accessRequestService.findOne(paramIdDto, currentUser);
        return {
            message: 'Access request fetched successfully',
            details: accessRequest,
        };
    }
    async manageStatus(paramIdDto, currentUser, manageAccessRequestDto) {
        const updatedAccessRequestStatus = await this.accessRequestService.manageStatus(paramIdDto, currentUser, manageAccessRequestDto);
        return {
            message: `${(0, text_capitalize_1.textCapitalize)(manageAccessRequestDto.status)} successfully`,
            details: updatedAccessRequestStatus,
        };
    }
    async remove(paramIdDto, currentUser) {
        const accessRequest = await this.accessRequestService.remove(paramIdDto, currentUser);
        return {
            message: 'Access request Deleted successfully',
        };
    }
};
exports.AccessRequestController = AccessRequestController;
__decorate([
    (0, common_1.Post)(),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_access_request_dto_1.CreateAccessRequestDto]),
    __metadata("design:returntype", Promise)
], AccessRequestController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('view-request-status'),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [view_access_request_dto_1.ViewAccessRequestDto]),
    __metadata("design:returntype", Promise)
], AccessRequestController.prototype, "viewAccessRequest", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.TECHNICIAN),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_all_access_request_dto_1.GetAllAccessRequestDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], AccessRequestController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.TECHNICIAN),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], AccessRequestController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)('manage-status/:id'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.TECHNICIAN),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto,
        user_entity_1.User,
        manage_access_request_dto_1.ManageAccessRequestDto]),
    __metadata("design:returntype", Promise)
], AccessRequestController.prototype, "manageStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.TECHNICIAN),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], AccessRequestController.prototype, "remove", null);
exports.AccessRequestController = AccessRequestController = __decorate([
    (0, common_1.Controller)('access-request'),
    __metadata("design:paramtypes", [access_request_service_1.AccessRequestService])
], AccessRequestController);
//# sourceMappingURL=access-request.controller.js.map