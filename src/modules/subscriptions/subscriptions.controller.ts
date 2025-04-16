import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
  Headers,
  Inject,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User, UserRole } from '../users/entities/user.entity';
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard';
import { CreateCustomerPortalDto } from './dto/create-customer-portal.dto';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { RolesDecorator } from 'src/shared/decorators/roles.decorator';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { ManageSubscriptionDto } from './dto/manage-subscription.dto';
import { textCapitalize } from 'src/utils/text-capitalize';
import { Request, Response } from 'express';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { SubscriptionWebhookService } from './subscriptions-webhook.service';
import { GetUsersSubscriptionsDto } from './dto/get-users-subscription.dto';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(
    private readonly subscriptionsService: SubscriptionsService,
    @Inject('STRIPE_CLIENT') private readonly stripe: Stripe,

    private readonly configService: ConfigService,
    private readonly subscriptionWebhookService: SubscriptionWebhookService,
  ) {}

  @Post()
  @UseGuards(AuthenticationGuard, RolesGuard)
  @RolesDecorator(UserRole.ORGANIZATION, UserRole.TECHNICIAN)
  async create(
    @CurrentUser() currentUser: User,
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<IResponse> {
    return await this.subscriptionsService.create(
      currentUser,
      createSubscriptionDto,
    );
  }

  @Post('customer-portal')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @RolesDecorator(UserRole.ORGANIZATION, UserRole.TECHNICIAN)
  async createCustomerPortal(
    @CurrentUser() currentUser: User,
    @Body() createCustomerPortalDto: CreateCustomerPortalDto,
  ): Promise<IResponse> {
    const customerPortalUrl =
      await this.subscriptionsService.createCustomerPortal(
        currentUser,
        createCustomerPortalDto,
      );
    return {
      message: 'Redirecting to customer portal',
      details: {
        customer_portal_url: customerPortalUrl,
      },
    };
  }

  @Patch('manage-subscription/:id')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @RolesDecorator(UserRole.ORGANIZATION, UserRole.TECHNICIAN)
  async manageSubscription(
    @CurrentUser() currentUser: User,
    @Param() id: ParamIdDto,
    @Body() manageSubscriptionDto: ManageSubscriptionDto,
  ): Promise<IResponse> {
    const subscription = await this.subscriptionsService.manageSubscription(
      id,
      manageSubscriptionDto,
      currentUser,
    );

    return {
      message: `Your subscription will ${textCapitalize(manageSubscriptionDto.action)} on period end`,
      details: subscription,
    };
  }

  @Post('webhook')
  async handleSubscriptionWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        req.body,
        signature,
        this.configService.get('STRIPE_SUBSCRIPTION_WEBHOOK_SECRET'),
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      throw new BadRequestException('Invalid webhook signature');
    }

    switch (event.type) {
      case 'invoice.payment_succeeded':
        await this.subscriptionWebhookService.subscriptionInvoicePaid(
          event.data.object,
        );
        break;

      case 'customer.subscription.deleted':
        await this.subscriptionWebhookService.subscriptionDeleted(
          event.data.object,
        );
        break;

      case 'invoice.payment_failed':
        await this.subscriptionWebhookService.handleFailedPayment(
          event.data.object,
        );
        break;

      case 'customer.subscription.updated':
        await this.subscriptionWebhookService.updateSubscription(
          event.data.object,
        );
        break;

      default:
        break;
    }

    return res.status(200).json({
      message: 'Webhook received successfully',
    });
  }

  @Get()
  @UseGuards(AuthenticationGuard, RolesGuard)
  @RolesDecorator(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  async findAll(@Query() getUsersSubscriptionDto: GetUsersSubscriptionsDto) {
    const { items, meta } = await this.subscriptionsService.findAll(
      getUsersSubscriptionDto,
    );

    return {
      message: 'Subscription of each user fetched successfully',
      details: items,
      extra: meta,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subscriptionsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return this.subscriptionsService.update(+id, updateSubscriptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subscriptionsService.remove(+id);
  }
}
