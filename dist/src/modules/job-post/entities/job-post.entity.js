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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobPost = exports.JobStatus = void 0;
const designation_entity_1 = require("../../designation/entities/designation.entity");
const employment_type_entity_1 = require("../../employment-type/entities/employment-type.entity");
const job_applicant_entity_1 = require("../../job_applicant/entities/job_applicant.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const typeorm_1 = require("typeorm");
var JobStatus;
(function (JobStatus) {
    JobStatus["ACITVE"] = "active";
    JobStatus["INACTIVE"] = "inactive";
})(JobStatus || (exports.JobStatus = JobStatus = {}));
let JobPost = class JobPost extends typeorm_1.BaseEntity {
};
exports.JobPost = JobPost;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], JobPost.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], JobPost.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], JobPost.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], JobPost.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], JobPost.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], JobPost.prototype, "min_salary", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], JobPost.prototype, "max_salary", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], JobPost.prototype, "min_experience", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], JobPost.prototype, "max_experience", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { array: true, nullable: true }),
    __metadata("design:type", Array)
], JobPost.prototype, "qualification", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], JobPost.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: JobStatus,
        default: JobStatus.ACITVE,
    }),
    __metadata("design:type", String)
], JobPost.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'boolean',
        default: false,
    }),
    __metadata("design:type", Boolean)
], JobPost.prototype, "is_archive", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, default: 0 }),
    __metadata("design:type", Number)
], JobPost.prototype, "applicant_count", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], JobPost.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], JobPost.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], JobPost.prototype, "deleted_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.job_post),
    (0, typeorm_1.JoinColumn)({ name: 'organization_id' }),
    __metadata("design:type", user_entity_1.User)
], JobPost.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => employment_type_entity_1.EmploymentType, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], JobPost.prototype, "job_type", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => designation_entity_1.Designation, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], JobPost.prototype, "designation_type", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => job_applicant_entity_1.JobApplicant, (applicant) => applicant.job_post),
    __metadata("design:type", Array)
], JobPost.prototype, "job_applicants", void 0);
exports.JobPost = JobPost = __decorate([
    (0, typeorm_1.Entity)('job-post')
], JobPost);
//# sourceMappingURL=job-post.entity.js.map