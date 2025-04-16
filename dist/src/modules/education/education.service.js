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
exports.EducationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const education_entity_1 = require("./entities/education.entity");
const user_entity_1 = require("../users/entities/user.entity");
const degree_type_entity_1 = require("../degree-type/entities/degree-type.entity");
const nestjs_typeorm_paginate_1 = require("nestjs-typeorm-paginate");
let EducationService = class EducationService {
    constructor(educationRepository, degreeTypeRepository, userRepo) {
        this.educationRepository = educationRepository;
        this.degreeTypeRepository = degreeTypeRepository;
        this.userRepo = userRepo;
    }
    async create(createEducationDto, currentUser) {
        const user = await this.userRepo.findOne({
            where: {
                id: currentUser?.id,
            },
            relations: {
                profile_detail: true,
            },
        });
        const education = this.educationRepository.create({
            ...createEducationDto,
            profile_details: user?.profile_detail,
        });
        if (createEducationDto?.degree_type_id) {
            const degreeType = await this.degreeTypeRepository.findOne({
                where: { id: createEducationDto.degree_type_id },
            });
            if (!degreeType)
                throw new common_1.NotFoundException('Degree type not found');
            education.degree_type = degreeType;
        }
        return await education.save();
    }
    async findAll(getAllEducationDto, currentUser) {
        const { page, per_page, search, profile_details_id } = getAllEducationDto;
        const query = this.educationRepository
            .createQueryBuilder('education')
            .leftJoinAndSelect('education.degree_type', 'degree_type')
            .leftJoin('education.profile_details', 'profile')
            .leftJoin('profile.user', 'user')
            .where('user.id = :id AND education.deleted_at IS NULL', {
            id: currentUser?.id,
        });
        if (profile_details_id) {
            query.where('profile.id = :profile_details_id', { profile_details_id });
        }
        if (search) {
            query.andWhere('(education.school ILIKE :search OR education.field ILIKE :search OR degree_type.name ILIKE :search)', { search: `%${search}%` });
        }
        const paginationOptions = {
            page,
            limit: per_page,
        };
        return await (0, nestjs_typeorm_paginate_1.paginate)(query, paginationOptions);
    }
    async findOne({ id }, currentUser) {
        const education = await this.educationRepository.findOne({
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
        if (!education)
            throw new common_1.NotFoundException('Education not found');
        return education;
    }
    async update({ id }, updateEducationDto, currentUser) {
        const education = await this.educationRepository.findOne({
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
        if (!education)
            throw new common_1.NotFoundException('Education not found');
        if (updateEducationDto?.degree_type_id) {
            const degreeType = await this.degreeTypeRepository.findOne({
                where: { id: updateEducationDto.degree_type_id },
            });
            if (!degreeType)
                throw new common_1.NotFoundException('Degree type not found');
            education.degree_type = degreeType;
        }
        Object.assign(education, updateEducationDto);
        return await education.save();
    }
    async remove({ id }, currentUser) {
        const education = await this.educationRepository.findOne({
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
        if (!education)
            throw new common_1.NotFoundException('Education not found');
        await education.softRemove();
    }
};
exports.EducationService = EducationService;
exports.EducationService = EducationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(education_entity_1.Education)),
    __param(1, (0, typeorm_1.InjectRepository)(degree_type_entity_1.DegreeType)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], EducationService);
//# sourceMappingURL=education.service.js.map