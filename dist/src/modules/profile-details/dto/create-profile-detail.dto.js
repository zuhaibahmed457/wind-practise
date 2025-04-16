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
exports.CreateProfileDetailDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const sign_up_dto_1 = require("../../auth/dto/sign-up.dto");
const validate_url_format_1 = require("../../../utils/validate-url-format");
class CreateProfileDetailDto extends (0, mapped_types_1.PartialType)(sign_up_dto_1.SignUpDto) {
}
exports.CreateProfileDetailDto = CreateProfileDetailDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProfileDetailDto.prototype, "phone_no", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => `${value?.slice(0, 1)?.toUpperCase()}${value?.slice(1)?.toLowerCase()}`.trim()),
    (0, class_validator_1.Matches)(/^[^!@#$%^&*(),.?":{}|<>]*$/, {
        message: 'country should not contain special characters!',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProfileDetailDto.prototype, "country", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => `${value?.slice(0, 1)?.toUpperCase()}${value?.slice(1)?.toLowerCase()}`.trim()),
    (0, class_validator_1.Matches)(/^[^!@#$%^&*(),.?":{}|<>]*$/, {
        message: 'city should not contain special characters!',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProfileDetailDto.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProfileDetailDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProfileDetailDto.prototype, "tagline", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProfileDetailDto.prototype, "about", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => value ?? ''),
    (0, class_validator_1.Validate)(validate_url_format_1.IsUrlOrEmpty),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProfileDetailDto.prototype, "linkedin_url", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => value ?? ''),
    (0, class_validator_1.Validate)(validate_url_format_1.IsUrlOrEmpty),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProfileDetailDto.prototype, "facebook_url", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => value ?? ''),
    (0, class_validator_1.Validate)(validate_url_format_1.IsUrlOrEmpty),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProfileDetailDto.prototype, "twitter_url", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => value ?? ''),
    (0, class_validator_1.Validate)(validate_url_format_1.IsUrlOrEmpty),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProfileDetailDto.prototype, "website_url", void 0);
//# sourceMappingURL=create-profile-detail.dto.js.map