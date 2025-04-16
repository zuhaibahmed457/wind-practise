"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const schedule_1 = require("@nestjs/schedule");
const throttler_1 = require("@nestjs/throttler");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const to_boolean_1 = require("./utils/to-boolean");
const nestjs_form_data_1 = require("nestjs-form-data");
const users_module_1 = require("./modules/users/users.module");
const shared_module_1 = require("./shared/shared.module");
const logger_module_1 = require("./modules/logger/logger.module");
const auth_module_1 = require("./modules/auth/auth.module");
const core_1 = require("@nestjs/core");
const all_exceptions_filter_1 = require("./shared/allExceptionFilter/all-exceptions.filter");
const all_response_interceptor_1 = require("./shared/interceptors/all-response.interceptor");
const admins_module_1 = require("./modules/admins/admins.module");
const plans_module_1 = require("./modules/plans/plans.module");
const country_module_1 = require("./modules/country/country.module");
const designation_module_1 = require("./modules/designation/designation.module");
const employment_type_module_1 = require("./modules/employment-type/employment-type.module");
const employee_module_1 = require("./modules/employee/employee.module");
const degree_type_module_1 = require("./modules/degree-type/degree-type.module");
const education_module_1 = require("./modules/education/education.module");
const skills_module_1 = require("./modules/skills/skills.module");
const profile_details_module_1 = require("./modules/profile-details/profile-details.module");
const portfolio_module_1 = require("./modules/portfolio/portfolio.module");
const s3_module_1 = require("./modules/s3/s3.module");
const subscribe_module_1 = require("./modules/subscribe/subscribe.module");
const contact_us_module_1 = require("./modules/contact-us/contact-us.module");
const subject_module_1 = require("./modules/subject/subject.module");
const media_module_1 = require("./modules/media/media.module");
const subscriptions_module_1 = require("./modules/subscriptions/subscriptions.module");
const invoices_module_1 = require("./modules/invoices/invoices.module");
const job_post_module_1 = require("./modules/job-post/job-post.module");
const certificates_module_1 = require("./modules/certificates/certificates.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const job_applicant_module_1 = require("./modules/job_applicant/job_applicant.module");
const event_emitter_1 = require("@nestjs/event-emitter");
const access_request_module_1 = require("./modules/access-request/access-request.module");
const logger_middleware_1 = require("./shared/middlewares/logger.middleware");
const public_profile_module_1 = require("./modules/public-profile/public-profile.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(logger_middleware_1.LoggerMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            country_module_1.CountryModule,
            event_emitter_1.EventEmitterModule.forRoot(),
            schedule_1.ScheduleModule.forRoot(),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 1 * 60 * 1000,
                    limit: 100,
                },
            ]),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: `.env.${process.env.NODE_ENV}`,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    return {
                        type: 'postgres',
                        host: configService.get('DB_HOST'),
                        port: configService.get('DB_PORT'),
                        username: configService.get('DB_USERNAME'),
                        password: configService.get('DB_PASSWORD'),
                        database: configService.get('DB_DATABASE'),
                        autoLoadEntities: true,
                        synchronize: (0, to_boolean_1.valueToBoolean)(configService.get('DB_SYNCHRONIZE')),
                        timezone: 'UTC',
                    };
                },
            }),
            nestjs_form_data_1.NestjsFormDataModule.config({
                isGlobal: true,
                storage: nestjs_form_data_1.MemoryStoredFile,
            }),
            users_module_1.UsersModule,
            shared_module_1.SharedModule,
            logger_module_1.LoggerModule,
            auth_module_1.AuthModule,
            admins_module_1.AdminsModule,
            plans_module_1.PlansModule,
            designation_module_1.DesignationModule,
            employment_type_module_1.EmploymentTypeModule,
            employee_module_1.EmployeeModule,
            skills_module_1.SkillsModule,
            education_module_1.EducationModule,
            degree_type_module_1.DegreeTypeModule,
            profile_details_module_1.ProfileDetailsModule,
            portfolio_module_1.PortfolioModule,
            s3_module_1.S3Module,
            subscribe_module_1.SubscribeModule,
            subject_module_1.SubjectModule,
            contact_us_module_1.ContactUsModule,
            media_module_1.MediaModule,
            subscriptions_module_1.SubscriptionsModule,
            invoices_module_1.InvoicesModule,
            job_post_module_1.JobPostModule,
            certificates_module_1.CertificatesModule,
            notifications_module_1.NotificationsModule,
            job_applicant_module_1.JobApplicantModule,
            access_request_module_1.AccessRequestModule,
            public_profile_module_1.PublicProfileModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
            {
                provide: core_1.APP_FILTER,
                useClass: all_exceptions_filter_1.AllExceptionsFilter,
            },
            app_service_1.AppService,
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: all_response_interceptor_1.AllResponseInterceptor,
            },
            app_service_1.AppService,
            app_service_1.AppService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map