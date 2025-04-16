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
exports.InvoicesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const invoice_entity_1 = require("./entities/invoice.entity");
const typeorm_2 = require("typeorm");
const nestjs_typeorm_paginate_1 = require("nestjs-typeorm-paginate");
const user_entity_1 = require("../users/entities/user.entity");
const subscription_entity_1 = require("../subscriptions/entities/subscription.entity");
let InvoicesService = class InvoicesService {
    constructor(invoicesRepository, subscriptionsRepository) {
        this.invoicesRepository = invoicesRepository;
        this.subscriptionsRepository = subscriptionsRepository;
    }
    async findAll(currentUser, getAllInvoiceDto) {
        const { search, page = 1, per_page = 10, subscription_id, user_id, role, date_from, date_to, order, plan_type } = getAllInvoiceDto;
        const queryBuilder = this.invoicesRepository
            .createQueryBuilder('invoice')
            .leftJoinAndSelect('invoice.user', 'user')
            .leftJoinAndSelect('invoice.subscription', 'subscription')
            .leftJoinAndSelect('subscription.plan', 'plan');
        if ([user_entity_1.UserRole.ORGANIZATION, user_entity_1.UserRole.TECHNICIAN].includes(currentUser?.role)) {
            queryBuilder.where('user.id = :user_id', { user_id: currentUser?.id });
        }
        if (user_id &&
            [user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.SUPER_ADMIN].includes(currentUser?.role)) {
            queryBuilder.andWhere('user.id = :user_id', { user_id });
        }
        if (search) {
            queryBuilder.andWhere('(user.full_name ILIKE :search OR user.email ILIKE :search)', { search: `%${search}%` });
        }
        if (plan_type) {
            queryBuilder.andWhere('plan.type = :plan_type', { plan_type });
        }
        if (subscription_id) {
            queryBuilder.andWhere('subscription.id = :subscription_id', {
                subscription_id,
            });
        }
        if (role) {
            queryBuilder.andWhere('user.role = :role', { role });
        }
        if (date_from) {
            queryBuilder.andWhere('invoice.created_at >= :date_from', {
                date_from,
            });
        }
        if (date_to) {
            queryBuilder.andWhere('invoice.created_at <= :date_to', {
                date_to,
            });
        }
        queryBuilder
            .groupBy('invoice.id')
            .addGroupBy('subscription.id')
            .addGroupBy('plan.id')
            .addGroupBy('user.id')
            .distinctOn(['invoice.created_at'])
            .orderBy('invoice.created_at', order ?? 'DESC');
        const paginationOptions = {
            page: page,
            limit: per_page,
        };
        return (0, nestjs_typeorm_paginate_1.paginate)(queryBuilder, paginationOptions);
    }
};
exports.InvoicesService = InvoicesService;
exports.InvoicesService = InvoicesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(invoice_entity_1.Invoice)),
    __param(1, (0, typeorm_1.InjectRepository)(subscription_entity_1.Subscription)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], InvoicesService);
//# sourceMappingURL=invoices.service.js.map