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
exports.DegreeTypeController = void 0;
const common_1 = require("@nestjs/common");
const nestjs_form_data_1 = require("nestjs-form-data");
const degree_type_service_1 = require("./degree-type.service");
const authentication_guard_1 = require("../../shared/guards/authentication.guard");
const roles_guard_1 = require("../../shared/guards/roles.guard");
const user_entity_1 = require("../users/entities/user.entity");
const roles_decorator_1 = require("../../shared/decorators/roles.decorator");
const create_degree_type_dto_1 = require("./dto/create-degree-type.dto");
const update_degree_type_dto_1 = require("./dto/update-degree-type.dto");
const getAll_dto_1 = require("../../shared/dtos/getAll.dto");
const paramId_dto_1 = require("../../shared/dtos/paramId.dto");
let DegreeTypeController = class DegreeTypeController {
    constructor(degreeTypeService) {
        this.degreeTypeService = degreeTypeService;
    }
    async create(createDegreeTypeDto) {
        const degreeType = await this.degreeTypeService.create(createDegreeTypeDto);
        return {
            message: 'Degree type created successfully',
            details: degreeType,
        };
    }
    async findAll(getAllDto) {
        const { items, meta } = await this.degreeTypeService.findAll(getAllDto);
        return {
            message: 'Degree types fetched successfully',
            details: items,
            extra: meta
        };
    }
    async findOne(paramIdDto) {
        const degreeType = await this.degreeTypeService.findOne(paramIdDto);
        return {
            message: 'Degree type fetched successfully',
            details: degreeType,
        };
    }
    async update(paramIdDto, updateDegreeTypeDto) {
        const updatedDegreeType = await this.degreeTypeService.update(paramIdDto, updateDegreeTypeDto);
        return {
            message: 'Degree type updated successfully',
            details: updatedDegreeType,
        };
    }
};
exports.DegreeTypeController = DegreeTypeController;
__decorate([
    (0, common_1.Post)('create'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.ADMIN),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_degree_type_dto_1.CreateDegreeTypeDto]),
    __metadata("design:returntype", Promise)
], DegreeTypeController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('all'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [getAll_dto_1.GetAllDto]),
    __metadata("design:returntype", Promise)
], DegreeTypeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto]),
    __metadata("design:returntype", Promise)
], DegreeTypeController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.ADMIN),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Param)()),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto,
        update_degree_type_dto_1.UpdateDegreeTypeDto]),
    __metadata("design:returntype", Promise)
], DegreeTypeController.prototype, "update", null);
exports.DegreeTypeController = DegreeTypeController = __decorate([
    (0, common_1.Controller)('degree-type'),
    __metadata("design:paramtypes", [degree_type_service_1.DegreeTypeService])
], DegreeTypeController);
//# sourceMappingURL=degree-type.controller.js.map