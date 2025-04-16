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
exports.SubscribeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const subscribe_entity_1 = require("./entities/subscribe.entity");
const typeorm_2 = require("typeorm");
const nestjs_typeorm_paginate_1 = require("nestjs-typeorm-paginate");
let SubscribeService = class SubscribeService {
    constructor(subscriberRepo) {
        this.subscriberRepo = subscriberRepo;
    }
    async create(createSubscribeDto) {
        const isSubscriberExist = await this.subscriberRepo.findOne({
            where: {
                email: createSubscribeDto.email,
            },
        });
        if (isSubscriberExist)
            throw new common_1.BadRequestException('Already subscribed');
        const subscribe = this.subscriberRepo.create(createSubscribeDto);
        return await subscribe.save();
    }
    async findAll(getAllDto) {
        const { page, per_page, search } = getAllDto;
        const query = this.subscriberRepo
            .createQueryBuilder('sub')
            .where('sub.deleted_at IS NULL');
        if (search) {
            query.andWhere('sub.email ILIKE :search', { search: `%${search}%` });
        }
        const paginationOptions = {
            page: page,
            limit: per_page,
        };
        return await (0, nestjs_typeorm_paginate_1.paginate)(query, paginationOptions);
    }
    async findOne({ id }) {
        const subscribe = await this.subscriberRepo.findOne({
            where: {
                id,
                deleted_at: (0, typeorm_2.IsNull)(),
            },
        });
        if (!subscribe) {
            throw new common_1.NotFoundException(`Subscriber not found`);
        }
        return subscribe;
    }
    async remove(paramIdDto) {
        const subscriber = await this.findOne(paramIdDto);
        subscriber.deleted_at = new Date();
        await subscriber.save();
    }
};
exports.SubscribeService = SubscribeService;
exports.SubscribeService = SubscribeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(subscribe_entity_1.Subscribe)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SubscribeService);
//# sourceMappingURL=subscribe.service.js.map