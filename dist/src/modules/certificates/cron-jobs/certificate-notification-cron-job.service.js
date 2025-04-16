"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var CertificateCronService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateCronService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const certificate_entity_1 = require("../entities/certificate.entity");
const notification_entity_1 = require("../../notifications/entities/notification.entity");
const email_template_enum_1 = require("../../notifications/enums/email-template.enum");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
const event_emitter_1 = require("@nestjs/event-emitter");
const config_1 = require("@nestjs/config");
dayjs.extend(utc);
dayjs.extend(timezone);
let CertificateCronService = CertificateCronService_1 = class CertificateCronService {
    constructor(certificateRepository, eventEmitter, configService) {
        this.certificateRepository = certificateRepository;
        this.eventEmitter = eventEmitter;
        this.configService = configService;
        this.logger = new common_1.Logger(CertificateCronService_1.name);
    }
    async scheduleCertificateProcessing() {
        if (!this.configService.get('CRON_ENABLED') ||
            this.configService.get('CRON_ENABLED') === 'false') {
            return;
        }
        console.log('========================================⏳ Scheduling certificate notifications =================================================');
        const batchSize = 1000;
        let offset = 0;
        while (true) {
            const certificates = await this.certificateRepository.find({
                where: [
                    {
                        notification_date: (0, typeorm_2.LessThanOrEqual)(dayjs().toDate()),
                        last_notified_at: (0, typeorm_2.LessThan)(dayjs().subtract(30, 'days').toDate()),
                        expiration_date: (0, typeorm_2.LessThan)(dayjs().toDate()),
                    },
                    {
                        notification_date: (0, typeorm_2.LessThanOrEqual)(dayjs().toDate()),
                        last_notified_at: (0, typeorm_2.IsNull)(),
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
            if (certificates.length === 0)
                break;
            console.log(`🔍 Found ${certificates.length} certificates, adding to queue...`);
            for (const cert of certificates) {
                await this.eventEmitter.emitAsync('create-send-notification', {
                    user_ids: [cert.created_by.id],
                    title: 'Certificate Expiry Warning',
                    message: `Your certificate ${cert.name} is about to expire.`,
                    is_displayable: true,
                    bypass_user_preferences: false,
                    channels: [notification_entity_1.NotificationChannel.EMAIL, notification_entity_1.NotificationChannel.IN_APP],
                    template: email_template_enum_1.EmailTemplate.CERTIFICATE_STATUS,
                    entity_type: notification_entity_1.NotificationEntityType.CERTIFICATE,
                    notification_type: notification_entity_1.NotificationType.TRANSACTION,
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
        console.log('========================================⏳ Scheduled certificate notifications =================================================');
    }
};
exports.CertificateCronService = CertificateCronService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_3_HOURS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CertificateCronService.prototype, "scheduleCertificateProcessing", null);
exports.CertificateCronService = CertificateCronService = CertificateCronService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(certificate_entity_1.Certificate)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        event_emitter_1.EventEmitter2,
        config_1.ConfigService])
], CertificateCronService);
//# sourceMappingURL=certificate-notification-cron-job.service.js.map