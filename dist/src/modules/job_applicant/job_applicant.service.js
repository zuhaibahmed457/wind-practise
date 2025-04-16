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
exports.JobApplicantService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const job_post_entity_1 = require("../job-post/entities/job-post.entity");
const typeorm_2 = require("typeorm");
const job_applicant_entity_1 = require("./entities/job_applicant.entity");
const nestjs_typeorm_paginate_1 = require("nestjs-typeorm-paginate");
const media_entity_1 = require("../media/entities/media.entity");
const event_emitter_1 = require("@nestjs/event-emitter");
const config_1 = require("@nestjs/config");
const notification_entity_1 = require("../notifications/entities/notification.entity");
const email_template_enum_1 = require("../notifications/enums/email-template.enum");
const dayjs = require("dayjs");
const access_request_entity_1 = require("../access-request/entities/access-request.entity");
let JobApplicantService = class JobApplicantService {
    constructor(jobApplicantRepo, jobPostRepo, accessRequestRepo, eventEmitter, configService) {
        this.jobApplicantRepo = jobApplicantRepo;
        this.jobPostRepo = jobPostRepo;
        this.accessRequestRepo = accessRequestRepo;
        this.eventEmitter = eventEmitter;
        this.configService = configService;
    }
    async applyJob(applyJobApplicantDto, currentUser) {
        const jobPost = await this.jobPostRepo.findOne({
            where: {
                id: applyJobApplicantDto.job_post_id,
                status: job_post_entity_1.JobStatus.ACITVE,
                deleted_at: (0, typeorm_2.IsNull)(),
            },
            relations: { user: true },
        });
        if (!jobPost)
            throw new common_1.NotFoundException('Job not found');
        const isAlreadyApplied = await this.jobApplicantRepo.findOne({
            where: {
                job_post: { id: jobPost?.id },
                profile_detail: { id: currentUser?.profile_detail?.id },
            },
        });
        if (isAlreadyApplied)
            throw new common_1.BadRequestException('You already applied to this job');
        ++jobPost.applicant_count;
        await jobPost.save();
        const createAppliedJob = this.jobApplicantRepo.create({
            job_post: jobPost,
            profile_detail: currentUser?.profile_detail,
        });
        const appliedJob = await createAppliedJob.save();
        await this.autoGrantAccess(jobPost?.user?.email, currentUser.profile_detail);
        await this.sendJobApplicationNotifications(jobPost, appliedJob, currentUser);
        return appliedJob;
    }
    async getAllAppliedJobs(getAllApplyJobDto, currentUser) {
        const { status, page, per_page, order, search, date_from, date_to } = getAllApplyJobDto;
        const query = this.jobApplicantRepo
            .createQueryBuilder('job_applicant')
            .leftJoinAndSelect('job_applicant.job_post', 'job_post')
            .leftJoinAndSelect('job_post.designation_type', 'designation')
            .leftJoinAndSelect('job_post.job_type', 'job_type')
            .leftJoinAndSelect('job_post.user', 'organization')
            .leftJoin('job_applicant.profile_detail', 'profile_details')
            .leftJoin('profile_details.user', 'user')
            .where('user.id = :user_id AND job_post.status = :job_status', {
            user_id: currentUser?.id,
            job_status: job_post_entity_1.JobStatus.ACITVE,
        });
        if (status) {
            query.andWhere('job_applicant.status = :status', { status });
        }
        if (search) {
            query.andWhere('(job_post.title ILIKE :search OR organization.full_name ILIKE :search OR organization.email ILIKE :search)', { search: `%${search}%` });
        }
        if (date_from) {
            query.andWhere('job_applicant.created_at >= :date_from', {
                date_from,
            });
        }
        if (date_to) {
            query.andWhere('job_applicant.created_at <= :date_to', {
                date_to,
            });
        }
        query
            .groupBy('job_applicant.id')
            .addGroupBy('job_post.id')
            .addGroupBy('designation.id')
            .addGroupBy('job_type.id')
            .addGroupBy('organization.id')
            .orderBy('job_applicant.created_at', order ?? 'DESC');
        const paginationOptions = {
            page,
            limit: per_page,
        };
        return await (0, nestjs_typeorm_paginate_1.paginate)(query, paginationOptions);
    }
    async getAppliedJob({ id }, currentUser) {
        const appliedJob = await this.jobApplicantRepo.findOne({
            where: {
                id,
                profile_detail: {
                    user: {
                        id: currentUser?.id,
                    },
                },
            },
            relations: {
                job_post: {
                    designation_type: true,
                    job_type: true,
                    user: true,
                },
            },
        });
        if (!appliedJob)
            throw new common_1.NotFoundException('Applied Job not found');
        return appliedJob;
    }
    async findAll(getAllApplicantsDto, currentUser) {
        const { page, per_page, search, status, designation_id, job_type_id } = getAllApplicantsDto;
        const query = this.jobApplicantRepo
            .createQueryBuilder('job_applicant')
            .leftJoinAndSelect('job_applicant.job_post', 'job_post')
            .leftJoinAndSelect('job_post.job_type', 'job_types')
            .leftJoinAndSelect('job_post.designation_type', 'designation')
            .leftJoinAndSelect('job_applicant.profile_detail', 'profile_details')
            .leftJoinAndSelect('profile_details.user', 'user')
            .leftJoin('job_post.user', 'organization')
            .where('organization.id = :organization_id', {
            organization_id: currentUser?.id,
        });
        if (status) {
            query.andWhere('job_applicant.status = :status', { status });
        }
        if (job_type_id) {
            query.andWhere('job_types.id IN (:...job_type_id)', { job_type_id });
        }
        if (designation_id) {
            query.andWhere('designation.id IN (:...designation_id)', {
                designation_id,
            });
        }
        query.orderBy('job_applicant.created_at', 'DESC');
        const paginationOptions = {
            page,
            limit: per_page,
        };
        return await (0, nestjs_typeorm_paginate_1.paginate)(query, paginationOptions);
    }
    async findOne({ id }, currentUser) {
        const applicantDetails = await this.jobApplicantRepo
            .createQueryBuilder('job_applicant')
            .leftJoinAndSelect('job_applicant.profile_detail', 'profile_details')
            .leftJoinAndSelect('profile_details.educations', 'education')
            .leftJoinAndSelect('profile_details.skills', 'skills')
            .leftJoinAndSelect('profile_details.portfolio', 'portfolio')
            .leftJoinAndMapMany('portfolio.media', media_entity_1.Media, 'media', 'media.entity_id::uuid = portfolio.id AND media.entity_type = :entity_type', { entity_type: media_entity_1.EntityType.PORTFOLIO })
            .leftJoinAndSelect('profile_details.user', 'user')
            .where('job_applicant.id = :id', { id })
            .getOne();
        if (!applicantDetails)
            throw new common_1.NotFoundException('Applicant Details not found');
        return applicantDetails;
    }
    async manageStatus({ id }, manageJobApplicantStatusDto, currentUser) {
        const jobApplicant = await this.jobApplicantRepo.findOne({
            where: {
                id,
                job_post: {
                    user: {
                        id: currentUser?.id,
                    },
                },
            },
            relations: {
                job_post: {
                    user: true,
                },
                profile_detail: {
                    user: true,
                },
            },
        });
        if (!jobApplicant)
            throw new common_1.NotFoundException('Job applicant not found');
        const oldStatus = jobApplicant.status;
        Object.assign(jobApplicant, manageJobApplicantStatusDto);
        const updatedJobApplicant = await jobApplicant.save();
        if (oldStatus !== manageJobApplicantStatusDto.status) {
            const getNotificationTitle = (status) => {
                switch (status.toLowerCase()) {
                    case 'viewed':
                        return 'Your application has been viewed';
                    case 'shortlisted':
                        return 'Congratulations! You have been shortlisted';
                    case 'interviewing':
                        return 'Great news! You are moving to the interview stage';
                    case 'accept':
                        return 'Congratulations! Your application has been accepted';
                    case 'reject':
                        return 'Update on your job application';
                    default:
                        return 'Your application status has been updated';
                }
            };
            const getStatusClass = (status) => {
                switch (status.toLowerCase()) {
                    case 'viewed':
                        return 'viewed';
                    case 'shortlisted':
                        return 'shortlisted';
                    case 'interviewing':
                        return 'interviewing';
                    case 'accept':
                        return 'accepted';
                    case 'reject':
                        return 'rejected';
                    default:
                        return 'pending';
                }
            };
            await this.eventEmitter.emitAsync('create-send-notification', {
                user_ids: [jobApplicant.profile_detail.user.id],
                title: getNotificationTitle(manageJobApplicantStatusDto.status),
                message: `Your job application status for ${jobApplicant.job_post.title} has been updated to ${manageJobApplicantStatusDto.status}`,
                template: email_template_enum_1.EmailTemplate.JOB_APPLICATION_STATUS_UPDATE,
                notification_type: notification_entity_1.NotificationType.TRANSACTION,
                is_displayable: true,
                channels: [notification_entity_1.NotificationChannel.EMAIL, notification_entity_1.NotificationChannel.IN_APP],
                bypass_user_preferences: true,
                entity_type: notification_entity_1.NotificationEntityType.JOB_APPLICANT,
                entity_id: jobApplicant.id,
                meta_data: {
                    notification_title: getNotificationTitle(manageJobApplicantStatusDto.status),
                    technician_name: `${jobApplicant.profile_detail.user.first_name} ${jobApplicant.profile_detail.user.last_name}`,
                    organization_name: `${jobApplicant.job_post.user.first_name} ${jobApplicant.job_post.user.last_name}`,
                    organization_logo: jobApplicant.job_post.user.profile_image,
                    job_title: jobApplicant.job_post.title,
                    status: manageJobApplicantStatusDto.status,
                    status_class: getStatusClass(manageJobApplicantStatusDto.status),
                    feedback: manageJobApplicantStatusDto.feedback || '',
                    update_date: dayjs().format('MMMM D, YYYY'),
                    application_date: dayjs(jobApplicant.created_at).format('MMMM D, YYYY'),
                    dashboard_link: `${this.configService.get('FRONTEND_URL')}/technician/applied-jobs?id=${jobApplicant?.id}`,
                },
            });
        }
        return updatedJobApplicant;
    }
    async autoGrantAccess(email, requestedBy) {
        await this.createAccessRequest(email, requestedBy);
    }
    async createAccessRequest(requested_from, requested_by) {
        const accessRequest = this.accessRequestRepo.create({
            requested_by: requested_by,
            requested_from,
            status: access_request_entity_1.RequestStatus.APPROVED,
            purpose: access_request_entity_1.RequestPurpose.AUTO_ACCESS,
        });
        await accessRequest.save();
    }
    async sendJobApplicationNotifications(jobPost, appliedJob, currentUser) {
        await this.eventEmitter.emitAsync('create-send-notification', {
            user_ids: [jobPost?.user?.id],
            title: `New Job Application Received`,
            message: `You have received a new job application for the position of ${jobPost.title}`,
            template: email_template_enum_1.EmailTemplate.JOB_APPLICATION_ORGANIZATION,
            notification_type: notification_entity_1.NotificationType.TRANSACTION,
            is_displayable: true,
            channels: [notification_entity_1.NotificationChannel.EMAIL, notification_entity_1.NotificationChannel.IN_APP],
            bypass_user_preferences: true,
            entity_type: notification_entity_1.NotificationEntityType.JOB_APPLICANT,
            entity_id: appliedJob?.id,
            meta_data: {
                organization_name: `${jobPost?.user?.first_name} ${jobPost?.user?.last_name}`,
                job_title: jobPost?.title,
                technician_name: `${currentUser.first_name} ${currentUser.last_name}`,
                technician_email: currentUser?.email,
                application_date: dayjs(appliedJob.applied_at).format('MMMM D, YYYY'),
                dashboard_link: `${this.configService.get('FRONTEND_URL')}/organization/applicants/${appliedJob?.id}`,
            },
        });
        await this.eventEmitter.emitAsync('create-send-notification', {
            user_ids: [currentUser?.id],
            title: `Job Application Confirmation`,
            message: `Thank you for applying to the position at ${jobPost?.user?.first_name} ${jobPost?.user?.last_name}. Your application has been successfully submitted.`,
            template: email_template_enum_1.EmailTemplate.JOB_APPLICATION_TECHNICIAN,
            notification_type: notification_entity_1.NotificationType.TRANSACTION,
            is_displayable: true,
            channels: [notification_entity_1.NotificationChannel.EMAIL],
            bypass_user_preferences: true,
            entity_type: notification_entity_1.NotificationEntityType.JOB_APPLICANT,
            entity_id: appliedJob?.id,
            meta_data: {
                technician_name: `${currentUser.first_name} ${currentUser.last_name}`,
                organization_name: `${jobPost?.user?.first_name} ${jobPost?.user?.last_name}`,
                job_title: jobPost?.title,
                application_date: dayjs(appliedJob.applied_at).format('MMMM D, YYYY'),
                dashboard_link: `${this.configService.get('FRONTEND_URL')}/technician/applied-jobs?id=${appliedJob?.id}`,
            },
        });
    }
};
exports.JobApplicantService = JobApplicantService;
exports.JobApplicantService = JobApplicantService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(job_applicant_entity_1.JobApplicant)),
    __param(1, (0, typeorm_1.InjectRepository)(job_post_entity_1.JobPost)),
    __param(2, (0, typeorm_1.InjectRepository)(access_request_entity_1.AccessRequest)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        event_emitter_1.EventEmitter2,
        config_1.ConfigService])
], JobApplicantService);
//# sourceMappingURL=job_applicant.service.js.map