import { Module } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { CertificatesController } from './certificates.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Certificate } from './entities/certificate.entity';
import { SharedModule } from 'src/shared/shared.module';
import { CertificateHistory } from './entities/certificate-history.entity';
import { S3Module } from '../s3/s3.module';
import { CertificateCronService } from './cron-jobs/certificate-notification-cron-job.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { ProfileDetails } from '../profile-details/entities/profile-details.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Certificate, CertificateHistory, ProfileDetails]),
    S3Module,
    SharedModule,
    NotificationsModule,
  ],
  controllers: [CertificatesController],
  providers: [CertificatesService, CertificateCronService],
  exports: [CertificatesService],
})
export class CertificatesModule {}
