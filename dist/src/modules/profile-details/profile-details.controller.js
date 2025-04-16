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
exports.ProfileDetailsController = void 0;
const common_1 = require("@nestjs/common");
const profile_details_service_1 = require("./profile-details.service");
const update_profile_detail_dto_1 = require("./dto/update-profile-detail.dto");
const current_user_decorator_1 = require("../../shared/decorators/current-user.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const nestjs_form_data_1 = require("nestjs-form-data");
const authentication_guard_1 = require("../../shared/guards/authentication.guard");
const roles_guard_1 = require("../../shared/guards/roles.guard");
const roles_decorator_1 = require("../../shared/decorators/roles.decorator");
const get_all_profile_details_dto_1 = require("./dto/get-all-profile-details.dto");
let ProfileDetailsController = class ProfileDetailsController {
    constructor(profileDetailsService) {
        this.profileDetailsService = profileDetailsService;
    }
    async findAll(getAllProfileDetailsDto, currentUser) {
        const profileDetails = await this.profileDetailsService.getProfileDetails(getAllProfileDetailsDto, currentUser);
        return {
            message: 'Profile Details fetched successfully',
            details: profileDetails,
        };
    }
    async update(updateProfileDetailDto, currentUser) {
        const updatedProfileDetails = await this.profileDetailsService.updateProfileDetails(updateProfileDetailDto, currentUser);
        return {
            message: 'Profile Details updated successfully',
            details: updatedProfileDetails,
        };
    }
};
exports.ProfileDetailsController = ProfileDetailsController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.TECHNICIAN, user_entity_1.UserRole.ORGANIZATION),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_all_profile_details_dto_1.GetAllProfileDetailsDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], ProfileDetailsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.TECHNICIAN),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_profile_detail_dto_1.UpdateProfileDetailDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], ProfileDetailsController.prototype, "update", null);
exports.ProfileDetailsController = ProfileDetailsController = __decorate([
    (0, common_1.Controller)('profile-details'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [profile_details_service_1.ProfileDetailsService])
], ProfileDetailsController);
//# sourceMappingURL=profile-details.controller.js.map