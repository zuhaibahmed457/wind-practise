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
exports.DegreeTypeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const degree_type_entity_1 = require("./entities/degree-type.entity");
const nestjs_typeorm_paginate_1 = require("nestjs-typeorm-paginate");
let DegreeTypeService = class DegreeTypeService {
    constructor(degreeTypeRepository) {
        this.degreeTypeRepository = degreeTypeRepository;
    }
    async create(createDegreeTypeDto) {
        const degreeType = this.degreeTypeRepository.create(createDegreeTypeDto);
        return await degreeType.save();
    }
    async findAll(getAllDto) {
        const { page, per_page, search } = getAllDto;
        const query = this.degreeTypeRepository
            .createQueryBuilder('degree')
            .where('degree.deleted_at IS NULL');
        if (search) {
            query.andWhere('degree.name ILIKE :search', { search: `%${search}%` });
        }
        const paginationOptions = {
            page,
            limit: per_page,
        };
        return await (0, nestjs_typeorm_paginate_1.paginate)(query, paginationOptions);
    }
    async findOne({ id }) {
        const degreeType = await this.degreeTypeRepository.findOne({
            where: { id },
        });
        if (!degreeType)
            throw new common_1.NotFoundException('Degree type not found');
        return degreeType;
    }
    async update({ id }, updateDegreeTypeDto) {
        const degreeType = await this.degreeTypeRepository.findOne({
            where: { id },
        });
        if (!degreeType)
            throw new common_1.NotFoundException('Degree type not found');
        Object.assign(degreeType, updateDegreeTypeDto);
        return await degreeType.save();
    }
};
exports.DegreeTypeService = DegreeTypeService;
exports.DegreeTypeService = DegreeTypeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(degree_type_entity_1.DegreeType)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DegreeTypeService);
//# sourceMappingURL=degree-type.service.js.map