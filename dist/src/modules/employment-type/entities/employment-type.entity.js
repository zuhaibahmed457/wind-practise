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
exports.EmploymentType = exports.EmploymentTypeStatus = void 0;
const profile_details_entity_1 = require("../../profile-details/entities/profile-details.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const typeorm_1 = require("typeorm");
var EmploymentTypeStatus;
(function (EmploymentTypeStatus) {
    EmploymentTypeStatus["ACTIVE"] = "active";
    EmploymentTypeStatus["INACTIVE"] = "inactive";
})(EmploymentTypeStatus || (exports.EmploymentTypeStatus = EmploymentTypeStatus = {}));
let EmploymentType = class EmploymentType extends typeorm_1.BaseEntity {
};
exports.EmploymentType = EmploymentType;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], EmploymentType.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], EmploymentType.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], EmploymentType.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: EmploymentTypeStatus,
        default: EmploymentTypeStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], EmploymentType.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], EmploymentType.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], EmploymentType.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], EmploymentType.prototype, "deleted_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.employment_types, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], EmploymentType.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => profile_details_entity_1.ProfileDetails, (profile) => profile.employment_type),
    __metadata("design:type", Array)
], EmploymentType.prototype, "profile_details", void 0);
exports.EmploymentType = EmploymentType = __decorate([
    (0, typeorm_1.Entity)('employment_types')
], EmploymentType);
//# sourceMappingURL=employment-type.entity.js.map