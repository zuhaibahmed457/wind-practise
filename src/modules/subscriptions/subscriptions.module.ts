import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './entities/subscription.entity';
import { Plan } from '../plans/entities/plan.entity';
import { SharedModule } from 'src/shared/shared.module';
import { SubscriptionWebhookService } from './subscriptions-webhook.service';
import { Invoice } from '../invoices/entities/invoice.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscription, Plan, Invoice]),
    SharedModule,
  ],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService, SubscriptionWebhookService],
})
export class SubscriptionsModule {}
