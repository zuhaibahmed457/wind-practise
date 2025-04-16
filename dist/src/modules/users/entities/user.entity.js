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
exports.User = exports.UserCardStatus = exports.UserStatus = exports.UserRole = void 0;
const login_attempt_entity_1 = require("../../auth/entities/login-attempt.entity");
const typeorm_1 = require("typeorm");
const bcrypt = require("bcrypt");
const otp_entity_1 = require("../../auth/entities/otp.entity");
const designation_entity_1 = require("../../designation/entities/designation.entity");
const employment_type_entity_1 = require("../../employment-type/entities/employment-type.entity");
const profile_details_entity_1 = require("../../profile-details/entities/profile-details.entity");
const subscription_entity_1 = require("../../subscriptions/entities/subscription.entity");
const job_post_entity_1 = require("../../job-post/entities/job-post.entity");
const user_notification_entity_1 = require("../../notifications/entities/user-notification.entity");
const user_notification_setting_entity_1 = require("../../notifications/entities/user-notification-setting.entity");
const access_request_entity_1 = require("../../access-request/entities/access-request.entity");
var UserRole;
(function (UserRole) {
    UserRole["SUPER_ADMIN"] = "super_admin";
    UserRole["ADMIN"] = "admin";
    UserRole["ORGANIZATION"] = "organization";
    UserRole["EMPLOYEE"] = "employee";
    UserRole["TECHNICIAN"] = "technician";
})(UserRole || (exports.UserRole = UserRole = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "active";
    UserStatus["INACTIVE"] = "inactive";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
var UserCardStatus;
(function (UserCardStatus) {
    UserCardStatus["NO_CARD"] = "no_card";
    UserCardStatus["INACTIVE"] = "inactive";
    UserCardStatus["ACTIVE"] = "active";
})(UserCardStatus || (exports.UserCardStatus = UserCardStatus = {}));
let User = class User extends typeorm_1.BaseEntity {
    async hashPassword() {
        if (this.password) {
            const salt = await bcrypt.genSalt();
            this.password = await bcrypt.hash(this.password, salt);
        }
    }
    async createfullName() {
        if (this.first_name && this.last_name) {
            this.full_name = `${this.first_name} ${this.last_name}`;
        }
    }
    async comparePassword(receivedPassword) {
        return bcrypt.compare(receivedPassword, this.password);
    }
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "profile_image", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "banner_image", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "first_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "last_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "full_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "phone_no", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ select: false, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "stripe_customer_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: UserRole, default: UserRole.TECHNICIAN }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE }),
    __metadata("design:type", String)
], User.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "has_used_free_trial", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "has_taken_subscription", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "time_zone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "deleted_at", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => login_attempt_entity_1.LoginAttempt, (loginAttempt) => loginAttempt.user),
    __metadata("design:type", Array)
], User.prototype, "login_attempts", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => otp_entity_1.Otp, (otp) => otp.user),
    __metadata("design:type", Array)
], User.prototype, "otps", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => designation_entity_1.Designation, (designation) => designation.created_by),
    __metadata("design:type", Array)
], User.prototype, "designations", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => employment_type_entity_1.EmploymentType, (employment) => employment.created_by),
    __metadata("design:type", Array)
], User.prototype, "employment_types", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => profile_details_entity_1.ProfileDetails, (profileDetails) => profileDetails.user),
    __metadata("design:type", profile_details_entity_1.ProfileDetails)
], User.prototype, "profile_detail", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_notification_setting_entity_1.UserNotificationSetting, (userNotificationSetting) => userNotificationSetting.user),
    __metadata("design:type", user_notification_setting_entity_1.UserNotificationSetting)
], User.prototype, "user_notification_setting", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => subscription_entity_1.Subscription, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'latest_subscription_id' }),
    __metadata("design:type", subscription_entity_1.Subscription)
], User.prototype, "latest_subscription", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => job_post_entity_1.JobPost, (job) => job.user),
    __metadata("design:type", Array)
], User.prototype, "job_post", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User, (user) => user.created_employees, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", User)
], User.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => User, (user) => user.created_by),
    __metadata("design:type", Array)
], User.prototype, "created_employees", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_notification_entity_1.UserNotification, (userNotification) => userNotification.user),
    __metadata("design:type", Array)
], User.prototype, "user_notifications", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => access_request_entity_1.AccessRequest, (request) => request.requested_by),
    __metadata("design:type", Array)
], User.prototype, "access_requests", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], User.prototype, "hashPassword", null);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], User.prototype, "createfullName", null);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('user')
], User);
//# sourceMappingURL=user.entity.js.map