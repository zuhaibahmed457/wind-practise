import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { Invoice } from '../invoices/entities/invoice.entity';
import { SharedModule } from 'src/shared/shared.module';
import { Subscription } from '../subscriptions/entities/subscription.entity';
import { JobPost } from '../job-post/entities/job-post.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Subscription, Invoice, JobPost]),
    SharedModule,
  ],
  controllers: [AdminsController],
  providers: [AdminsService],
})
export class AdminsModule {}
