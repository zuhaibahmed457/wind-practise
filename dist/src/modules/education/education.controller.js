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
exports.EducationController = void 0;
const common_1 = require("@nestjs/common");
const nestjs_form_data_1 = require("nestjs-form-data");
const authentication_guard_1 = require("../../shared/guards/authentication.guard");
const roles_decorator_1 = require("../../shared/decorators/roles.decorator");
const roles_guard_1 = require("../../shared/guards/roles.guard");
const user_entity_1 = require("../users/entities/user.entity");
const education_service_1 = require("./education.service");
const create_education_dto_1 = require("./dto/create-education.dto");
const update_education_dto_1 = require("./dto/update-education.dto");
const current_user_decorator_1 = require("../../shared/decorators/current-user.decorator");
const paramId_dto_1 = require("../../shared/dtos/paramId.dto");
const get_all_education_dto_1 = require("./dto/get-all-education.dto");
let EducationController = class EducationController {
    constructor(educationService) {
        this.educationService = educationService;
    }
    async create(createEducationDto, currentUser) {
        const education = await this.educationService.create(createEducationDto, currentUser);
        return {
            message: 'Education added successfully',
            details: education,
        };
    }
    async findAll(getAllEducationDto, currentUser) {
        const { items, meta } = await this.educationService.findAll(getAllEducationDto, currentUser);
        return {
            message: 'Education fetched successfully',
            details: items,
            extra: meta,
        };
    }
    async findOne(paramIdDto, currentUser) {
        const education = await this.educationService.findOne(paramIdDto, currentUser);
        return {
            message: 'Education retrieved successfully',
            details: education,
        };
    }
    async update(paramIdDto, updateEducationDto, currentUser) {
        const updatedEducation = await this.educationService.update(paramIdDto, updateEducationDto, currentUser);
        return {
            message: 'Education updated successfully',
            details: updatedEducation,
        };
    }
    async remove(paramIdDto, currentUser) {
        await this.educationService.remove(paramIdDto, currentUser);
        return {
            message: 'Education deleted successfully',
        };
    }
};
exports.EducationController = EducationController;
__decorate([
    (0, common_1.Post)('create'),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.TECHNICIAN),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_education_dto_1.CreateEducationDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], EducationController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.TECHNICIAN, user_entity_1.UserRole.ORGANIZATION),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_all_education_dto_1.GetAllEducationDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], EducationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.TECHNICIAN),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], EducationController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.TECHNICIAN),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto,
        update_education_dto_1.UpdateEducationDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], EducationController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.TECHNICIAN),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], EducationController.prototype, "remove", null);
exports.EducationController = EducationController = __decorate([
    (0, common_1.Controller)('education'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [education_service_1.EducationService])
], EducationController);
//# sourceMappingURL=education.controller.js.map