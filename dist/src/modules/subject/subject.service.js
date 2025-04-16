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
exports.SubjectService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const nestjs_typeorm_paginate_1 = require("nestjs-typeorm-paginate");
const subject_entity_1 = require("./entities/subject.entity");
let SubjectService = class SubjectService {
    constructor(subjectRepo) {
        this.subjectRepo = subjectRepo;
    }
    async create(createSubjectDto) {
        const existingSubject = await this.subjectRepo.findOne({
            where: { name: createSubjectDto.name },
        });
        if (existingSubject)
            throw new common_1.BadRequestException('Subject already exists');
        const subject = this.subjectRepo.create(createSubjectDto);
        return await subject.save();
    }
    async findAll(getAllDto) {
        const { page, per_page, search } = getAllDto;
        const query = this.subjectRepo
            .createQueryBuilder('subject')
            .where('subject.deleted_at IS NULL');
        if (search) {
            query.andWhere('subject.name ILIKE :search', { search: `%${search}%` });
        }
        const paginationOptions = {
            page: page,
            limit: per_page,
        };
        return await (0, nestjs_typeorm_paginate_1.paginate)(query, paginationOptions);
    }
    async findOne({ id }) {
        const subject = await this.subjectRepo.findOne({
            where: {
                id,
                deleted_at: (0, typeorm_2.IsNull)(),
            },
        });
        if (!subject) {
            throw new common_1.NotFoundException(`Subject not found`);
        }
        return subject;
    }
    async update({ id }, updateSubjectDto) {
        const subject = await this.findOne({ id });
        Object.assign(subject, updateSubjectDto);
        return await subject.save();
    }
    async remove({ id }) {
        const subject = await this.findOne({ id });
        await subject.softRemove();
    }
};
exports.SubjectService = SubjectService;
exports.SubjectService = SubjectService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(subject_entity_1.Subject)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SubjectService);
//# sourceMappingURL=subject.service.js.map