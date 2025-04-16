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
exports.PortfolioService = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../users/entities/user.entity");
const typeorm_1 = require("@nestjs/typeorm");
const portfolio_entity_1 = require("./entities/portfolio.entity");
const typeorm_2 = require("typeorm");
const profile_details_entity_1 = require("../profile-details/entities/profile-details.entity");
const s3_paths_1 = require("../../static/s3-paths");
const nestjs_typeorm_paginate_1 = require("nestjs-typeorm-paginate");
const media_service_1 = require("../media/media.service");
const media_entity_1 = require("../media/entities/media.entity");
const portfolio_media_validation_1 = require("./validation/portfolio-media.validation");
let PortfolioService = class PortfolioService {
    constructor(portfolioRepo, profileDetailsRepo, mediaRepo, mediaService) {
        this.portfolioRepo = portfolioRepo;
        this.profileDetailsRepo = profileDetailsRepo;
        this.mediaRepo = mediaRepo;
        this.mediaService = mediaService;
    }
    async create(currentUser, createPortfolioDto) {
        const profileDetails = await this.profileDetailsRepo.findOne({
            where: {
                user: {
                    id: currentUser?.id,
                },
            },
        });
        if (!profileDetails)
            throw new common_1.NotFoundException('Profile Details not found');
        const portfolio = this.portfolioRepo.create({
            ...createPortfolioDto,
            profile_details: profileDetails,
        });
        return await portfolio.save();
    }
    async uploadMedia({ id }, uploadMediaDto, currentUser) {
        const { file } = uploadMediaDto;
        const portfolio = await this.portfolioRepo.findOne({
            where: {
                id,
                deleted_at: (0, typeorm_2.IsNull)(),
                profile_details: {
                    user: {
                        id: currentUser?.id,
                    },
                },
            },
        });
        if (!portfolio)
            throw new common_1.NotFoundException('Portfolio not found');
        const fileType = file.mimeType.split('/')[0];
        let folder_path;
        await (0, portfolio_media_validation_1.PortfolioMediaValidation)(fileType, id, media_entity_1.EntityType.PORTFOLIO, this.mediaRepo);
        if (fileType === 'video') {
            folder_path = s3_paths_1.UserS3Paths.PORTFOLIO_VIDEO;
        }
        else if (fileType === 'image') {
            folder_path = s3_paths_1.UserS3Paths.PORTFOLIO_IMAGE;
        }
        const payload = {
            file,
            folder_path,
            entity_id: id,
            entity_type: media_entity_1.EntityType.PORTFOLIO,
        };
        return await this.mediaService.createMedia(payload);
    }
    async findAll(currentUser, getALLPortfolioDto) {
        const { page, per_page, search, project_duration, profile_details_id } = getALLPortfolioDto;
        const query = this.portfolioRepo
            .createQueryBuilder('portfolio')
            .leftJoinAndSelect('portfolio.profile_details', 'profile')
            .leftJoin('profile.user', 'profile_user')
            .leftJoinAndMapMany('portfolio.media', media_entity_1.Media, 'media', 'media.entity_id::uuid = portfolio.id AND media.entity_type = :entity_type', { entity_type: media_entity_1.EntityType.PORTFOLIO })
            .where('profile_user.id = :user_id AND portfolio.deleted_at IS NULL', {
            user_id: currentUser?.id,
        });
        if (profile_details_id) {
            query.where('profile.id = :profile_details_id', { profile_details_id });
        }
        if (search) {
            query.andWhere('(portfolio.project_name ILIKE :search OR portfolio.industry ILIKE :search)', { search: `%${search}%` });
        }
        if (project_duration) {
            query.andWhere('portfolio.project_duration = :project_duration', {
                project_duration,
            });
        }
        const paginationOptions = {
            page: page,
            limit: per_page,
        };
        return await (0, nestjs_typeorm_paginate_1.paginate)(query, paginationOptions);
    }
    async findOne({ id }, currentUser) {
        const portfolio = await this.portfolioRepo
            .createQueryBuilder('portfolio')
            .leftJoinAndSelect('portfolio.profile_details', 'profile')
            .leftJoinAndSelect('profile.user', 'user')
            .leftJoinAndMapMany('portfolio.media', media_entity_1.Media, 'media', 'media.entity_id::uuid = portfolio.id AND media.entity_type = :entity_type', { entity_type: media_entity_1.EntityType.PORTFOLIO })
            .where('portfolio.id = :id AND portfolio.deleted_at IS NULL', { id })
            .getOne();
        if (!portfolio)
            throw new common_1.NotFoundException('Portfolio not found');
        if ([user_entity_1.UserRole.TECHNICIAN].includes(currentUser?.role) &&
            portfolio?.profile_details?.user?.id !== currentUser?.id) {
            throw new common_1.ForbiddenException('You are not able to view this portfolio');
        }
        return portfolio;
    }
    async update({ id }, currentUser, updatePortfolioDto) {
        const portfolio = await this.portfolioRepo.findOne({
            where: {
                id,
                profile_details: {
                    user: {
                        id: currentUser?.id,
                    },
                },
            },
        });
        if (!portfolio)
            throw new common_1.NotFoundException('Portfolio not found');
        Object.assign(portfolio, updatePortfolioDto);
        return await portfolio.save();
    }
    async deleteMediaFile(deletePortfolioMediaDto) {
        const media = await this.mediaRepo.findOne({
            where: {
                id: deletePortfolioMediaDto?.id,
                entity_id: deletePortfolioMediaDto?.portfolio_id,
            },
        });
        if (!media)
            throw new common_1.NotFoundException('Media not found');
        await this.mediaService.deleteMedia({ id: media?.id });
    }
    async remove({ id }, currentUser) {
        const portfolio = await this.portfolioRepo.findOne({
            where: {
                id,
                profile_details: {
                    user: {
                        id: currentUser?.id,
                    },
                },
            },
        });
        if (!portfolio)
            throw new common_1.NotFoundException('Portfolio not found');
        await this.mediaService.deleteMultipleFiles({ id: portfolio?.id });
        await this.portfolioRepo.delete(portfolio?.id);
    }
};
exports.PortfolioService = PortfolioService;
exports.PortfolioService = PortfolioService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(portfolio_entity_1.Portfolio)),
    __param(1, (0, typeorm_1.InjectRepository)(profile_details_entity_1.ProfileDetails)),
    __param(2, (0, typeorm_1.InjectRepository)(media_entity_1.Media)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        media_service_1.MediaService])
], PortfolioService);
//# sourceMappingURL=portfolio.service.js.map