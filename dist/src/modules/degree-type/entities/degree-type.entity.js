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
exports.DegreeType = void 0;
const education_entity_1 = require("../../education/entities/education.entity");
const typeorm_1 = require("typeorm");
let DegreeType = class DegreeType extends typeorm_1.BaseEntity {
};
exports.DegreeType = DegreeType;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DegreeType.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DegreeType.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], DegreeType.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], DegreeType.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], DegreeType.prototype, "deleted_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => education_entity_1.Education, (education) => education.degree_type),
    __metadata("design:type", Array)
], DegreeType.prototype, "educations", void 0);
exports.DegreeType = DegreeType = __decorate([
    (0, typeorm_1.Entity)()
], DegreeType);
//# sourceMappingURL=degree-type.entity.js.map