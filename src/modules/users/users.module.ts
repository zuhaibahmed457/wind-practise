import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { LoginAttempt } from '../auth/entities/login-attempt.entity';
import { ProfileDetails } from '../profile-details/entities/profile-details.entity';
import { Media } from '../media/entities/media.entity';
import { MediaModule } from '../media/media.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { UserNotificationSetting } from '../notifications/entities/user-notification-setting.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      LoginAttempt,
      ProfileDetails,
      Media,
      UserNotificationSetting,
    ]),
    MediaModule,
    NotificationsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
