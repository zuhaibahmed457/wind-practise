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
exports.PublicProfileController = void 0;
const common_1 = require("@nestjs/common");
const public_profile_service_1 = require("./public-profile.service");
const paramId_dto_1 = require("../../shared/dtos/paramId.dto");
let PublicProfileController = class PublicProfileController {
    constructor(publicProfileService) {
        this.publicProfileService = publicProfileService;
    }
    async getPublicProfile(paramIdDto) {
        const userProfile = await this.publicProfileService.viewPublicProfile(paramIdDto);
        return {
            message: 'Profile fetched successfully',
            details: userProfile,
        };
    }
};
exports.PublicProfileController = PublicProfileController;
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto]),
    __metadata("design:returntype", Promise)
], PublicProfileController.prototype, "getPublicProfile", null);
exports.PublicProfileController = PublicProfileController = __decorate([
    (0, common_1.Controller)('public-profile'),
    __metadata("design:paramtypes", [public_profile_service_1.PublicProfileService])
], PublicProfileController);
//# sourceMappingURL=public-profile.controller.js.map