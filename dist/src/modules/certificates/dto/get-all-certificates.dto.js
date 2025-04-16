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
exports.GetAllCertificatesDto = exports.CertificateStatus = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const getAll_dto_1 = require("../../../shared/dtos/getAll.dto");
const dayjs = require("dayjs");
var CertificateStatus;
(function (CertificateStatus) {
    CertificateStatus["VALID"] = "valid";
    CertificateStatus["EXPIRED"] = "expired";
    CertificateStatus["EXPIRING_SOON"] = "expiring_soon";
})(CertificateStatus || (exports.CertificateStatus = CertificateStatus = {}));
class GetAllCertificatesDto extends getAll_dto_1.GetAllDto {
}
exports.GetAllCertificatesDto = GetAllCertificatesDto;
__decorate([
    (0, class_validator_1.IsUUID)('all', { message: 'Invalid id' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetAllCertificatesDto.prototype, "profile_details_id", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(CertificateStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetAllCertificatesDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsIn)(['name', 'expiration_date', 'issuing_date', 'created_at']),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetAllCertificatesDto.prototype, "sort", void 0);
__decorate([
    (0, class_validator_1.IsIn)(['asc', 'desc']),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetAllCertificatesDto.prototype, "order", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_transformer_1.Transform)(({ value }) => dayjs(value).toISOString()),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetAllCertificatesDto.prototype, "issue_date_from", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_transformer_1.Transform)(({ value }) => dayjs(value).toISOString()),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetAllCertificatesDto.prototype, "issue_date_to", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_transformer_1.Transform)(({ value }) => dayjs(value).toISOString()),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetAllCertificatesDto.prototype, "expiration_date_from", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_transformer_1.Transform)(({ value }) => dayjs(value).toISOString()),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetAllCertificatesDto.prototype, "expiration_date_to", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => value.toLowerCase()),
    (0, class_validator_1.IsEmail)({}, { message: 'invalid email format' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetAllCertificatesDto.prototype, "email", void 0);
//# sourceMappingURL=get-all-certificates.dto.js.map