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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificatesController = void 0;
const common_1 = require("@nestjs/common");
const certificates_service_1 = require("./certificates.service");
const create_certificate_dto_1 = require("./dto/create-certificate.dto");
const update_certificate_dto_1 = require("./dto/update-certificate.dto");
const authentication_guard_1 = require("../../shared/guards/authentication.guard");
const roles_guard_1 = require("../../shared/guards/roles.guard");
const roles_decorator_1 = require("../../shared/decorators/roles.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const current_user_decorator_1 = require("../../shared/decorators/current-user.decorator");
const paramId_dto_1 = require("../../shared/dtos/paramId.dto");
const nestjs_form_data_1 = require("nestjs-form-data");
const get_all_certificates_dto_1 = require("./dto/get-all-certificates.dto");
const get_all_certificate_history_dto_1 = require("./dto/get-all-certificate-history.dto");
const access_request_guard_1 = require("../../shared/guards/access-request.guard");
const optionalAuthentication_guard_1 = require("../../shared/guards/optionalAuthentication.guard");
const get_one_certificate_dto_1 = require("./dto/get-one.certificate.dto");
let CertificatesController = class CertificatesController {
    constructor(certificatesService) {
        this.certificatesService = certificatesService;
    }
    async create(currentUser, createCertificateDto) {
        const certificate = await this.certificatesService.create(currentUser, createCertificateDto);
        return {
            message: 'Certificate created successfully',
            details: certificate,
        };
    }
    async findAll(getAllCertificatesDto, currentUser) {
        const { meta, items } = await this.certificatesService.findAll(getAllCertificatesDto, currentUser);
        return {
            message: 'Certificate fetched successfully',
            details: items,
            extra: meta,
        };
    }
    async findOne(paramIdDto, getOneCertificateDto, currentUser) {
        const certificate = await this.certificatesService.findOne(paramIdDto, currentUser);
        return {
            message: 'Certificate fetched successfully',
            details: certificate,
        };
    }
    async findCertificateHistory(paramIdDto, currentUser, getAllCertificateHistoryDto) {
        const certificate = await this.certificatesService.getAllCertificateHistory(paramIdDto, currentUser, getAllCertificateHistoryDto);
        return {
            message: 'Certificate fetched successfully',
            details: certificate,
        };
    }
    async update(paramIdDto, currentUser, updateCertificateDto) {
        const certificate = await this.certificatesService.update(paramIdDto, currentUser, updateCertificateDto);
        return {
            message: 'Certificate Updated successfully',
            details: certificate,
        };
    }
    async remove(paramIdDto, user) {
        const certificate = await this.certificatesService.remove(paramIdDto, user);
        return {
            message: 'Certificate delete successfully',
            details: certificate,
        };
    }
};
exports.CertificatesController = CertificatesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.ORGANIZATION, user_entity_1.UserRole.TECHNICIAN),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        create_certificate_dto_1.CreateCertificateDto]),
    __metadata("design:returntype", Promise)
], CertificatesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(optionalAuthentication_guard_1.OptionalAuthGuard, access_request_guard_1.AccessRequestGuard),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_all_certificates_dto_1.GetAllCertificatesDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], CertificatesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(optionalAuthentication_guard_1.OptionalAuthGuard, access_request_guard_1.AccessRequestGuard),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto,
        get_one_certificate_dto_1.GetOneCertificateDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], CertificatesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('certificate-history/:id'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.ORGANIZATION, user_entity_1.UserRole.TECHNICIAN),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto,
        user_entity_1.User,
        get_all_certificate_history_dto_1.GetAllCertificateHistoryDto]),
    __metadata("design:returntype", Promise)
], CertificatesController.prototype, "findCertificateHistory", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.ORGANIZATION, user_entity_1.UserRole.TECHNICIAN),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto,
        user_entity_1.User,
        update_certificate_dto_1.UpdateCertificateDto]),
    __metadata("design:returntype", Promise)
], CertificatesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.ORGANIZATION, user_entity_1.UserRole.TECHNICIAN),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], CertificatesController.prototype, "remove", null);
exports.CertificatesController = CertificatesController = __decorate([
    (0, common_1.Controller)('certificates'),
    __metadata("design:paramtypes", [certificates_service_1.CertificatesService])
], CertificatesController);
//# sourceMappingURL=certificates.controller.js.map