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
exports.PortfolioController = void 0;
const common_1 = require("@nestjs/common");
const portfolio_service_1 = require("./portfolio.service");
const create_portfolio_dto_1 = require("./dto/create-portfolio.dto");
const update_portfolio_dto_1 = require("./dto/update-portfolio.dto");
const current_user_decorator_1 = require("../../shared/decorators/current-user.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const authentication_guard_1 = require("../../shared/guards/authentication.guard");
const roles_guard_1 = require("../../shared/guards/roles.guard");
const roles_decorator_1 = require("../../shared/decorators/roles.decorator");
const get_all_portfoli_dto_1 = require("./dto/get-all-portfoli.dto");
const paramId_dto_1 = require("../../shared/dtos/paramId.dto");
const nestjs_form_data_1 = require("nestjs-form-data");
const upload_media_dto_1 = require("./dto/upload-media.dto");
const delete_portfolio_media_dto_1 = require("./dto/delete-portfolio-media.dto");
const optionalAuthentication_guard_1 = require("../../shared/guards/optionalAuthentication.guard");
const access_request_guard_1 = require("../../shared/guards/access-request.guard");
const get_one_portfolio_dto_1 = require("./dto/get-one-portfolio.dto");
let PortfolioController = class PortfolioController {
    constructor(portfolioService) {
        this.portfolioService = portfolioService;
    }
    async create(createPortfolioDto, currentUser) {
        const portfolio = await this.portfolioService.create(currentUser, createPortfolioDto);
        return {
            message: 'Portfolio added successfully',
            details: portfolio,
        };
    }
    async uploadMedia(paramIdDto, uploadMediaDto, currentUser) {
        const media = await this.portfolioService.uploadMedia(paramIdDto, uploadMediaDto, currentUser);
        return {
            message: 'Media added successfully',
            details: media,
        };
    }
    async findAll(getALLPortfolioDto, currentUser) {
        const { items, meta } = await this.portfolioService.findAll(currentUser, getALLPortfolioDto);
        return {
            message: 'Porfolio feteched successfully',
            details: items,
            extra: meta,
        };
    }
    async findOne(paramIdDto, getPortfolioDto, currentUser) {
        const portfolio = await this.portfolioService.findOne(paramIdDto, currentUser);
        return {
            message: 'Porfolio feteched successfully',
            details: portfolio,
        };
    }
    async update(paramIdDto, currentUser, updatePortfolioDto) {
        const portfolio = await this.portfolioService.update(paramIdDto, currentUser, updatePortfolioDto);
        return {
            message: 'Portfolio updated successfully',
            details: portfolio,
        };
    }
    async deleteMediaFile(deletePortfolioMediaDto) {
        await this.portfolioService.deleteMediaFile(deletePortfolioMediaDto);
        return {
            message: 'File deleted successfully',
        };
    }
    async remove(paramIdDto, currentUser) {
        await this.portfolioService.remove(paramIdDto, currentUser);
        return {
            message: 'Portfolio deleted successfully',
        };
    }
};
exports.PortfolioController = PortfolioController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.TECHNICIAN),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_portfolio_dto_1.CreatePortfolioDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], PortfolioController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)('upload/:id'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.TECHNICIAN),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto,
        upload_media_dto_1.UploadMediaDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], PortfolioController.prototype, "uploadMedia", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(optionalAuthentication_guard_1.OptionalAuthGuard, access_request_guard_1.AccessRequestGuard),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_all_portfoli_dto_1.GetALLPortfolioDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], PortfolioController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(optionalAuthentication_guard_1.OptionalAuthGuard, access_request_guard_1.AccessRequestGuard),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto,
        get_one_portfolio_dto_1.GetOnePortfolioDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], PortfolioController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.TECHNICIAN),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto,
        user_entity_1.User,
        update_portfolio_dto_1.UpdatePortfolioDto]),
    __metadata("design:returntype", Promise)
], PortfolioController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('media/:id/:portfolio_id'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.TECHNICIAN),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_portfolio_media_dto_1.DeletePortfolioMediaDto]),
    __metadata("design:returntype", Promise)
], PortfolioController.prototype, "deleteMediaFile", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.TECHNICIAN),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], PortfolioController.prototype, "remove", null);
exports.PortfolioController = PortfolioController = __decorate([
    (0, common_1.Controller)('portfolio'),
    __metadata("design:paramtypes", [portfolio_service_1.PortfolioService])
], PortfolioController);
//# sourceMappingURL=portfolio.controller.js.map