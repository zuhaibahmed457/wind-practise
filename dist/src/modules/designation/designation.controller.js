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
exports.DesignationController = void 0;
const common_1 = require("@nestjs/common");
const designation_service_1 = require("./designation.service");
const create_designation_dto_1 = require("./dto/create-designation.dto");
const update_designation_dto_1 = require("./dto/update-designation.dto");
const current_user_decorator_1 = require("../../shared/decorators/current-user.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const authentication_guard_1 = require("../../shared/guards/authentication.guard");
const roles_guard_1 = require("../../shared/guards/roles.guard");
const roles_decorator_1 = require("../../shared/decorators/roles.decorator");
const get_all_designation_dto_1 = require("./dto/get-all-designation.dto");
const paramId_dto_1 = require("../../shared/dtos/paramId.dto");
const nestjs_form_data_1 = require("nestjs-form-data");
const text_capitalize_1 = require("../../utils/text-capitalize");
const designation_status_dto_1 = require("./dto/designation-status.dto");
let DesignationController = class DesignationController {
    constructor(designationService) {
        this.designationService = designationService;
    }
    async create(createDesignationDto, currentUser) {
        const designation = await this.designationService.create(createDesignationDto, currentUser);
        return {
            message: 'Designation created successfully',
            details: designation,
        };
    }
    async findAll(getAllDesignationDto, currentUser) {
        const { items, meta } = await this.designationService.findAll(getAllDesignationDto, currentUser);
        return {
            message: 'Designations fetched successfully',
            details: items,
            extra: meta,
        };
    }
    async findOne(paramIdDto, currentUser) {
        const designation = await this.designationService.findOne(paramIdDto, currentUser);
        return {
            message: 'Designation fetched successfully',
            details: designation,
        };
    }
    async update(paramIdDto, updateDesignationDto, currentUser) {
        const updatedDesignation = await this.designationService.update(paramIdDto, updateDesignationDto, currentUser);
        return {
            message: 'Designation updated successfully',
            details: updatedDesignation,
        };
    }
    async manage_status(paramDto, manageStatusDto, currentUser) {
        const updatedDesignation = await this.designationService.manageStatus(paramDto, manageStatusDto, currentUser);
        return {
            message: `${(0, text_capitalize_1.textCapitalize)(manageStatusDto.status)} successfully`,
            details: updatedDesignation,
        };
    }
    async remove(paramIdDto, currentUser) {
        await this.designationService.remove(paramIdDto.id, currentUser);
        return {
            message: 'Designation deleted successfully',
            details: null,
        };
    }
};
exports.DesignationController = DesignationController;
__decorate([
    (0, common_1.Post)('create'),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_designation_dto_1.CreateDesignationDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], DesignationController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_all_designation_dto_1.GetAllDesignationDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], DesignationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], DesignationController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto,
        update_designation_dto_1.UpdateDesignationDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], DesignationController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)('manage-status/:id'),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto,
        designation_status_dto_1.DesignationManageStatusDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], DesignationController.prototype, "manage_status", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], DesignationController.prototype, "remove", null);
exports.DesignationController = DesignationController = __decorate([
    (0, common_1.Controller)('designation'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.ORGANIZATION),
    __metadata("design:paramtypes", [designation_service_1.DesignationService])
], DesignationController);
//# sourceMappingURL=designation.controller.js.map