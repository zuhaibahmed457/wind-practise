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
exports.SkillController = void 0;
const common_1 = require("@nestjs/common");
const nestjs_form_data_1 = require("nestjs-form-data");
const authentication_guard_1 = require("../../shared/guards/authentication.guard");
const roles_decorator_1 = require("../../shared/decorators/roles.decorator");
const roles_guard_1 = require("../../shared/guards/roles.guard");
const user_entity_1 = require("../users/entities/user.entity");
const skills_service_1 = require("./skills.service");
const create_skill_dto_1 = require("./dto/create-skill.dto");
const update_skill_dto_1 = require("./dto/update-skill.dto");
const current_user_decorator_1 = require("../../shared/decorators/current-user.decorator");
const paramId_dto_1 = require("../../shared/dtos/paramId.dto");
const get_all_skills_dto_1 = require("./dto/get-all-skills.dto");
let SkillController = class SkillController {
    constructor(skillService) {
        this.skillService = skillService;
    }
    async create(createSkillDto, currentUser) {
        const skill = await this.skillService.create(createSkillDto, currentUser);
        return {
            message: 'Skill created successfully',
            details: skill,
        };
    }
    async findAll(getAllSkillsDto, currentUser) {
        const { items, meta } = await this.skillService.findAll(getAllSkillsDto, currentUser);
        return {
            message: 'Skills fetched successfully',
            details: items,
            extra: meta,
        };
    }
    async findOne(paramIdDto, currentUser) {
        const skill = await this.skillService.findOne(paramIdDto, currentUser);
        return {
            message: 'Skill fetched successfully',
            details: skill,
        };
    }
    async update(paramIdDto, updateSkillDto, currentUser) {
        const updatedSkill = await this.skillService.update(paramIdDto, updateSkillDto, currentUser);
        return {
            message: 'Skill updated successfully',
            details: updatedSkill,
        };
    }
    async remove(paramIdDto, currentUser) {
        await this.skillService.remove(paramIdDto, currentUser);
        return {
            message: 'Skill deleted successfully',
        };
    }
};
exports.SkillController = SkillController;
__decorate([
    (0, common_1.Post)('create'),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_skill_dto_1.CreateSkillDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], SkillController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.TECHNICIAN, user_entity_1.UserRole.ORGANIZATION),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_all_skills_dto_1.GetAllSkillsDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], SkillController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.TECHNICIAN),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], SkillController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.TECHNICIAN),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto,
        update_skill_dto_1.UpdateSkillDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], SkillController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.TECHNICIAN),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], SkillController.prototype, "remove", null);
exports.SkillController = SkillController = __decorate([
    (0, common_1.Controller)('skill'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [skills_service_1.SkillService])
], SkillController);
//# sourceMappingURL=skills.controller.js.map