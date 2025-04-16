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
exports.ContactUsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const nestjs_typeorm_paginate_1 = require("nestjs-typeorm-paginate");
const contact_us_entity_1 = require("./entities/contact-us.entity");
const subject_entity_1 = require("../subject/entities/subject.entity");
let ContactUsService = class ContactUsService {
    constructor(contactUsRepo, subjectRepo) {
        this.contactUsRepo = contactUsRepo;
        this.subjectRepo = subjectRepo;
    }
    async create(createContactUsDto) {
        const subject = await this.subjectRepo.findOne({
            where: {
                id: createContactUsDto?.subject_id,
            },
        });
        if (!subject)
            throw new common_1.NotFoundException('subject not found');
        const contact = this.contactUsRepo.create({
            ...createContactUsDto,
            subject: subject
        });
        return await this.contactUsRepo.save(contact);
    }
    async findAll(getAllDto) {
        const { page, per_page, search } = getAllDto;
        const query = this.contactUsRepo
            .createQueryBuilder('contact')
            .leftJoinAndSelect('contact.subject', 'sub')
            .where('contact.deleted_at IS NULL');
        if (search) {
            query.andWhere('(contact.name ILIKE :search OR contact.email ILIKE :search OR sub.name ILIKE :search)', { search: `%${search}%` });
        }
        query.orderBy('contact.created_at', 'DESC');
        const paginationOptions = {
            page: page,
            limit: per_page,
        };
        return await (0, nestjs_typeorm_paginate_1.paginate)(query, paginationOptions);
    }
    async findOne({ id }) {
        const contact = await this.contactUsRepo.findOne({
            where: {
                id,
                deleted_at: (0, typeorm_2.IsNull)(),
            },
            relations: {
                subject: true,
            },
        });
        if (!contact) {
            throw new common_1.NotFoundException(`Contact not found`);
        }
        return contact;
    }
    async remove({ id }) {
        const contact = await this.findOne({ id });
        await contact.softRemove();
    }
};
exports.ContactUsService = ContactUsService;
exports.ContactUsService = ContactUsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(contact_us_entity_1.ContactUs)),
    __param(1, (0, typeorm_1.InjectRepository)(subject_entity_1.Subject)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ContactUsService);
//# sourceMappingURL=contact-us.service.js.map