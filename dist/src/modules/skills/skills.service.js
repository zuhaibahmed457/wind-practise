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
exports.SkillService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const skill_entity_1 = require("./entities/skill.entity");
const user_entity_1 = require("../users/entities/user.entity");
const nestjs_typeorm_paginate_1 = require("nestjs-typeorm-paginate");
let SkillService = class SkillService {
    constructor(skillRepository, userRepo) {
        this.skillRepository = skillRepository;
        this.userRepo = userRepo;
    }
    async create(createSkillDto, currentUser) {
        const user = await this.userRepo.findOne({
            where: {
                id: currentUser?.id,
            },
            relations: {
                profile_detail: true,
            },
        });
        const skill = this.skillRepository.create({
            ...createSkillDto,
            profile_details: user?.profile_detail,
        });
        return await skill.save();
    }
    async findAll(getAllSkillsDto, currentUser) {
        const { page, per_page, search, profile_details_id } = getAllSkillsDto;
        const query = this.skillRepository
            .createQueryBuilder('skill')
            .leftJoin('skill.profile_details', 'profile')
            .leftJoin('profile.user', 'user')
            .where('user.id = :id AND skill.deleted_at IS NULL', {
            id: currentUser?.id,
        });
        if (profile_details_id) {
            query.where('profile.id = :profile_details_id AND profile.deleted_at IS NULL', {
                profile_details_id,
            });
        }
        if (search) {
            query.andWhere('skill.name ILIKE :search', { search: `%${search}%` });
        }
        const paginationOptions = {
            page,
            limit: per_page,
        };
        return await (0, nestjs_typeorm_paginate_1.paginate)(query, paginationOptions);
    }
    async findOne({ id }, currentUser) {
        const skill = await this.skillRepository.findOne({
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
        if (!skill)
            throw new common_1.NotFoundException('Skill not found');
        return skill;
    }
    async update({ id }, updateSkillDto, currentUser) {
        const skill = await this.skillRepository.findOne({
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
        if (!skill)
            throw new common_1.NotFoundException('Skill not found');
        Object.assign(skill, updateSkillDto);
        return await skill.save();
    }
    async remove({ id }, currentUser) {
        const skill = await this.skillRepository.findOne({
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
        if (!skill)
            throw new common_1.NotFoundException('Skill not found');
        await skill.softRemove();
    }
};
exports.SkillService = SkillService;
exports.SkillService = SkillService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(skill_entity_1.Skill)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SkillService);
//# sourceMappingURL=skills.service.js.map