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
exports.CreateJobPostDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const capatilize_each_word_1 = require("../../../utils/capatilize-each-word");
class CreateJobPostDto {
}
exports.CreateJobPostDto = CreateJobPostDto;
__decorate([
    (0, class_transformer_1.Transform)(capatilize_each_word_1.capitalize),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateJobPostDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateJobPostDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateJobPostDto.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateJobPostDto.prototype, "country", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)({ message: 'salary should be positive' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateJobPostDto.prototype, "min_salary", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)({ message: 'salary should be positive' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateJobPostDto.prototype, "max_salary", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)({ message: 'number should be positive' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateJobPostDto.prototype, "min_experience", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)({ message: 'number should be positive' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateJobPostDto.prototype, "max_experience", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateJobPostDto.prototype, "qualification", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateJobPostDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('all', { each: true }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], CreateJobPostDto.prototype, "job_type_id", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('all', { each: true }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], CreateJobPostDto.prototype, "designation_id", void 0);
//# sourceMappingURL=create-job-post.dto.js.map