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
exports.GetAllPlansDto = void 0;
const class_validator_1 = require("class-validator");
const getAll_dto_1 = require("../../../shared/dtos/getAll.dto");
const plan_entity_1 = require("../entities/plan.entity");
class GetAllPlansDto extends getAll_dto_1.GetAllDto {
}
exports.GetAllPlansDto = GetAllPlansDto;
__decorate([
    (0, class_validator_1.IsEnum)(plan_entity_1.PlanStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetAllPlansDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(plan_entity_1.PlanType, { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], GetAllPlansDto.prototype, "types", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(plan_entity_1.PlanFor, { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], GetAllPlansDto.prototype, "plan_for", void 0);
//# sourceMappingURL=get-all-plans.dto.js.map