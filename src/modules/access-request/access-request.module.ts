import { Module } from '@nestjs/common';
import { AccessRequestService } from './access-request.service';
import { AccessRequestController } from './access-request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessRequest } from './entities/access-request.entity';
import { SharedModule } from 'src/shared/shared.module';
import { ProfileDetails } from '../profile-details/entities/profile-details.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccessRequest, ProfileDetails]),
    SharedModule,
    NotificationsModule
  ],
  controllers: [AccessRequestController],
  providers: [AccessRequestService],
})
export class AccessRequestModule {}
