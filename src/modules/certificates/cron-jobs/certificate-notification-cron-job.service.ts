import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, LessThan, LessThanOrEqual, Repository } from 'typeorm';
import { Certificate } from '../entities/certificate.entity';
import {
  NotificationChannel,
  NotificationEntityType,
  NotificationType,
} from 'src/modules/notifications/entities/notification.entity';
import { EmailTemplate } from 'src/modules/notifications/enums/email-template.enum';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable()
export class CertificateCronService {
  private readonly logger = new Logger(CertificateCronService.name);

  constructor(
    @InjectRepository(Certificate)
    private readonly certificateRepository: Repository<Certificate>,
    private readonly eventEmitter: EventEmitter2,
    private readonly configService: ConfigService,
  ) {}

  // TODO: CHANGE IT TO EVERY 3 HOURS WHEN LIVE
  @Cron(CronExpression.EVERY_3_HOURS)
  async scheduleCertificateProcessing() {
    if (
      !this.configService.get('CRON_ENABLED') ||
      this.configService.get('CRON_ENABLED') === 'false'
    ) {
      return;
    }
    console.log(
      '========================================⏳ Scheduling certificate notifications =================================================',
    );

    const batchSize = 1000; // Process 1k at a time prox size ~200 KB
    let offset = 0;

    while (true) {
      const certificates = await this.certificateRepository.find({
        where: [
          {
            notification_date: LessThanOrEqual(dayjs().toDate()),
            last_notified_at: LessThan(dayjs().subtract(30, 'days').toDate()),
            expiration_date: LessThan(dayjs().toDate()),
          },
          {
            notification_date: LessThanOrEqual(dayjs().toDate()),
            last_notified_at: IsNull(),
          },
        ],
        take: batchSize,
        skip: offset,
        relations: {
          profile_details: {
            user: true,
          },
          created_by: true,
        },
      });

      if (certificates.length === 0) break;

      console.log(
        `🔍 Found ${certificates.length} certificates, adding to queue...`,
      );

      for (const cert of certificates) {
        await this.eventEmitter.emitAsync('create-send-notification', {
          user_ids: [cert.created_by.id],
          title: 'Certificate Expiry Warning',
          message: `Your certificate ${cert.name} is about to expire.`,
          is_displayable: true,
          bypass_user_preferences: false,
          channels: [NotificationChannel.EMAIL, NotificationChannel.IN_APP],
          template: EmailTemplate.CERTIFICATE_STATUS,
          entity_type: NotificationEntityType.CERTIFICATE,
          notification_type: NotificationType.TRANSACTION,
          entity_id: cert.id,
          meta_data: {
            name: `${cert.created_by.first_name} ${cert.created_by.last_name}`,
            days_remaining: dayjs(cert.expiration_date).diff(dayjs(), 'days'),
            status: 'warning',
            expiry_date: dayjs
              .utc(cert.expiration_date)
              .tz(cert.created_by.time_zone ?? 'Europe/Lisbon')
              .format('MMMM DD, YYYY'),
            certificate_name: cert.name,
            renew_url: 'will be provided',
          },
        });

        cert.last_notified_at = new Date();
      }

      await this.certificateRepository.save(certificates);

      offset += batchSize;
    }

    console.log(
      '========================================⏳ Scheduled certificate notifications =================================================',
    );
  }
}
