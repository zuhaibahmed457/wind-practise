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
exports.ProfileDetails = void 0;
const designation_entity_1 = require("../../designation/entities/designation.entity");
const employment_type_entity_1 = require("../../employment-type/entities/employment-type.entity");
const typeorm_1 = require("typeorm");
const skill_entity_1 = require("../../skills/entities/skill.entity");
const education_entity_1 = require("../../education/entities/education.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const portfolio_entity_1 = require("../../portfolio/entities/portfolio.entity");
const job_applicant_entity_1 = require("../../job_applicant/entities/job_applicant.entity");
const access_request_entity_1 = require("../../access-request/entities/access-request.entity");
let ProfileDetails = class ProfileDetails extends typeorm_1.BaseEntity {
};
exports.ProfileDetails = ProfileDetails;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ProfileDetails.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ProfileDetails.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ProfileDetails.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ProfileDetails.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ProfileDetails.prototype, "tagline", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ProfileDetails.prototype, "about", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], ProfileDetails.prototype, "join_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ProfileDetails.prototype, "linkedin_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ProfileDetails.prototype, "facebook_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ProfileDetails.prototype, "twitter_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ProfileDetails.prototype, "website_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], ProfileDetails.prototype, "soonest_expiring_certificate_date", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ProfileDetails.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ProfileDetails.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], ProfileDetails.prototype, "deleted_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => designation_entity_1.Designation, (designation) => designation.profile_details, {
        nullable: true,
        onDelete: 'SET NULL',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'designation_id' }),
    __metadata("design:type", designation_entity_1.Designation)
], ProfileDetails.prototype, "designation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employment_type_entity_1.EmploymentType, (employmentType) => employmentType.profile_details, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'employment_type_id' }),
    __metadata("design:type", employment_type_entity_1.EmploymentType)
], ProfileDetails.prototype, "employment_type", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => education_entity_1.Education, (education) => education.profile_details),
    __metadata("design:type", Array)
], ProfileDetails.prototype, "educations", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => skill_entity_1.Skill, (skill) => skill.profile_details),
    __metadata("design:type", Array)
], ProfileDetails.prototype, "skills", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => portfolio_entity_1.Portfolio, (portfolio) => portfolio.profile_details),
    __metadata("design:type", Array)
], ProfileDetails.prototype, "portfolio", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => job_applicant_entity_1.JobApplicant, (applicant) => applicant.profile_detail),
    __metadata("design:type", Array)
], ProfileDetails.prototype, "job_applicants", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => access_request_entity_1.AccessRequest, (request) => request.requested_from),
    __metadata("design:type", Array)
], ProfileDetails.prototype, "access_requests", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User, (user) => user.profile_detail, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], ProfileDetails.prototype, "user", void 0);
exports.ProfileDetails = ProfileDetails = __decorate([
    (0, typeorm_1.Entity)('profile_details')
], ProfileDetails);
//# sourceMappingURL=profile-details.entity.js.map