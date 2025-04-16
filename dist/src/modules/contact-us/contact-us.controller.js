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
exports.ContactUsController = void 0;
const common_1 = require("@nestjs/common");
const paramId_dto_1 = require("../../shared/dtos/paramId.dto");
const getAll_dto_1 = require("../../shared/dtos/getAll.dto");
const authentication_guard_1 = require("../../shared/guards/authentication.guard");
const roles_guard_1 = require("../../shared/guards/roles.guard");
const roles_decorator_1 = require("../../shared/decorators/roles.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const contact_us_service_1 = require("./contact-us.service");
const create_contact_us_dto_1 = require("./dto/create-contact-us.dto");
const nestjs_form_data_1 = require("nestjs-form-data");
let ContactUsController = class ContactUsController {
    constructor(contactUsService) {
        this.contactUsService = contactUsService;
    }
    async create(createContactUsDto) {
        const contact = await this.contactUsService.create(createContactUsDto);
        return {
            message: 'Contact submission created successfully',
            details: contact,
        };
    }
    async findAll(getAllDto) {
        const { items, meta } = await this.contactUsService.findAll(getAllDto);
        return {
            message: 'Contact submissions fetched successfully',
            details: items,
            extra: meta,
        };
    }
    async findOne(paramIdDto) {
        const contact = await this.contactUsService.findOne(paramIdDto);
        return {
            message: 'Contact submission fetched successfully',
            details: contact,
        };
    }
    async remove(paramIdDto) {
        await this.contactUsService.remove(paramIdDto);
        return {
            message: 'Contact submission deleted successfully',
        };
    }
};
exports.ContactUsController = ContactUsController;
__decorate([
    (0, common_1.Post)(),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_contact_us_dto_1.CreateContactUsDto]),
    __metadata("design:returntype", Promise)
], ContactUsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [getAll_dto_1.GetAllDto]),
    __metadata("design:returntype", Promise)
], ContactUsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto]),
    __metadata("design:returntype", Promise)
], ContactUsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto]),
    __metadata("design:returntype", Promise)
], ContactUsController.prototype, "remove", null);
exports.ContactUsController = ContactUsController = __decorate([
    (0, common_1.Controller)('contact-us'),
    __metadata("design:paramtypes", [contact_us_service_1.ContactUsService])
], ContactUsController);
//# sourceMappingURL=contact-us.controller.js.map