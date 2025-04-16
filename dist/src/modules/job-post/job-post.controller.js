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
exports.JobPostController = void 0;
const common_1 = require("@nestjs/common");
const job_post_service_1 = require("./job-post.service");
const create_job_post_dto_1 = require("./dto/create-job-post.dto");
const update_job_post_dto_1 = require("./dto/update-job-post.dto");
const nestjs_form_data_1 = require("nestjs-form-data");
const current_user_decorator_1 = require("../../shared/decorators/current-user.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const authentication_guard_1 = require("../../shared/guards/authentication.guard");
const roles_guard_1 = require("../../shared/guards/roles.guard");
const roles_decorator_1 = require("../../shared/decorators/roles.decorator");
const get_all_job_post_dto_1 = require("./dto/get-all-job-post.dto");
const paramId_dto_1 = require("../../shared/dtos/paramId.dto");
const manage_job_post_status_dto_1 = require("./dto/manage-job-post-status.dto");
const text_capitalize_1 = require("../../utils/text-capitalize");
const toggle_archive_dto_1 = require("./dto/toggle-archive.dto");
let JobPostController = class JobPostController {
    constructor(jobPostService) {
        this.jobPostService = jobPostService;
    }
    async create(createJobPostDto, currentUser) {
        const jobPost = await this.jobPostService.create(createJobPostDto, currentUser);
        return {
            message: 'Job Post created successfully',
            details: jobPost,
        };
    }
    async findAll(getAllJobPostDto, currentUser) {
        const { items, meta } = await this.jobPostService.findAll(getAllJobPostDto, currentUser);
        return {
            message: 'Posted jobs feteched succesfully',
            details: items,
            extra: meta,
        };
    }
    async findOne(paramIdDto, currentUser) {
        const jobPost = await this.jobPostService.findOne(paramIdDto, currentUser);
        return {
            message: 'Posted job feteched succesfully',
            details: jobPost,
        };
    }
    async update(paramIdDto, currentUser, updateJobPostDto) {
        const jobPost = await this.jobPostService.update(paramIdDto, currentUser, updateJobPostDto);
        return {
            message: 'Job post updated successfully',
            details: jobPost,
        };
    }
    async toggleArchive(paramDto, toggleArchiveDto, user) {
        const updatedJobPost = await this.jobPostService.toggleArchive(paramDto, toggleArchiveDto, user);
        return {
            message: `${(0, text_capitalize_1.textCapitalize)(toggleArchiveDto.is_archive === true ? 'archived' : 'unarchived')} job post successfully`,
            details: updatedJobPost,
        };
    }
    async manage_status(paramDto, manageJobPostStatusDto, user) {
        const updatedJobPost = await this.jobPostService.manageStatus(paramDto, manageJobPostStatusDto, user);
        return {
            message: `${(0, text_capitalize_1.textCapitalize)(manageJobPostStatusDto.status)} successfully`,
            details: updatedJobPost,
        };
    }
    async remove(paramIdDto, currentUser) {
        await this.jobPostService.remove(paramIdDto, currentUser);
        return {
            message: 'Job post deleted successfully',
        };
    }
};
exports.JobPostController = JobPostController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.ORGANIZATION),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_job_post_dto_1.CreateJobPostDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], JobPostController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_all_job_post_dto_1.GetAllJobPostDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], JobPostController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], JobPostController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.ORGANIZATION),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto,
        user_entity_1.User,
        update_job_post_dto_1.UpdateJobPostDto]),
    __metadata("design:returntype", Promise)
], JobPostController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)('toggle-archive/:id'),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.ORGANIZATION),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto,
        toggle_archive_dto_1.ToggleArchiveDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], JobPostController.prototype, "toggleArchive", null);
__decorate([
    (0, common_1.Patch)('manage-status/:id'),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.ADMIN),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto,
        manage_job_post_status_dto_1.ManageJobPostStatusDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], JobPostController.prototype, "manage_status", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.ORGANIZATION),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], JobPostController.prototype, "remove", null);
exports.JobPostController = JobPostController = __decorate([
    (0, common_1.Controller)('job-post'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [job_post_service_1.JobPostService])
], JobPostController);
//# sourceMappingURL=job-post.controller.js.map