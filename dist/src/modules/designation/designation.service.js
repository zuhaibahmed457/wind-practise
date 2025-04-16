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
exports.DesignationService = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../users/entities/user.entity");
const typeorm_1 = require("@nestjs/typeorm");
const designation_entity_1 = require("./entities/designation.entity");
const typeorm_2 = require("typeorm");
const nestjs_typeorm_paginate_1 = require("nestjs-typeorm-paginate");
let DesignationService = class DesignationService {
    constructor(designationRepo, userRepo) {
        this.designationRepo = designationRepo;
        this.userRepo = userRepo;
    }
    async create(createDesignationDto, currentUser) {
        const designation = this.designationRepo.create({
            ...createDesignationDto,
            created_by: currentUser,
        });
        return await designation.save();
    }
    async findAll(getAllDesignationDto, currentUser) {
        const { page, per_page, search, status } = getAllDesignationDto;
        const query = this.designationRepo
            .createQueryBuilder('designation')
            .leftJoin('designation.created_by', 'user')
            .where('designation.created_by.id = :id', { id: currentUser?.id });
        if (search) {
            query.andWhere('designation.name ILIKE :search', {
                search: `%${search}%`,
            });
        }
        if (status) {
            query.andWhere('designation.status = :status', { status });
        }
        const paginationOptions = {
            page: page,
            limit: per_page,
        };
        return await (0, nestjs_typeorm_paginate_1.paginate)(query, paginationOptions);
    }
    async findOne({ id }, currentUser) {
        const designation = await this.designationRepo.findOne({
            where: {
                id,
                created_by: {
                    id: currentUser?.id,
                },
            },
        });
        if (!designation)
            throw new common_1.NotFoundException('Designation not found');
        return designation;
    }
    async update({ id }, updateDesignationDto, currentUser) {
        const designation = await this.designationRepo.findOne({
            where: {
                id,
                created_by: {
                    id: currentUser?.id,
                },
            },
        });
        if (!designation)
            throw new common_1.NotFoundException('Designation not found');
        Object.assign(designation, updateDesignationDto);
        return await designation.save();
    }
    async manageStatus({ id }, manageStatusDto, currentUser) {
        const designation = await this.designationRepo.findOne({
            where: {
                id,
                created_by: {
                    id: currentUser?.id,
                },
            },
        });
        if (!designation)
            throw new common_1.NotFoundException('Designation not found');
        Object.assign(designation, manageStatusDto);
        return designation.save();
    }
    async remove(id, currentUser) {
        const designation = await this.designationRepo.findOne({
            where: {
                id,
                created_by: {
                    id: currentUser?.id,
                },
            },
        });
        if (!designation)
            throw new common_1.NotFoundException('Designation not found');
        const isDesignationUsedAnyWhere = await this.userRepo.count({
            where: {
                role: user_entity_1.UserRole.EMPLOYEE,
                created_by: {
                    id: currentUser?.id,
                },
                profile_detail: {
                    designation: {
                        id: designation?.id,
                    },
                },
            },
        });
        if (isDesignationUsedAnyWhere)
            throw new common_1.BadRequestException('This designation is in use. Remove it before deleting.');
        await this.designationRepo.softDelete(id);
    }
};
exports.DesignationService = DesignationService;
exports.DesignationService = DesignationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(designation_entity_1.Designation)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], DesignationService);
//# sourceMappingURL=designation.service.js.map