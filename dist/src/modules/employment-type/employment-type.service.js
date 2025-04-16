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
exports.EmploymentTypeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const employment_type_entity_1 = require("./entities/employment-type.entity");
const typeorm_2 = require("typeorm");
const nestjs_typeorm_paginate_1 = require("nestjs-typeorm-paginate");
let EmploymentTypeService = class EmploymentTypeService {
    constructor(employmentTypeRepository) {
        this.employmentTypeRepository = employmentTypeRepository;
    }
    async create(createEmploymentTypeDto, currentUser) {
        const employmentType = this.employmentTypeRepository.create({
            ...createEmploymentTypeDto,
            created_by: currentUser,
        });
        return await employmentType.save();
    }
    async findAll(getAllEmploymentTypeDto) {
        const { page, per_page, search, status } = getAllEmploymentTypeDto;
        const query = this.employmentTypeRepository
            .createQueryBuilder('employment_type')
            .where('employment_type.deleted_at IS NULL');
        if (search) {
            query.andWhere('employment_type.name ILIKE :search', { search: `%${search}%` });
        }
        if (status) {
            query.andWhere('employment_type.status = :status', { status });
        }
        const paginationOptions = {
            page: page,
            limit: per_page,
        };
        return await (0, nestjs_typeorm_paginate_1.paginate)(query, paginationOptions);
    }
    async findOne({ id }) {
        const employmentType = await this.employmentTypeRepository.findOne({
            where: { id },
        });
        if (!employmentType) {
            throw new common_1.NotFoundException('Employment type not found');
        }
        return employmentType;
    }
    async update({ id }, updateEmploymentTypeDto) {
        const employmentType = await this.employmentTypeRepository.findOne({
            where: {
                id,
            },
        });
        if (!employmentType) {
            throw new common_1.NotFoundException('Employment type not found');
        }
        Object.assign(employmentType, updateEmploymentTypeDto);
        return await employmentType.save();
    }
    async manageStatus({ id }, manageStatusDto) {
        const employmentType = await this.employmentTypeRepository.findOne({
            where: {
                id,
            },
        });
        if (!employmentType) {
            throw new common_1.NotFoundException('Employment type not found');
        }
        Object.assign(employmentType, manageStatusDto);
        return employmentType.save();
    }
};
exports.EmploymentTypeService = EmploymentTypeService;
exports.EmploymentTypeService = EmploymentTypeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(employment_type_entity_1.EmploymentType)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], EmploymentTypeService);
//# sourceMappingURL=employment-type.service.js.map