import { IResponse } from 'src/shared/interfaces/response.interface';
import { User } from '../users/entities/user.entity';
import { AdminsService } from './admins.service';
import { SubscriptionStatsDto } from './dto/subscription-stats.dto';
import { RevenueStatsDto } from './dto/revenue-stats.dto';
export declare class AdminsController {
    private readonly adminsService;
    constructor(adminsService: AdminsService);
    dashboard(user: User): Promise<IResponse>;
    subscriptions(user: User, subscriptionStatsDto: SubscriptionStatsDto): Promise<IResponse>;
    revenue(user: User, revenueStatsDto: RevenueStatsDto): Promise<IResponse>;
}
