import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole, UserStatus } from '../users/entities/user.entity';
import { PlanType } from '../plans/entities/plan.entity';
import {
  Subscription,
  SubscriptionStatus,
} from '../subscriptions/entities/subscription.entity';
import { Invoice, InvoiceStatus } from '../invoices/entities/invoice.entity';
import { SubscriptionStatsDto } from './dto/subscription-stats.dto';
import { RevenueStatsDto } from './dto/revenue-stats.dto';
import { Certificate } from '../certificates/entities/certificate.entity';
import { JobPost } from '../job-post/entities/job-post.entity';
import * as dayjs from 'dayjs';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,

    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,

    @InjectRepository(Certificate)
    private readonly certificateRepository: Repository<Certificate>,

    @InjectRepository(JobPost)
    private readonly jobPostRepository: Repository<JobPost>,
  ) {}

  async dashboard(currentUser: User) {
    let { admins } = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.role = :adminRole', { adminRole: UserRole.ADMIN })
      .select([
        `json_build_object(
        'active', COUNT(CASE WHEN user.status = 'active' THEN 1 END),
        'inactive', COUNT(CASE WHEN user.status != 'active' THEN 1 END),
        'total', COUNT(*)
      ) AS admins`,
      ])
      .getRawOne();

    admins = currentUser?.role === UserRole.SUPER_ADMIN ? admins : null;

    const { technicians } = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.role = :technicianRole', {
        technicianRole: UserRole.TECHNICIAN,
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
        organizationRole: UserRole.ORGANIZATION,
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
        typeFree: PlanType.FREE,
        typeMonthly: PlanType.MONTHLY,
        typeYearly: PlanType.YEARLY,
        activeSubscription: SubscriptionStatus.ACTIVE,
      })
      .getRawOne();

    const revenue = await this.invoiceRepository.sum('amount_paid', {
      status: InvoiceStatus.PAID,
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

  async subscriptions(
    currentUser: User,
    subscriptionStatsDto: SubscriptionStatsDto,
  ) {
    const { plan_type, year } = subscriptionStatsDto;

    const stats = await this.subscriptionRepository
      .createQueryBuilder('subscription')
      .select([
        `TO_CHAR(subscription.start_date, 'MM') AS month`, // Extracts month (01-12)
        `COUNT(CASE WHEN subscription.status = 'active' THEN 1 END) AS active`,
        `COUNT(CASE WHEN subscription.status = 'canceled' THEN 1 END) AS cancelled`,
      ])
      .innerJoin('subscription.plan', 'plan')
      .where('plan.type = :planType', { planType: plan_type })
      .andWhere('EXTRACT(YEAR FROM subscription.start_date) = :year', { year })
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany();

    // Ensure all months (01-12) are present, even if some are missing
    const monthlyStats = Array.from({ length: 12 }, (_, i) => {
      const month = (i + 1).toString().padStart(2, '0'); // Format as "01", "02", etc.
      const data = stats.find((s) => s.month === month);
      return {
        month,
        active: Number(data?.active || 0),
        cancelled: Number(data?.cancelled || 0),
      };
    });

    return monthlyStats;
  }

  async revenue(currentUser: User, revenueStatsDto: RevenueStatsDto) {
    const { year } = revenueStatsDto;

    const revenueQuery = this.invoiceRepository
      .createQueryBuilder('invoice')
      .where('invoice.status = :statusPaid', {
        statusPaid: InvoiceStatus.PAID,
      });

    if (year) {
      revenueQuery.andWhere(
        'EXTRACT(YEAR FROM invoice.created_at) = :givenYear',
        { givenYear: Number(year) },
      );
    }

    // Select the required fields
    revenueQuery.select([
      `LPAD(EXTRACT(MONTH FROM invoice.created_at)::text, 2, '0') AS month`,
      `SUM(invoice.amount_paid) AS amount`,
    ]);

    revenueQuery.groupBy('month'); // Group by the raw field, not the formatted one

    const results = await revenueQuery.orderBy('month', 'ASC').getRawMany();

    // Fill in missing months with zero values
    const fullYearResults = Array.from({ length: 12 }, (_, index) => {
      const month = (index + 1).toString().padStart(2, '0'); // Pad month with '0' for single-digit months
      const found = results.find((result) => result.month === month);
      return found ?? { month, amount: '0' };
    });

    return fullYearResults;
  }
}
