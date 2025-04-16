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
exports.CreatePlanDto = void 0;
const class_validator_1 = require("class-validator");
const plan_entity_1 = require("../entities/plan.entity");
const common_1 = require("@nestjs/common");
class CreatePlanDto {
}
exports.CreatePlanDto = CreatePlanDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePlanDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePlanDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(plan_entity_1.PlanType),
    __metadata("design:type", String)
], CreatePlanDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(plan_entity_1.PlanFor),
    __metadata("design:type", String)
], CreatePlanDto.prototype, "for", void 0);
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.IsArray)({ message: 'At least one feature is required' }),
    __metadata("design:type", Array)
], CreatePlanDto.prototype, "features", void 0);
__decorate([
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(365),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.ValidateIf)((o) => {
        if (o.type === plan_entity_1.PlanType.FREE) {
            return true;
        }
        else if (o.free_duration) {
            throw new common_1.BadRequestException('Free duration is not allowed for paid plans');
        }
    }),
    __metadata("design:type", Number)
], CreatePlanDto.prototype, "free_duration", void 0);
__decorate([
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.ValidateIf)((o) => {
        if (o.type !== plan_entity_1.PlanType.FREE) {
            return true;
        }
        else if (o.price) {
            throw new common_1.BadRequestException('Price is not allowed for free plans');
        }
    }),
    __metadata("design:type", Number)
], CreatePlanDto.prototype, "price", void 0);
__decorate([
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(365),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateIf)((o) => {
        if (o.for === plan_entity_1.PlanFor.ORGANIZATION) {
            return true;
        }
        else if (o.number_of_employees_allowed) {
            throw new common_1.BadRequestException('Number of employees field is not allowed');
        }
    }),
    __metadata("design:type", Number)
], CreatePlanDto.prototype, "number_of_employees_allowed", void 0);
//# sourceMappingURL=create-plan.dto.js.map