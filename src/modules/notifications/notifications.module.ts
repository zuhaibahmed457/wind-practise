import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { UserNotification } from './entities/user-notification.entity';
import { UserNotificationSetting } from './entities/user-notification-setting.entity';
import { SharedModule } from 'src/shared/shared.module';
import { BullModule } from '@nestjs/bullmq';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { NotificationConsumer } from './consumers/notification.consumer';
import { EmailNotificationService } from './services/email-notification.service';
import { InAppNotificationService } from './services/in-app-notification.service';
import * as hbs from 'handlebars';

hbs.registerHelper('eq', function (arg1, arg2) {
  return arg1 === arg2;
});

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Notification,
      UserNotification,
      UserNotificationSetting,
    ]),
    SharedModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          transport: {
            host: configService.get('EMAIL_HOST'),
            secure: false,
            auth: {
              user: configService.get('EMAIL_USERNAME'),
              pass: configService.get('EMAIL_PASSWORD'),
            },
          },
          defaults: {
            from: `"No Reply" <${configService.get("EMAIL_USERNAME")}>`,
          },
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
        prefix: 'wind-tech-pros',
      }),
    }),
    BullModule.registerQueue({
      name: 'notifications-queue', // Queue for transactional notifications
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 3000,
        },
        removeOnComplete: true,
        removeOnFail: true,
      },
    }),
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    NotificationConsumer,
    EmailNotificationService,
    InAppNotificationService,
  ],
  exports: [NotificationsService, EmailNotificationService],
})
export class NotificationsModule {}
