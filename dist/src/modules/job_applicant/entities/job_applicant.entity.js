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
exports.JobApplicant = exports.JobApplicantStatus = void 0;
const job_post_entity_1 = require("../../job-post/entities/job-post.entity");
const profile_details_entity_1 = require("../../profile-details/entities/profile-details.entity");
const typeorm_1 = require("typeorm");
var JobApplicantStatus;
(function (JobApplicantStatus) {
    JobApplicantStatus["APPLIED"] = "applied";
    JobApplicantStatus["VIEWED"] = "viewed";
    JobApplicantStatus["ACCEPT"] = "accept";
    JobApplicantStatus["REJECT"] = "reject";
})(JobApplicantStatus || (exports.JobApplicantStatus = JobApplicantStatus = {}));
let JobApplicant = class JobApplicant extends typeorm_1.BaseEntity {
};
exports.JobApplicant = JobApplicant;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], JobApplicant.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: JobApplicantStatus,
        default: JobApplicantStatus.APPLIED,
    }),
    __metadata("design:type", String)
], JobApplicant.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], JobApplicant.prototype, "applied_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => job_post_entity_1.JobPost, (jobPost) => jobPost.job_applicants, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'job_post_id' }),
    __metadata("design:type", job_post_entity_1.JobPost)
], JobApplicant.prototype, "job_post", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => profile_details_entity_1.ProfileDetails, (profile) => profile.job_applicants, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'profile_details_id' }),
    __metadata("design:type", profile_details_entity_1.ProfileDetails)
], JobApplicant.prototype, "profile_detail", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], JobApplicant.prototype, "feedback", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], JobApplicant.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], JobApplicant.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], JobApplicant.prototype, "deleted_at", void 0);
exports.JobApplicant = JobApplicant = __decorate([
    (0, typeorm_1.Entity)('job_applicant')
], JobApplicant);
//# sourceMappingURL=job_applicant.entity.js.map