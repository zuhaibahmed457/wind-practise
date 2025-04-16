"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobApplicantModule = void 0;
const common_1 = require("@nestjs/common");
const job_applicant_service_1 = require("./job_applicant.service");
const job_applicant_controller_1 = require("./job_applicant.controller");
const typeorm_1 = require("@nestjs/typeorm");
const job_applicant_entity_1 = require("./entities/job_applicant.entity");
const job_post_entity_1 = require("../job-post/entities/job-post.entity");
const shared_module_1 = require("../../shared/shared.module");
const access_request_entity_1 = require("../access-request/entities/access-request.entity");
let JobApplicantModule = class JobApplicantModule {
};
exports.JobApplicantModule = JobApplicantModule;
exports.JobApplicantModule = JobApplicantModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([job_applicant_entity_1.JobApplicant, job_post_entity_1.JobPost, access_request_entity_1.AccessRequest]), shared_module_1.SharedModule],
        controllers: [job_applicant_controller_1.JobApplicantController],
        providers: [job_applicant_service_1.JobApplicantService],
    })
], JobApplicantModule);
//# sourceMappingURL=job_applicant.module.js.map