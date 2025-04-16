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
exports.EmploymentTypeController = void 0;
const common_1 = require("@nestjs/common");
const employment_type_service_1 = require("./employment-type.service");
const create_employment_type_dto_1 = require("./dto/create-employment-type.dto");
const update_employment_type_dto_1 = require("./dto/update-employment-type.dto");
const current_user_decorator_1 = require("../../shared/decorators/current-user.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const get_all_employment_type_dto_1 = require("./dto/get-all-employment-type.dto");
const paramId_dto_1 = require("../../shared/dtos/paramId.dto");
const nestjs_form_data_1 = require("nestjs-form-data");
const manage_status_dto_1 = require("./dto/manage-status.dto");
const text_capitalize_1 = require("../../utils/text-capitalize");
const authentication_guard_1 = require("../../shared/guards/authentication.guard");
const roles_guard_1 = require("../../shared/guards/roles.guard");
const roles_decorator_1 = require("../../shared/decorators/roles.decorator");
let EmploymentTypeController = class EmploymentTypeController {
    constructor(employmentTypeService) {
        this.employmentTypeService = employmentTypeService;
    }
    async create(createEmploymentTypeDto, currentUser) {
        const employmentType = await this.employmentTypeService.create(createEmploymentTypeDto, currentUser);
        return {
            message: 'Employment type created successfully',
            details: employmentType,
        };
    }
    async findAll(getAllEmploymentTypeDto, currentUser) {
        const { items, meta } = await this.employmentTypeService.findAll(getAllEmploymentTypeDto);
        return {
            message: 'Employment types fetched successfully',
            details: items,
            extra: meta,
        };
    }
    async findOne(paramIdDto) {
        const employmentType = await this.employmentTypeService.findOne(paramIdDto);
        return {
            message: 'Employment type fetched successfully',
            details: employmentType,
        };
    }
    async update(paramIdDto, updateEmploymentTypeDto) {
        const employmentType = await this.employmentTypeService.update(paramIdDto, updateEmploymentTypeDto);
        return {
            message: 'Employment type updated successfully',
            details: employmentType,
        };
    }
    async manage_status(paramDto, manageStatusDto) {
        const updatedDesignation = await this.employmentTypeService.manageStatus(paramDto, manageStatusDto);
        return {
            message: `${(0, text_capitalize_1.textCapitalize)(manageStatusDto.status)} successfully`,
            details: updatedDesignation,
        };
    }
};
exports.EmploymentTypeController = EmploymentTypeController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.SUPER_ADMIN),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_employment_type_dto_1.CreateEmploymentTypeDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], EmploymentTypeController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_all_employment_type_dto_1.GetAllEmploymentTypeDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], EmploymentTypeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto]),
    __metadata("design:returntype", Promise)
], EmploymentTypeController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.SUPER_ADMIN),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto,
        update_employment_type_dto_1.UpdateEmploymentTypeDto]),
    __metadata("design:returntype", Promise)
], EmploymentTypeController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)('manage-status/:id'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.SUPER_ADMIN),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto,
        manage_status_dto_1.EmploymentTypeManageStatusDto]),
    __metadata("design:returntype", Promise)
], EmploymentTypeController.prototype, "manage_status", null);
exports.EmploymentTypeController = EmploymentTypeController = __decorate([
    (0, common_1.Controller)('employment-type'),
    __metadata("design:paramtypes", [employment_type_service_1.EmploymentTypeService])
], EmploymentTypeController);
//# sourceMappingURL=employment-type.controller.js.map