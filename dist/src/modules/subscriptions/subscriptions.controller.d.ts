import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { User } from '../users/entities/user.entity';
import { CreateCustomerPortalDto } from './dto/create-customer-portal.dto';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { ManageSubscriptionDto } from './dto/manage-subscription.dto';
import { Request, Response } from 'express';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { SubscriptionWebhookService } from './subscriptions-webhook.service';
import { GetUsersSubscriptionsDto } from './dto/get-users-subscription.dto';
export declare class SubscriptionsController {
    private readonly subscriptionsService;
    private readonly stripe;
    private readonly configService;
    private readonly subscriptionWebhookService;
    constructor(subscriptionsService: SubscriptionsService, stripe: Stripe, configService: ConfigService, subscriptionWebhookService: SubscriptionWebhookService);
    create(currentUser: User, createSubscriptionDto: CreateSubscriptionDto): Promise<IResponse>;
    createCustomerPortal(currentUser: User, createCustomerPortalDto: CreateCustomerPortalDto): Promise<IResponse>;
    manageSubscription(currentUser: User, id: ParamIdDto, manageSubscriptionDto: ManageSubscriptionDto): Promise<IResponse>;
    handleSubscriptionWebhook(req: Request, res: Response, signature: string): Promise<Response<any, Record<string, any>>>;
    findAll(getUsersSubscriptionDto: GetUsersSubscriptionsDto): Promise<{
        message: string;
        details: User[];
        extra: import("nestjs-typeorm-paginate").IPaginationMeta;
    }>;
    findOne(id: string): string;
    update(id: string, updateSubscriptionDto: UpdateSubscriptionDto): string;
    remove(id: string): string;
}
