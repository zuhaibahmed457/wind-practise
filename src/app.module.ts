import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { valueToBoolean } from './utils/to-boolean';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { UsersModule } from './modules/users/users.module';
import { SharedModule } from './shared/shared.module';
import { LoggerModule } from './modules/logger/logger.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionsFilter } from './shared/allExceptionFilter/all-exceptions.filter';
import { AllResponseInterceptor } from './shared/interceptors/all-response.interceptor';
import { AdminsModule } from './modules/admins/admins.module';
import { PlansModule } from './modules/plans/plans.module';
import { CountryModule } from './modules/country/country.module';
import { DesignationModule } from './modules/designation/designation.module';
import { EmploymentTypeModule } from './modules/employment-type/employment-type.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { DegreeTypeModule } from './modules/degree-type/degree-type.module';
import { EducationModule } from './modules/education/education.module';
import { SkillsModule } from './modules/skills/skills.module';
import { ProfileDetailsModule } from './modules/profile-details/profile-details.module';
import { PortfolioModule } from './modules/portfolio/portfolio.module';
import { S3Module } from './modules/s3/s3.module';
import { SubscribeModule } from './modules/subscribe/subscribe.module';
import { ContactUsModule } from './modules/contact-us/contact-us.module';
import { SubjectModule } from './modules/subject/subject.module';
import { MediaModule } from './modules/media/media.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { JobPostModule } from './modules/job-post/job-post.module';
import { CertificatesModule } from './modules/certificates/certificates.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { JobApplicantModule } from './modules/job_applicant/job_applicant.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AccessRequestModule } from './modules/access-request/access-request.module';
import { LoggerMiddleware } from './shared/middlewares/logger.middleware';
import { PublicProfileModule } from './modules/public-profile/public-profile.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    CountryModule,
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        ttl: 1 * 60 * 1000, // ** 1 min
        limit: 100, // allowed per ttl
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          autoLoadEntities: true,
          synchronize: valueToBoolean(configService.get('DB_SYNCHRONIZE')),
          timezone: 'UTC',
          // Disiabe for development
          // ssl: {
          //   rejectUnauthorized: false,
          // },
        };
      },
    }),
    NestjsFormDataModule.config({
      isGlobal: true,
      storage: MemoryStoredFile,
    }),
    UsersModule,
    SharedModule,
    LoggerModule,
    AuthModule,
    AdminsModule,
    PlansModule,
    DesignationModule,
    EmploymentTypeModule,
    EmployeeModule,
    SkillsModule,
    EducationModule,
    DegreeTypeModule,
    ProfileDetailsModule,
    PortfolioModule,
    S3Module,
    SubscribeModule,
    SubjectModule,
    ContactUsModule,
    MediaModule,
    SubscriptionsModule,
    InvoicesModule,
    JobPostModule,
    CertificatesModule,
    NotificationsModule,
    JobApplicantModule,
    AccessRequestModule,
    PublicProfileModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AllResponseInterceptor,
    },
    AppService,
    AppService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
