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
exports.JobApplicantController = void 0;
const common_1 = require("@nestjs/common");
const job_applicant_service_1 = require("./job_applicant.service");
const apply_job_applicant_dto_1 = require("./dto/apply-job_applicant.dto");
const authentication_guard_1 = require("../../shared/guards/authentication.guard");
const roles_guard_1 = require("../../shared/guards/roles.guard");
const roles_decorator_1 = require("../../shared/decorators/roles.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const nestjs_form_data_1 = require("nestjs-form-data");
const current_user_decorator_1 = require("../../shared/decorators/current-user.decorator");
const get_all_apply_job_dto_1 = require("./dto/get-all-apply-job.dto");
const paramId_dto_1 = require("../../shared/dtos/paramId.dto");
const get_all_applicants_dto_1 = require("./dto/get-all-applicants.dto");
const manage_job_applicant_status_dto_1 = require("./dto/manage-job-applicant-status.dto");
const text_capitalize_1 = require("../../utils/text-capitalize");
let JobApplicantController = class JobApplicantController {
    constructor(jobApplicantService) {
        this.jobApplicantService = jobApplicantService;
    }
    async applyJob(applyJobApplicantDto, currentUser) {
        const appliedJob = await this.jobApplicantService.applyJob(applyJobApplicantDto, currentUser);
        return {
            message: 'Applied successfully',
            details: appliedJob,
        };
    }
    async getAllAppliedJobs(getAllApplyJobDto, currentUser) {
        const { items, meta } = await this.jobApplicantService.getAllAppliedJobs(getAllApplyJobDto, currentUser);
        return {
            message: 'Applied Jobs fetched successfully',
            details: items,
            extra: meta,
        };
    }
    async getAppliedJob(paramIdDto, currentUser) {
        const appliedJob = await this.jobApplicantService.getAppliedJob(paramIdDto, currentUser);
        return {
            message: 'Applied Job fetched successfully',
            details: appliedJob,
        };
    }
    async findAll(getAllApplicantsDto, currentUser) {
        const { items, meta } = await this.jobApplicantService.findAll(getAllApplicantsDto, currentUser);
        return {
            message: 'Job Applicants fetched successfully',
            details: items,
            extra: meta,
        };
    }
    async findOne(paramIdDto, currentUser) {
        const applicantDetails = await this.jobApplicantService.findOne(paramIdDto, currentUser);
        return {
            message: 'Applicants Details fetched successfully',
            details: applicantDetails,
        };
    }
    async manageStatus(paramIdDto, manageJobApplicantStatusDto, currentUser) {
        const updateJobApplicantStatus = await this.jobApplicantService.manageStatus(paramIdDto, manageJobApplicantStatusDto, currentUser);
        return {
            message: `${(0, text_capitalize_1.textCapitalize)(manageJobApplicantStatusDto.status)} successfully`,
            details: updateJobApplicantStatus,
        };
    }
};
exports.JobApplicantController = JobApplicantController;
__decorate([
    (0, common_1.Post)('apply'),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.TECHNICIAN),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [apply_job_applicant_dto_1.ApplyJobApplicantDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], JobApplicantController.prototype, "applyJob", null);
__decorate([
    (0, common_1.Get)('applied-jobs'),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.TECHNICIAN),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_all_apply_job_dto_1.GetAllApplyJobDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], JobApplicantController.prototype, "getAllAppliedJobs", null);
__decorate([
    (0, common_1.Get)('applied-job/:id'),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.TECHNICIAN),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], JobApplicantController.prototype, "getAppliedJob", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.ORGANIZATION),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_all_applicants_dto_1.GetAllApplicantsDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], JobApplicantController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.ORGANIZATION),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], JobApplicantController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)('manage-status/:id'),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.ORGANIZATION),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto,
        manage_job_applicant_status_dto_1.ManageJobApplicantStatusDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], JobApplicantController.prototype, "manageStatus", null);
exports.JobApplicantController = JobApplicantController = __decorate([
    (0, common_1.Controller)('job-applicant'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [job_applicant_service_1.JobApplicantService])
], JobApplicantController);
//# sourceMappingURL=job_applicant.controller.js.map