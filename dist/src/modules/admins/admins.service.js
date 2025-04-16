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
exports.AdminsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const plan_entity_1 = require("../plans/entities/plan.entity");
const subscription_entity_1 = require("../subscriptions/entities/subscription.entity");
const invoice_entity_1 = require("../invoices/entities/invoice.entity");
const certificate_entity_1 = require("../certificates/entities/certificate.entity");
const job_post_entity_1 = require("../job-post/entities/job-post.entity");
const dayjs = require("dayjs");
let AdminsService = class AdminsService {
    constructor(usersRepository, invoiceRepository, subscriptionRepository, certificateRepository, jobPostRepository) {
        this.usersRepository = usersRepository;
        this.invoiceRepository = invoiceRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.certificateRepository = certificateRepository;
        this.jobPostRepository = jobPostRepository;
    }
    async dashboard(currentUser) {
        let { admins } = await this.usersRepository
            .createQueryBuilder('user')
            .where('user.role = :adminRole', { adminRole: user_entity_1.UserRole.ADMIN })
            .select([
            `json_build_object(
        'active', COUNT(CASE WHEN user.status = 'active' THEN 1 END),
        'inactive', COUNT(CASE WHEN user.status != 'active' THEN 1 END),
        'total', COUNT(*)
      ) AS admins`,
        ])
            .getRawOne();
        admins = currentUser?.role === user_entity_1.UserRole.SUPER_ADMIN ? admins : null;
        const { technicians } = await this.usersRepository
            .createQueryBuilder('user')
            .where('user.role = :technicianRole', {
            technicianRole: user_entity_1.UserRole.TECHNICIAN,
        })
            .select([
            `json_build_object(
        'active', COUNT(CASE WHEN user.status = 'active' THEN 1 END), 
        'in_active', COUNT(CASE WHEN user.status != 'active' THEN 1 END),
        'total', COUNT(*)
      ) AS technicians`,
        ])
            .getRawOne();
        const { organizations } = await this.usersRepository
            .createQueryBuilder('user')
            .where('user.role = :organizationRole', {
            organizationRole: user_entity_1.UserRole.ORGANIZATION,
        })
            .select([
            `json_build_object(
        'active', COUNT(CASE WHEN user.status = 'active' THEN 1 END), 
        'in_active', COUNT(CASE WHEN user.status != 'active' THEN 1 END),
        'total', COUNT(*)
      ) AS organizations`,
        ])
            .getRawOne();
        const currentDate = new Date();
        const twoMonthsFromNow = dayjs().add(2, 'months').toDate();
        const { certificates } = await this.certificateRepository
            .createQueryBuilder('certificate')
            .where('certificate.deleted_at IS NULL')
            .select([
            `json_build_object(
         'valid', COUNT(CASE WHEN certificate.expiration_date > :twoMonthsFromNow THEN 1 END),
         'expiration_soon', COUNT(CASE WHEN certificate.expiration_date BETWEEN :currentDate AND :twoMonthsFromNow THEN 1 END), 
         'expired', COUNT(CASE WHEN certificate.expiration_date < :currentDate THEN 1 END), 
        'total', COUNT(*)
      ) AS certificates`,
        ])
            .setParameters({ currentDate, twoMonthsFromNow })
            .getRawOne();
        const { posted_jobs } = await this.jobPostRepository
            .createQueryBuilder('job_post')
            .where('job_post.deleted_at IS NULL')
            .select([
            `json_build_object(
        'active', COUNT(CASE WHEN job_post.status = 'active' THEN 1 END), 
        'in_active', COUNT(CASE WHEN job_post.status != 'active' THEN 1 END),
        'total', COUNT(*)
      ) AS posted_jobs`,
        ])
            .getRawOne();
        const { subscriptions } = await this.subscriptionRepository
            .createQueryBuilder('subscription')
            .leftJoinAndSelect('subscription.plan', 'plan')
            .select([
            `json_build_object(
        'free', COUNT(CASE WHEN subscription.status = :activeSubscription AND plan.type = :typeFree  THEN 1 END), 
        'monthly', COUNT(CASE WHEN subscription.status = :activeSubscription AND plan.type = :typeMonthly  THEN 1 END), 
        'yearly', COUNT(CASE WHEN subscription.status = :activeSubscription AND plan.type = :typeYearly  THEN 1 END)
      ) AS subscriptions`,
        ])
            .setParameters({
            typeFree: plan_entity_1.PlanType.FREE,
            typeMonthly: plan_entity_1.PlanType.MONTHLY,
            typeYearly: plan_entity_1.PlanType.YEARLY,
            activeSubscription: subscription_entity_1.SubscriptionStatus.ACTIVE,
        })
            .getRawOne();
        const revenue = await this.invoiceRepository.sum('amount_paid', {
            status: invoice_entity_1.InvoiceStatus.PAID,
        });
        return {
            admins,
            organizations,
            technicians,
            certificates,
            posted_jobs,
            subscriptions,
            total_revenue: revenue,
        };
    }
    async subscriptions(currentUser, subscriptionStatsDto) {
        const { plan_type, year } = subscriptionStatsDto;
        const stats = await this.subscriptionRepository
            .createQueryBuilder('subscription')
            .select([
            `TO_CHAR(subscription.start_date, 'MM') AS month`,
            `COUNT(CASE WHEN subscription.status = 'active' THEN 1 END) AS active`,
            `COUNT(CASE WHEN subscription.status = 'canceled' THEN 1 END) AS cancelled`,
        ])
            .innerJoin('subscription.plan', 'plan')
            .where('plan.type = :planType', { planType: plan_type })
            .andWhere('EXTRACT(YEAR FROM subscription.start_date) = :year', { year })
            .groupBy('month')
            .orderBy('month', 'ASC')
            .getRawMany();
        const monthlyStats = Array.from({ length: 12 }, (_, i) => {
            const month = (i + 1).toString().padStart(2, '0');
            const data = stats.find((s) => s.month === month);
            return {
                month,
                active: Number(data?.active || 0),
                cancelled: Number(data?.cancelled || 0),
            };
        });
        return monthlyStats;
    }
    async revenue(currentUser, revenueStatsDto) {
        const { year } = revenueStatsDto;
        const revenueQuery = this.invoiceRepository
            .createQueryBuilder('invoice')
            .where('invoice.status = :statusPaid', {
            statusPaid: invoice_entity_1.InvoiceStatus.PAID,
        });
        if (year) {
            revenueQuery.andWhere('EXTRACT(YEAR FROM invoice.created_at) = :givenYear', { givenYear: Number(year) });
        }
        revenueQuery.select([
            `LPAD(EXTRACT(MONTH FROM invoice.created_at)::text, 2, '0') AS month`,
            `SUM(invoice.amount_paid) AS amount`,
        ]);
        revenueQuery.groupBy('month');
        const results = await revenueQuery.orderBy('month', 'ASC').getRawMany();
        const fullYearResults = Array.from({ length: 12 }, (_, index) => {
            const month = (index + 1).toString().padStart(2, '0');
            const found = results.find((result) => result.month === month);
            return found ?? { month, amount: '0' };
        });
        return fullYearResults;
    }
};
exports.AdminsService = AdminsService;
exports.AdminsService = AdminsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(invoice_entity_1.Invoice)),
    __param(2, (0, typeorm_1.InjectRepository)(subscription_entity_1.Subscription)),
    __param(3, (0, typeorm_1.InjectRepository)(certificate_entity_1.Certificate)),
    __param(4, (0, typeorm_1.InjectRepository)(job_post_entity_1.JobPost)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AdminsService);
//# sourceMappingURL=admins.service.js.map