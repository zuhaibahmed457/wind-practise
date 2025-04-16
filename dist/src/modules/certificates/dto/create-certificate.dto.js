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
exports.CreateCertificateDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const dayjs = require("dayjs");
const nestjs_form_data_1 = require("nestjs-form-data");
class CreateCertificateDto {
}
exports.CreateCertificateDto = CreateCertificateDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCertificateDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCertificateDto.prototype, "issuing_authority", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_transformer_1.Transform)(({ value }) => dayjs(value).toISOString()),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Date)
], CreateCertificateDto.prototype, "issuing_date", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_transformer_1.Transform)(({ value }) => dayjs(value).toISOString()),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Date)
], CreateCertificateDto.prototype, "expiration_date", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_transformer_1.Transform)(({ value }) => dayjs(value).toISOString()),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Date)
], CreateCertificateDto.prototype, "notification_date", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCertificateDto.prototype, "profile_details_id", void 0);
__decorate([
    (0, nestjs_form_data_1.HasExtension)(['pdf']),
    (0, nestjs_form_data_1.HasMimeType)(['application/pdf']),
    (0, nestjs_form_data_1.IsFile)({ message: 'Certificate must be a pdf' }),
    (0, nestjs_form_data_1.MaxFileSize)(5e6),
    (0, class_validator_1.IsNotEmpty)({ message: 'certificate should not be empty' }),
    __metadata("design:type", nestjs_form_data_1.MemoryStoredFile)
], CreateCertificateDto.prototype, "certificate_pdf", void 0);
//# sourceMappingURL=create-certificate.dto.js.map