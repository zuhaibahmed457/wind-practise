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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessRequestService = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../users/entities/user.entity");
const typeorm_1 = require("@nestjs/typeorm");
const access_request_entity_1 = require("./entities/access-request.entity");
const typeorm_2 = require("typeorm");
const profile_details_entity_1 = require("../profile-details/entities/profile-details.entity");
const nestjs_typeorm_paginate_1 = require("nestjs-typeorm-paginate");
const event_emitter_1 = require("@nestjs/event-emitter");
const email_template_enum_1 = require("../notifications/enums/email-template.enum");
const notification_entity_1 = require("../notifications/entities/notification.entity");
const text_capitalize_1 = require("../../utils/text-capitalize");
const config_1 = require("@nestjs/config");
const portfolio_entity_1 = require("../portfolio/entities/portfolio.entity");
const certificate_entity_1 = require("../certificates/entities/certificate.entity");
const email_notification_service_1 = require("../notifications/services/email-notification.service");
let AccessRequestService = class AccessRequestService {
    constructor(accessRequestRepo, profileDetailsRepo, portfolioRepo, certificateRepo, eventEmitter, configService, emailNotificationService) {
        this.accessRequestRepo = accessRequestRepo;
        this.profileDetailsRepo = profileDetailsRepo;
        this.portfolioRepo = portfolioRepo;
        this.certificateRepo = certificateRepo;
        this.eventEmitter = eventEmitter;
        this.configService = configService;
        this.emailNotificationService = emailNotificationService;
    }
    async create(createAccessRequestDto) {
        const { email, requested_by_id } = createAccessRequestDto;
        const requestType = [access_request_entity_1.RequestType.PORTFOLIO, access_request_entity_1.RequestType.CERTIFICATE];
        const profileDetails = await this.profileDetailsRepo.findOne({
            where: {
                id: requested_by_id,
                deleted_at: (0, typeorm_2.IsNull)(),
            },
            relations: { user: true },
        });
        if (!profileDetails)
            throw new common_1.NotFoundException('Profile Details not found');
        const portfolioCount = await this.portfolioRepo.count({
            where: {
                profile_details: {
                    id: profileDetails?.id,
                    deleted_at: (0, typeorm_2.IsNull)(),
                },
            },
        });
        if (!portfolioCount) {
            throw new common_1.NotFoundException(`${profileDetails?.user?.role} ${access_request_entity_1.RequestType.PORTFOLIO} does not exist`);
        }
        const certificateCount = await this.certificateRepo.count({
            where: {
                profile_details: {
                    id: profileDetails?.id,
                    deleted_at: (0, typeorm_2.IsNull)(),
                },
            },
        });
        if (!portfolioCount && !certificateCount) {
            throw new common_1.NotFoundException(`${profileDetails?.user?.role} ${access_request_entity_1.RequestType.PORTFOLIO} And ${access_request_entity_1.RequestType.CERTIFICATE} does not exist`);
        }
        const accessRequest = this.accessRequestRepo.create({
            requested_from: email,
            requested_by: profileDetails,
        });
        const saveAccessRequest = await accessRequest.save();
        await this.eventEmitter.emitAsync('create-send-notification', {
            user_ids: [profileDetails?.user?.id],
            title: `New Access Request For ${(0, text_capitalize_1.textCapitalize)(access_request_entity_1.RequestType.PORTFOLIO)} and ${(0, text_capitalize_1.textCapitalize)(access_request_entity_1.RequestType.CERTIFICATE)}`,
            message: `this email: ${email} has requested access from you. Please review the request.`,
            template: email_template_enum_1.EmailTemplate.ACCESS_REQUEST_FROM,
            notification_type: notification_entity_1.NotificationType.TRANSACTION,
            is_displayable: true,
            channels: [notification_entity_1.NotificationChannel.EMAIL, notification_entity_1.NotificationChannel.IN_APP],
            bypass_user_preferences: true,
            entity_type: notification_entity_1.NotificationEntityType.ACCESS_REQUEST,
            entity_id: accessRequest?.id,
            meta_data: {
                full_name: `${profileDetails?.user?.first_name} ${profileDetails?.user?.last_name}`,
                request_type: `${(0, text_capitalize_1.textCapitalize)(access_request_entity_1.RequestType.PORTFOLIO)} AND ${(0, text_capitalize_1.textCapitalize)(access_request_entity_1.RequestType.CERTIFICATE)}`,
                email,
                request_url: `${this.configService.get('FRONTEND_URL')}/technician/access_requests`,
            },
        });
        return saveAccessRequest;
    }
    async viewAccessRequest(viewAccessRequestDto) {
        const { email, requested_by_id } = viewAccessRequestDto;
        const profileDetails = await this.profileDetailsRepo.findOne({
            where: {
                id: requested_by_id,
                deleted_at: (0, typeorm_2.IsNull)(),
            },
            relations: { user: true },
        });
        if (!profileDetails)
            throw new common_1.NotFoundException('Profile Details not found');
        const accessRequest = await this.accessRequestRepo.findOne({
            where: {
                requested_from: email,
                requested_by: {
                    id: profileDetails?.id,
                },
            },
            order: { created_at: 'DESC' },
        });
        if (!accessRequest)
            throw new common_1.NotFoundException('Please Request First');
        return accessRequest;
    }
    async findAll(getAllAccessRequestDto, currentUser) {
        const { page, per_page, status } = getAllAccessRequestDto;
        const query = this.accessRequestRepo
            .createQueryBuilder('request')
            .leftJoin('request.requested_by', 'reciever')
            .leftJoin('reciever.user', 'reciever_user')
            .where('reciever_user.id = :user_id', { user_id: currentUser?.id });
        if (status) {
            query.andWhere('request.status = :status', { status });
        }
        query.orderBy('request.created_at', 'DESC');
        const paginationOptions = {
            page,
            limit: per_page,
        };
        return await (0, nestjs_typeorm_paginate_1.paginate)(query, paginationOptions);
    }
    async findOne({ id }, currentUser) {
        const accessRequest = await this.accessRequestRepo.findOne({
            where: {
                id,
            },
            relations: {
                requested_by: {
                    user: true,
                },
            },
        });
        if (!accessRequest)
            throw new common_1.NotFoundException('Access Request not found');
        if ([user_entity_1.UserRole.TECHNICIAN].includes(currentUser.role) &&
            accessRequest?.requested_by?.id !== currentUser?.profile_detail?.id) {
            throw new common_1.ForbiddenException('You do not have permission to view this request');
        }
        return accessRequest;
    }
    async manageStatus({ id }, currentUser, manageAccessRequestDto) {
        const accessRequest = await this.accessRequestRepo.findOne({
            where: {
                id,
                requested_by: {
                    user: {
                        id: currentUser?.id,
                    },
                },
            },
            relations: {
                requested_by: {
                    user: true,
                },
            },
        });
        if (!accessRequest)
            throw new common_1.NotFoundException('Access Request not found');
        Object.assign(accessRequest, manageAccessRequestDto);
        const updatedAccessRequest = await accessRequest.save();
        const requesterEmail = accessRequest.requested_from;
        const payload = {
            title: `Access Request ${(0, text_capitalize_1.textCapitalize)(updatedAccessRequest?.status)} For Certificate And Portfolio`,
            message: `Your access request for Certificate And Portfolio has been approved by ${currentUser.first_name} ${currentUser.last_name}.`,
            request_type: 'Certificate And Portfolio',
            status: `${updatedAccessRequest?.status}`,
            status_class: `${updatedAccessRequest?.status}`,
            approved_by: `${currentUser.first_name} ${currentUser.last_name}`,
            requested_to_email: currentUser?.email,
            access_link: `${this.configService.get('FRONTEND_URL')}/profile_details/${currentUser?.profile_detail?.id}`,
            is_approved: updatedAccessRequest?.status === 'approved' ? true : false,
        };
        await this.emailNotificationService.sendAccessRequestConfirmationEmail(requesterEmail, payload);
        return updatedAccessRequest;
    }
    async remove({ id }, currentUser) {
        const accessRequest = await this.accessRequestRepo.findOne({
            where: {
                id,
            },
            relations: {
                requested_by: {
                    user: true,
                },
            },
        });
        if (!accessRequest)
            throw new common_1.NotFoundException('Access Request not found');
        if ([user_entity_1.UserRole.TECHNICIAN].includes(currentUser.role) &&
            accessRequest?.requested_by?.id !== currentUser?.profile_detail?.id) {
            throw new common_1.ForbiddenException('You do not have permission to view this request');
        }
        await this.accessRequestRepo.delete(id);
        return;
    }
};
exports.AccessRequestService = AccessRequestService;
exports.AccessRequestService = AccessRequestService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(access_request_entity_1.AccessRequest)),
    __param(1, (0, typeorm_1.InjectRepository)(profile_details_entity_1.ProfileDetails)),
    __param(2, (0, typeorm_1.InjectRepository)(portfolio_entity_1.Portfolio)),
    __param(3, (0, typeorm_1.InjectRepository)(certificate_entity_1.Certificate)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        event_emitter_1.EventEmitter2,
        config_1.ConfigService,
        email_notification_service_1.EmailNotificationService])
], AccessRequestService);
//# sourceMappingURL=access-request.service.js.map