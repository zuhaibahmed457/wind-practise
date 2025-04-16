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
exports.SubjectController = void 0;
const common_1 = require("@nestjs/common");
const paramId_dto_1 = require("../../shared/dtos/paramId.dto");
const getAll_dto_1 = require("../../shared/dtos/getAll.dto");
const authentication_guard_1 = require("../../shared/guards/authentication.guard");
const roles_guard_1 = require("../../shared/guards/roles.guard");
const roles_decorator_1 = require("../../shared/decorators/roles.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const subject_service_1 = require("./subject.service");
const create_subject_dto_1 = require("./dto/create-subject.dto");
const update_subject_dto_1 = require("./dto/update-subject.dto");
const nestjs_form_data_1 = require("nestjs-form-data");
let SubjectController = class SubjectController {
    constructor(subjectService) {
        this.subjectService = subjectService;
    }
    async create(createSubjectDto) {
        const subject = await this.subjectService.create(createSubjectDto);
        return { message: 'Subject created successfully', details: subject };
    }
    async findAll(getAllDto) {
        const { items, meta } = await this.subjectService.findAll(getAllDto);
        return {
            message: 'Subjects fetched successfully',
            details: items,
            extra: meta,
        };
    }
    async findOne(paramIdDto) {
        const subject = await this.subjectService.findOne(paramIdDto);
        return { message: 'Subject fetched successfully', details: subject };
    }
    async update(paramIdDto, updateSubjectDto) {
        const subject = await this.subjectService.update(paramIdDto, updateSubjectDto);
        return { message: 'Subject updated successfully', details: subject };
    }
    async remove(paramIdDto) {
        await this.subjectService.remove(paramIdDto);
        return { message: 'Subject deleted successfully' };
    }
};
exports.SubjectController = SubjectController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.SUPER_ADMIN),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_subject_dto_1.CreateSubjectDto]),
    __metadata("design:returntype", Promise)
], SubjectController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [getAll_dto_1.GetAllDto]),
    __metadata("design:returntype", Promise)
], SubjectController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto]),
    __metadata("design:returntype", Promise)
], SubjectController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.SUPER_ADMIN),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto,
        update_subject_dto_1.UpdateSubjectDto]),
    __metadata("design:returntype", Promise)
], SubjectController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto]),
    __metadata("design:returntype", Promise)
], SubjectController.prototype, "remove", null);
exports.SubjectController = SubjectController = __decorate([
    (0, common_1.Controller)('subject'),
    __metadata("design:paramtypes", [subject_service_1.SubjectService])
], SubjectController);
//# sourceMappingURL=subject.controller.js.map