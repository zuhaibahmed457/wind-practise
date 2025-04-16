"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobPostModule = void 0;
const common_1 = require("@nestjs/common");
const job_post_service_1 = require("./job-post.service");
const job_post_controller_1 = require("./job-post.controller");
const typeorm_1 = require("@nestjs/typeorm");
const job_post_entity_1 = require("./entities/job-post.entity");
const shared_module_1 = require("../../shared/shared.module");
const designation_entity_1 = require("../designation/entities/designation.entity");
const employment_type_entity_1 = require("../employment-type/entities/employment-type.entity");
const notifications_module_1 = require("../notifications/notifications.module");
let JobPostModule = class JobPostModule {
};
exports.JobPostModule = JobPostModule;
exports.JobPostModule = JobPostModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([job_post_entity_1.JobPost, designation_entity_1.Designation, employment_type_entity_1.EmploymentType]), shared_module_1.SharedModule, notifications_module_1.NotificationsModule],
        controllers: [job_post_controller_1.JobPostController],
        providers: [job_post_service_1.JobPostService],
    })
], JobPostModule);
//# sourceMappingURL=job-post.module.js.map