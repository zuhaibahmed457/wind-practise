import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Subscription } from '../subscriptions/entities/subscription.entity';
import { Invoice } from '../invoices/entities/invoice.entity';
import { SubscriptionStatsDto } from './dto/subscription-stats.dto';
import { RevenueStatsDto } from './dto/revenue-stats.dto';
import { Certificate } from '../certificates/entities/certificate.entity';
import { JobPost } from '../job-post/entities/job-post.entity';
export declare class AdminsService {
    private readonly usersRepository;
    private readonly invoiceRepository;
    private readonly subscriptionRepository;
    private readonly certificateRepository;
    private readonly jobPostRepository;
    constructor(usersRepository: Repository<User>, invoiceRepository: Repository<Invoice>, subscriptionRepository: Repository<Subscription>, certificateRepository: Repository<Certificate>, jobPostRepository: Repository<JobPost>);
    dashboard(currentUser: User): Promise<{
        admins: any;
        organizations: any;
        technicians: any;
        certificates: any;
        posted_jobs: any;
        subscriptions: any;
        total_revenue: number;
    }>;
    subscriptions(currentUser: User, subscriptionStatsDto: SubscriptionStatsDto): Promise<{
        month: string;
        active: number;
        cancelled: number;
    }[]>;
    revenue(currentUser: User, revenueStatsDto: RevenueStatsDto): Promise<any[]>;
}
