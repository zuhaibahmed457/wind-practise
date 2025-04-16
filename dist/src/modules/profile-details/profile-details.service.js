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
exports.ProfileDetailsService = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../users/entities/user.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const profile_details_entity_1 = require("./entities/profile-details.entity");
const country_entity_1 = require("../country/entities/country.entity");
let ProfileDetailsService = class ProfileDetailsService {
    constructor(userRepo, profileDetailsRepo) {
        this.userRepo = userRepo;
        this.profileDetailsRepo = profileDetailsRepo;
    }
    async getProfileDetails(getAllProfileDetailsDto, currentUser) {
        const { profile_details_id } = getAllProfileDetailsDto;
        const query = this.profileDetailsRepo
            .createQueryBuilder('profile')
            .leftJoinAndMapOne('profile.country', country_entity_1.Country, 'country', 'profile.country = country.name')
            .leftJoinAndSelect('profile.user', 'user')
            .where('user.id = :user_id', { user_id: currentUser?.id });
        if (profile_details_id) {
            query.where('profile.id = :profile_details_id AND profile.deleted_at IS NULL', { profile_details_id });
        }
        return await query.getOne();
    }
    async updateProfileDetails(updateProfileDetailDto, currentUser) {
        const { first_name, last_name, phone_no } = updateProfileDetailDto;
        const user = await this.userRepo.findOne({
            where: {
                id: currentUser?.id,
            },
        });
        Object.assign(user, { first_name, last_name, phone_no });
        await user.save();
        const profileDetails = await this.profileDetailsRepo.findOne({
            where: {
                user: {
                    id: currentUser?.id,
                    deleted_at: (0, typeorm_2.IsNull)(),
                },
            },
        });
        Object.assign(profileDetails, updateProfileDetailDto);
        return await profileDetails.save();
    }
};
exports.ProfileDetailsService = ProfileDetailsService;
exports.ProfileDetailsService = ProfileDetailsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(profile_details_entity_1.ProfileDetails)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ProfileDetailsService);
//# sourceMappingURL=profile-details.service.js.map