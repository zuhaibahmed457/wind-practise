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
exports.Education = void 0;
const degree_type_entity_1 = require("../../degree-type/entities/degree-type.entity");
const profile_details_entity_1 = require("../../profile-details/entities/profile-details.entity");
const typeorm_1 = require("typeorm");
let Education = class Education extends typeorm_1.BaseEntity {
};
exports.Education = Education;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Education.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Education.prototype, "school", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Education.prototype, "field", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Education.prototype, "start_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Education.prototype, "end_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Education.prototype, "grade", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], Education.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Education.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Education.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], Education.prototype, "deleted_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => profile_details_entity_1.ProfileDetails, (profileDetails) => profileDetails.educations, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'profile_detail_id' }),
    __metadata("design:type", profile_details_entity_1.ProfileDetails)
], Education.prototype, "profile_details", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => degree_type_entity_1.DegreeType, (degree) => degree.educations, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'degree_type_id' }),
    __metadata("design:type", Array)
], Education.prototype, "degree_type", void 0);
exports.Education = Education = __decorate([
    (0, typeorm_1.Entity)()
], Education);
//# sourceMappingURL=education.entity.js.map