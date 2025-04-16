import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { TransactionManagerService } from 'src/shared/services/transaction-manager.service';
import { User } from '../users/entities/user.entity';
import { Subscription } from './entities/subscription.entity';
import { Invoice } from '../invoices/entities/invoice.entity';
import { Plan } from '../plans/entities/plan.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class SubscriptionWebhookService {
    private readonly subscriptionsRepository;
    private readonly userRepository;
    private readonly plansRepository;
    private readonly invoiceRepository;
    private readonly stripe;
    private readonly transactionManagerService;
    private readonly eventEmitter;
    constructor(subscriptionsRepository: Repository<Subscription>, userRepository: Repository<User>, plansRepository: Repository<Plan>, invoiceRepository: Repository<Invoice>, stripe: Stripe, transactionManagerService: TransactionManagerService, eventEmitter: EventEmitter2);
    subscriptionInvoicePaid(eventData: any): Promise<void>;
    handleFailedPayment(eventDataObject: any): Promise<User>;
    subscriptionDeleted(data: any): Promise<Subscription>;
    updateSubscription(eventDataObject: any): Promise<Subscription>;
    createInvoice({ eventDataObject, subscription, user }: {
        eventDataObject: any;
        subscription: any;
        user: any;
    }): Promise<Invoice>;
}
