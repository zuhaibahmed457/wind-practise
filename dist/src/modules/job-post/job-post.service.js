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
exports.JobPostService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const job_post_entity_1 = require("./entities/job-post.entity");
const typeorm_2 = require("typeorm");
const designation_entity_1 = require("../designation/entities/designation.entity");
const employment_type_entity_1 = require("../employment-type/entities/employment-type.entity");
const user_entity_1 = require("../users/entities/user.entity");
const nestjs_typeorm_paginate_1 = require("nestjs-typeorm-paginate");
const event_emitter_1 = require("@nestjs/event-emitter");
const notification_entity_1 = require("../notifications/entities/notification.entity");
let JobPostService = class JobPostService {
    constructor(jobPostRepo, userRepo, designationRepo, jobTypeRepo, eventEmitter) {
        this.jobPostRepo = jobPostRepo;
        this.userRepo = userRepo;
        this.designationRepo = designationRepo;
        this.jobTypeRepo = jobTypeRepo;
        this.eventEmitter = eventEmitter;
    }
    async create(createJobPostDto, currentUser) {
        const { designation_id, job_type_id, ...bodyDto } = createJobPostDto;
        const jobTypes = await this.jobTypeRepo
            .createQueryBuilder('job_type')
            .where('job_type.id IN (:...job_type_id)', {
            job_type_id: createJobPostDto?.job_type_id,
        })
            .getMany();
        if (!jobTypes.length)
            throw new common_1.NotFoundException('Job types not found');
        const designations = await this.designationRepo
            .createQueryBuilder('designation')
            .leftJoin('designation.created_by', 'user')
            .where('user.id = :user_id AND designation.id IN (:...designation_id) AND designation.deleted_at IS NULL', {
            user_id: currentUser?.id,
            designation_id: createJobPostDto?.designation_id,
        })
            .getMany();
        if (!designations.length)
            throw new common_1.NotFoundException('Designation not found');
        const jobPost = this.jobPostRepo.create({
            user: currentUser,
            job_type: jobTypes,
            designation_type: designations,
            ...bodyDto,
        });
        const technicains = await this.userRepo.find({
            where: {
                role: user_entity_1.UserRole.TECHNICIAN,
                status: user_entity_1.UserStatus.ACTIVE,
                deleted_at: (0, typeorm_2.IsNull)(),
            },
        });
        await this.eventEmitter.emitAsync('create-send-notification', {
            user_ids: technicains.map((item) => item.id),
            title: `New Job Post: ${jobPost?.title}`,
            message: `A new job opportunity is available at ${jobPost?.user?.first_name} ${jobPost?.user?.last_name}. Check out the details and apply now!`,
            notification_type: notification_entity_1.NotificationType.TRANSACTION,
            is_displayable: true,
            channels: [notification_entity_1.NotificationChannel.IN_APP],
            bypass_user_preferences: true,
            entity_type: notification_entity_1.NotificationEntityType.JOB_POST,
            entity_id: jobPost?.id,
        });
        return await jobPost.save();
    }
    async findAll(getAllJobPostDto, currentUser) {
        const { page, per_page, search, max_experience, min_experience, status, designation_id, job_type_id, is_archive, date_from, date_to, order, exclude_applied_jobs, } = getAllJobPostDto;
        const query = this.jobPostRepo
            .createQueryBuilder('job_post')
            .leftJoinAndSelect('job_post.job_type', 'job_type')
            .leftJoinAndSelect('job_post.designation_type', 'designation_type')
            .leftJoinAndSelect('job_post.user', 'user');
        if (exclude_applied_jobs && currentUser?.profile_detail?.id) {
            query
                .leftJoin('job_post.job_applicants', 'job_applicant', 'job_applicant.profile_detail.id = :profileDetailId', { profileDetailId: currentUser.profile_detail.id })
                .andWhere('job_applicant.id IS NULL');
        }
        if ([user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.ADMIN].includes(currentUser?.role) &&
            status) {
            query.andWhere('job_post.status = :status', { status });
        }
        if ([user_entity_1.UserRole.ORGANIZATION].includes(currentUser?.role)) {
            query.andWhere('job_post.user.id = :organization_id AND job_post.status = :status ', {
                organization_id: currentUser?.id,
                status: job_post_entity_1.JobStatus.ACITVE,
            });
            if (is_archive === true || is_archive === false) {
                query.andWhere('job_post.is_archive = :is_archive', { is_archive });
            }
        }
        if ([user_entity_1.UserRole.TECHNICIAN].includes(currentUser?.role)) {
            query.andWhere('job_post.status = :status AND job_post.is_archive = false', { status: job_post_entity_1.JobStatus.ACITVE });
        }
        if (search) {
            query.andWhere(`(job_post.title ILIKE :search OR job_post.city ILIKE :search OR array_to_string(job_post.qualification, ',') ILIKE :search OR user.full_name ILIKE :search OR user.email ILIKE :search)`, {
                search: `%${search}%`,
            });
        }
        if (date_from) {
            query.andWhere('job_post.created_at >= :date_from', {
                date_from,
            });
        }
        if (date_to) {
            query.andWhere('job_post.created_at <= :date_to', {
                date_to,
            });
        }
        if (designation_id) {
            query.andWhere('designation_type.id IN (:...designation_id)', {
                designation_id,
            });
        }
        if (job_type_id) {
            query.andWhere('job_type.id IN (:...job_type_id)', { job_type_id });
        }
        if (min_experience) {
            query.andWhere('job_post.min_experience = :min_experience', {
                min_experience,
            });
        }
        if (max_experience) {
            query.andWhere('job_post.max_experience >= :max_experience', {
                max_experience,
            });
        }
        query
            .groupBy('job_post.id')
            .addGroupBy('user.id')
            .addGroupBy('job_type.id')
            .addGroupBy('designation_type.id')
            .distinctOn(['job_post.created_at', 'job_post.id'])
            .orderBy('job_post.created_at', order ?? 'DESC');
        const paginationOptions = {
            page,
            limit: per_page,
        };
        return await (0, nestjs_typeorm_paginate_1.paginate)(query, paginationOptions);
    }
    async findOne({ id }, currentUser) {
        const jobPost = await this.jobPostRepo.findOne({
            where: {
                id,
                deleted_at: (0, typeorm_2.IsNull)(),
            },
            relations: {
                user: true,
                job_type: true,
                designation_type: true,
            },
        });
        if (!jobPost)
            throw new common_1.NotFoundException('Job post not found');
        if ([user_entity_1.UserRole.ORGANIZATION, user_entity_1.UserRole.TECHNICIAN].includes(currentUser?.role) &&
            jobPost?.status !== job_post_entity_1.JobStatus.ACITVE) {
            throw new common_1.BadRequestException('Job post not found');
        }
        return jobPost;
    }
    async update({ id }, currentUser, updateJobPostDto) {
        const jobPost = await this.jobPostRepo.findOne({
            where: {
                id,
                deleted_at: (0, typeorm_2.IsNull)(),
                user: {
                    id: currentUser?.id,
                },
            },
        });
        if (!jobPost)
            throw new common_1.NotFoundException('Job post not found');
        if (updateJobPostDto?.job_type_id) {
            const jobTypes = await this.jobTypeRepo.find({
                where: {
                    id: (0, typeorm_2.In)(updateJobPostDto?.job_type_id),
                    deleted_at: (0, typeorm_2.IsNull)(),
                },
            });
            if (!jobTypes.length)
                throw new common_1.NotFoundException('Job type not found');
            jobPost.job_type = jobTypes;
        }
        if (updateJobPostDto?.designation_id) {
            const designations = await this.designationRepo.find({
                where: {
                    id: (0, typeorm_2.In)(updateJobPostDto?.designation_id),
                    created_by: {
                        id: currentUser?.id,
                    },
                },
            });
            if (!designations.length)
                throw new common_1.NotFoundException('Designation not found');
            jobPost.designation_type = designations;
        }
        Object.assign(jobPost, updateJobPostDto);
        return await jobPost.save();
    }
    async toggleArchive({ id }, toggleArchiveDto, currentUser) {
        const jobPost = await this.jobPostRepo.findOne({
            where: {
                id,
                deleted_at: (0, typeorm_2.IsNull)(),
                user: {
                    id: currentUser?.id,
                },
            },
        });
        if (!jobPost)
            throw new common_1.NotFoundException('Job post not found');
        Object.assign(jobPost, toggleArchiveDto);
        return jobPost.save();
    }
    async manageStatus({ id }, manageJobPostStatusDto, currentUser) {
        const jobPost = await this.jobPostRepo.findOne({
            where: {
                id,
                deleted_at: (0, typeorm_2.IsNull)(),
            },
        });
        if (!jobPost)
            throw new common_1.NotFoundException('Job post not found');
        Object.assign(jobPost, manageJobPostStatusDto);
        return jobPost.save();
    }
    async remove({ id }, currentUser) {
        const jobPost = await this.jobPostRepo.findOne({
            where: {
                id,
                deleted_at: (0, typeorm_2.IsNull)(),
                user: {
                    id: currentUser?.id,
                },
            },
        });
        if (!jobPost)
            throw new common_1.NotFoundException('Job post not found');
        await jobPost.softRemove();
    }
};
exports.JobPostService = JobPostService;
exports.JobPostService = JobPostService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(job_post_entity_1.JobPost)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(designation_entity_1.Designation)),
    __param(3, (0, typeorm_1.InjectRepository)(employment_type_entity_1.EmploymentType)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        event_emitter_1.EventEmitter2])
], JobPostService);
//# sourceMappingURL=job-post.service.js.map