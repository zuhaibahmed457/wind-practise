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
exports.GetAllEmployeeDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const user_entity_1 = require("../../users/entities/user.entity");
const getAll_dto_1 = require("../../../shared/dtos/getAll.dto");
const dayjs = require("dayjs");
class GetAllEmployeeDto extends getAll_dto_1.GetAllDto {
}
exports.GetAllEmployeeDto = GetAllEmployeeDto;
__decorate([
    (0, class_validator_1.IsEnum)(user_entity_1.UserStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetAllEmployeeDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsIn)(['ASC', 'DESC']),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetAllEmployeeDto.prototype, "order", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.IsUUID)('all', { each: true, message: 'invalid id' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], GetAllEmployeeDto.prototype, "designation_id", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.IsUUID)('all', { each: true, message: 'invalid id' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], GetAllEmployeeDto.prototype, "employment_type_id", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_transformer_1.Transform)(({ value }) => dayjs(value).toISOString()),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], GetAllEmployeeDto.prototype, "join_date_from", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_transformer_1.Transform)(({ value }) => dayjs(value).toISOString()),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], GetAllEmployeeDto.prototype, "join_date_to", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => `${value?.slice(0, 1)?.toUpperCase()}${value?.slice(1)?.toLowerCase()}`.trim()),
    (0, class_validator_1.Matches)(/^[^!@#$%^&*(),.?":{}|<>]*$/, {
        message: 'country should not contain special characters!',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetAllEmployeeDto.prototype, "country", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetAllEmployeeDto.prototype, "city", void 0);
//# sourceMappingURL=get-all-employee.dto.js.map