import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { Plan } from '../plans/entities/plan.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import Stripe from 'stripe';
import { Subscription } from './entities/subscription.entity';
import { TransactionManagerService } from 'src/shared/services/transaction-manager.service';
import { CreateCustomerPortalDto } from './dto/create-customer-portal.dto';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { ManageSubscriptionDto } from './dto/manage-subscription.dto';
import { GetUsersSubscriptionsDto } from './dto/get-users-subscription.dto';
import { ConfigService } from '@nestjs/config';
export declare class SubscriptionsService {
    private readonly subscriptionsRepository;
    private readonly plansRepository;
    private readonly userRepository;
    private readonly transactionManagerService;
    private readonly stripe;
    private readonly configService;
    constructor(subscriptionsRepository: Repository<Subscription>, plansRepository: Repository<Plan>, userRepository: Repository<User>, transactionManagerService: TransactionManagerService, stripe: Stripe, configService: ConfigService);
    create(currentUser: User, createSubscriptionDto: CreateSubscriptionDto): Promise<{
        message: string;
        details: Subscription;
    } | {
        message: string;
        details: {
            stripe_subscription_id: string;
            stripe_client_secret: string;
        };
    }>;
    createCustomerPortal(currentUser: User, createCustomerPortalDto: CreateCustomerPortalDto): Promise<string>;
    findAll(getUsersSubscriptionDto: GetUsersSubscriptionsDto): Promise<import("nestjs-typeorm-paginate").Pagination<User, import("nestjs-typeorm-paginate").IPaginationMeta>>;
    findOne(id: number): string;
    update(id: number, updateSubscriptionDto: UpdateSubscriptionDto): string;
    remove(id: number): string;
    manageSubscription(id: ParamIdDto, manageSubscriptionDto: ManageSubscriptionDto, currentUser: User): Promise<Subscription>;
    checkExpiredTrials(): Promise<void>;
}
