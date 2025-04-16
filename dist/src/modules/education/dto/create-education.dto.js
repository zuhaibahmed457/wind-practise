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
exports.CreateEducationDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const dayjs = require("dayjs");
class CreateEducationDto {
}
exports.CreateEducationDto = CreateEducationDto;
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => `${value?.slice(0, 1)?.toUpperCase()}${value?.slice(1)?.toLowerCase()}`.trim()),
    (0, class_validator_1.Matches)(/^[^!@#$%^&*(),.?":{}|<>]*$/, {
        message: 'school name should not contain special characters!',
    }),
    (0, class_validator_1.Length)(3, 50, {
        message: 'school name must be 3 to 50 characters long',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateEducationDto.prototype, "school", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEducationDto.prototype, "field", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_transformer_1.Transform)(({ value }) => dayjs(value).toISOString()),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateEducationDto.prototype, "start_date", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_transformer_1.Transform)(({ value }) => dayjs(value).toISOString()),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateEducationDto.prototype, "end_date", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEducationDto.prototype, "grade", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEducationDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsUUID)('all', { message: 'Invalid id' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEducationDto.prototype, "degree_type_id", void 0);
//# sourceMappingURL=create-education.dto.js.map