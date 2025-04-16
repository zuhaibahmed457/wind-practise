import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Entity, In, Repository } from 'typeorm';
import Stripe from 'stripe';
import { TransactionManagerService } from 'src/shared/services/transaction-manager.service';
import { User, UserRole } from '../users/entities/user.entity';
import {
  PaymentStatus,
  Subscription,
  SubscriptionStatus,
} from './entities/subscription.entity';
import { Invoice, InvoiceStatus } from '../invoices/entities/invoice.entity';
import { Plan } from '../plans/entities/plan.entity';
import * as dayjs from 'dayjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EmailTemplate } from '../notifications/enums/email-template.enum';
import {
  NotificationChannel,
  NotificationEntityType,
  NotificationType,
} from '../notifications/entities/notification.entity';

@Injectable()
export class SubscriptionWebhookService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionsRepository: Repository<Subscription>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Plan)
    private readonly plansRepository: Repository<Plan>,

    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,

    @Inject('STRIPE_CLIENT') private readonly stripe: Stripe,

    private readonly transactionManagerService: TransactionManagerService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async subscriptionInvoicePaid(eventData) {
    if (eventData.billing_reason === 'subscription_create') {
      const stripeSubscription = await this.stripe.subscriptions.retrieve(
        eventData.subscription,
      );

      const subscriptionPlan = await this.plansRepository.findOne({
        where: {
          stripe_product_id: stripeSubscription.items.data[0].plan
            .product as string,
        },
      });

      if (!subscriptionPlan) {
        throw new NotFoundException('Plan with this id does not exists');
      }

      const user = await this.userRepository.findOne({
        where: {
          email: eventData.customer_email,
        },
        relations: {
          latest_subscription: {
            plan: true,
          },
        },
      });

      if (!user) {
        throw new NotFoundException('User with this email does not exists');
      }

      // ** Marking the free trial subscription to cancel
      if (user.latest_subscription) {
        user.latest_subscription.status = SubscriptionStatus.CANCELED;
        await this.subscriptionsRepository.save(user.latest_subscription);
      }

      // ** Create a new subscription
      const subscription = this.subscriptionsRepository.create({
        price: subscriptionPlan.price, // ** copied price here
        status: SubscriptionStatus.ACTIVE,
        stripe_subscription_id: stripeSubscription.id,
        start_date: dayjs
          .unix(stripeSubscription.current_period_start)
          .toDate(),
        end_date: dayjs.unix(stripeSubscription.current_period_end).toDate(),
        payment_status: PaymentStatus.PAID,
        payment_failed_count: 0,
        plan: subscriptionPlan,
        user: user,
      });

      await subscription.save();

      const invoice = await this.createInvoice({
        eventDataObject: eventData,
        subscription,
        user,
      });

      user.latest_subscription = subscription;
      user.has_taken_subscription = true;
      user.has_used_free_trial = true;
      await user.save();

      const allAdmins = await this.userRepository.find({
        where: {
          role: In([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
        },
      });

      await this.eventEmitter.emitAsync('create-send-notification', {
        user_ids: allAdmins.map((a) => a.id),
        title: 'Hurry! A user purchased subscription',
        message: `Plan ${subscriptionPlan.name} has been subscribed by user ${user.first_name} ${user.last_name}`,
        template: EmailTemplate.SUBSCRIPTION_PURCHASED,
        notification_type: NotificationType.TRANSACTION,
        is_displayable: true,
        bypass_user_preferences: true,
        channels: [NotificationChannel.EMAIL, NotificationChannel.IN_APP],
        entity_type: NotificationEntityType.SUBSCRIPTION,
        entity_id: subscription.id,
        meta_data: {
          user_name: `${user.first_name} ${user.last_name}`,
          user_email: user.email,
          plan_name: subscriptionPlan.name,
          amount_paid: `${invoice.amount_paid}`,
          admin_dashboard_url: 'will be provided', // TODO:
        },
      });
    }

    if (eventData.billing_reason === 'subscription_cycle') {
      const subscription = await this.subscriptionsRepository.findOne({
        where: {
          stripe_subscription_id: eventData.subscription,
        },
        relations: {
          user: true,
        },
      });

      if (!subscription) {
        throw new NotFoundException('Subscription does not exists');
      }

      const stripeSubscription = await this.stripe.subscriptions.retrieve(
        eventData.subscription,
      );

      subscription.start_date = dayjs
        .unix(stripeSubscription.current_period_start)
        .toDate();

      subscription.end_date = dayjs
        .unix(stripeSubscription.current_period_end)
        .toDate();

      subscription.status = SubscriptionStatus.ACTIVE;
      subscription.payment_status = PaymentStatus.PAID;
      subscription.payment_failed_count = 0;
      await subscription.save();

      await this.createInvoice({
        eventDataObject: eventData,
        subscription,
        user: subscription.user,
      });
    }

    if (eventData.billing_reason === 'subscription_update') {
      const subscription = await this.subscriptionsRepository.findOne({
        where: {
          stripe_subscription_id: eventData.subscription,
        },
        relations: {
          user: true,
          plan: true,
        },
      });

      const previousSubscriptionPlan = subscription.plan;

      if (!subscription) {
        throw new NotFoundException('Subscription does not exists');
      }

      const stripeSubscription = await this.stripe.subscriptions.retrieve(
        eventData.subscription,
      );

      const subscriptionPlan = await this.plansRepository.findOne({
        where: {
          stripe_product_id: stripeSubscription.items.data[0].plan
            .product as string,
        },
      });

      if (!subscriptionPlan) {
        throw new NotFoundException('Plan with this id does not exists');
      }

      subscription.plan = subscriptionPlan;
      subscription.start_date = dayjs
        .unix(stripeSubscription.current_period_start)
        .toDate();
      subscription.end_date = dayjs
        .unix(stripeSubscription.current_period_end)
        .toDate();
      subscription.status = SubscriptionStatus.ACTIVE;
      subscription.price = subscriptionPlan.price;
      subscription.payment_status = PaymentStatus.PAID;
      subscription.payment_failed_count = 0;
      await subscription.save();

      const invoice = await this.createInvoice({
        eventDataObject: eventData,
        subscription,
        user: subscription.user,
      });

      const allAdmins = await this.userRepository.find({
        where: {
          role: In([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
        },
      });

      await this.eventEmitter.emitAsync('create-send-notification', {
        user_ids: allAdmins.map((a) => a.id),
        title: 'A user updated his subscription plan',
        message: `Plan ${subscriptionPlan.name} has been subscribed by user ${subscription.user.first_name} ${subscription.user.last_name}`,
        template: EmailTemplate.SUBSCRIPTION_UPDATED,
        notification_type: NotificationType.TRANSACTION,
        is_displayable: true,
        bypass_user_preferences: true,
        channels: [NotificationChannel.EMAIL, NotificationChannel.IN_APP],
        entity_type: NotificationEntityType.SUBSCRIPTION,
        entity_id: subscription.id,
        meta_data: {
          user_name: `${subscription.user.first_name} ${subscription.user.last_name}`,
          user_email: subscription.user.email,
          new_plan_name: subscriptionPlan.name,
          previous_plan_name: previousSubscriptionPlan.name,
          amount_paid: `${invoice.amount_paid}`,
          admin_dashboard_url: 'will be provided', // TODO:
        },
      });
    }
  }

  async handleFailedPayment(eventDataObject) {
    const subscription = await this.subscriptionsRepository.findOne({
      where: {
        stripe_subscription_id: eventDataObject.subscription,
      },
      relations: {
        user: true,
      },
    });

    if (!subscription) {
      throw new BadRequestException('Subscription not found');
    }

    subscription.payment_failed_count++;
    subscription.status = SubscriptionStatus.PAST_DUE;
    if (subscription.payment_failed_count >= 2) {
      const latestInvoice = (
        await this.stripe.subscriptions.retrieve(
          subscription.stripe_subscription_id,
        )
      ).latest_invoice;
      await this.stripe.invoices.voidInvoice(latestInvoice.toString());
      await this.stripe.subscriptions.cancel(
        subscription.stripe_subscription_id,
      );
      subscription.status = SubscriptionStatus.CANCELED;

      subscription.user.latest_subscription = null;

      return await this.userRepository.save(subscription.user);
    }

    await subscription.save();
  }

  async subscriptionDeleted(data) {
    const subscription = await this.subscriptionsRepository.findOne({
      where: {
        stripe_subscription_id: data.id,
        status: SubscriptionStatus.ACTIVE,
      },
      relations: {
        user: true,
      },
    });

    if (!subscription) {
      return; // ** means we have already cancelled the subscription
    }

    subscription.user.latest_subscription = null;

    await this.userRepository.save(subscription.user);

    subscription.status = SubscriptionStatus.CANCELED;
    return await subscription.save();
  }

  async updateSubscription(eventDataObject) {
    const subscription = await this.subscriptionsRepository.findOne({
      where: {
        stripe_subscription_id: eventDataObject.id,
      },
      relations: {
        user: true,
      },
    });

    if (!subscription) {
      return; // the subscription doesn't exists by now
    }

    subscription.cancel_at_period_end = eventDataObject.cancel_at_period_end;

    return await subscription.save();
  }

  async createInvoice({ eventDataObject, subscription, user }) {
    const invoice = this.invoiceRepository.create({
      stripe_invoice_id: eventDataObject.id,
      stripe_hosted_invoice_url: eventDataObject.hosted_invoice_url,
      stripe_invoice_pdf: eventDataObject.invoice_pdf,
      status: InvoiceStatus.PAID,
      amount_paid: eventDataObject.amount_paid / 100,
      amount_due: eventDataObject.amount_due / 100,
      payment_date: new Date(),
      subscription,
      user,
    });

    return await this.invoiceRepository.save(invoice);
  }
}
