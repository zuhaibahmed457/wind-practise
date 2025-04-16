import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ApplyJobApplicantDto } from './dto/apply-job_applicant.dto';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JobPost, JobStatus } from '../job-post/entities/job-post.entity';
import { IsNull, Repository } from 'typeorm';
import { JobApplicant } from './entities/job_applicant.entity';
import { GetAllApplyJobDto } from './dto/get-all-apply-job.dto';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { GetAllApplicantsDto } from './dto/get-all-applicants.dto';
import { EntityType, Media } from '../media/entities/media.entity';
import { ManageJobApplicantStatusDto } from './dto/manage-job-applicant-status.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import {
  NotificationChannel,
  NotificationEntityType,
  NotificationType,
} from '../notifications/entities/notification.entity';
import { EmailTemplate } from '../notifications/enums/email-template.enum';
import * as dayjs from 'dayjs';
import {
  AccessRequest,
  RequestPurpose,
  RequestStatus,
  RequestType,
} from '../access-request/entities/access-request.entity';
import { ProfileDetails } from '../profile-details/entities/profile-details.entity';

@Injectable()
export class JobApplicantService {
  constructor(
    @InjectRepository(JobApplicant)
    private readonly jobApplicantRepo: Repository<JobApplicant>,
    @InjectRepository(JobPost)
    private readonly jobPostRepo: Repository<JobPost>,
    @InjectRepository(AccessRequest)
    private readonly accessRequestRepo: Repository<AccessRequest>,
    private readonly eventEmitter: EventEmitter2,
    private readonly configService: ConfigService,
  ) {}

  async applyJob(
    applyJobApplicantDto: ApplyJobApplicantDto,
    currentUser: User,
  ) {
    const jobPost = await this.jobPostRepo.findOne({
      where: {
        id: applyJobApplicantDto.job_post_id,
        status: JobStatus.ACITVE,
        deleted_at: IsNull(),
      },
      relations: { user: true },
    });

    if (!jobPost) throw new NotFoundException('Job not found');

    const isAlreadyApplied = await this.jobApplicantRepo.findOne({
      where: {
        job_post: { id: jobPost?.id },
        profile_detail: { id: currentUser?.profile_detail?.id },
      },
    });

    if (isAlreadyApplied)
      throw new BadRequestException('You already applied to this job');

    ++jobPost.applicant_count;
    await jobPost.save();

    const createAppliedJob = this.jobApplicantRepo.create({
      job_post: jobPost,
      profile_detail: currentUser?.profile_detail,
    });

    const appliedJob = await createAppliedJob.save();

    // Auto-grant portfolio & certificate access
    await this.autoGrantAccess(
      jobPost?.user?.email,
      currentUser.profile_detail,
    );

    // Send notifications separately
    await this.sendJobApplicationNotifications(
      jobPost,
      appliedJob,
      currentUser,
    );

    return appliedJob;
  }

  async getAllAppliedJobs(
    getAllApplyJobDto: GetAllApplyJobDto,
    currentUser: User,
  ) {
    const { status, page, per_page, order, search, date_from, date_to } =
      getAllApplyJobDto;

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
        job_status: JobStatus.ACITVE,
      });

    if (status) {
      query.andWhere('job_applicant.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(job_post.title ILIKE :search OR organization.full_name ILIKE :search OR organization.email ILIKE :search)',
        { search: `%${search}%` },
      );
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

    const paginationOptions: IPaginationOptions = {
      page,
      limit: per_page,
    };

    return await paginate(query, paginationOptions);
  }

  async getAppliedJob({ id }: ParamIdDto, currentUser: User) {
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

    if (!appliedJob) throw new NotFoundException('Applied Job not found');

    return appliedJob;
  }

  async findAll(getAllApplicantsDto: GetAllApplicantsDto, currentUser: User) {
    const { page, per_page, search, status, designation_id, job_type_id } =
      getAllApplicantsDto;

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

    const paginationOptions: IPaginationOptions = {
      page,
      limit: per_page,
    };

    return await paginate(query, paginationOptions);
  }

  async findOne({ id }: ParamIdDto, currentUser: User) {
    const applicantDetails = await this.jobApplicantRepo
      .createQueryBuilder('job_applicant')
      .leftJoinAndSelect('job_applicant.profile_detail', 'profile_details')
      .leftJoinAndSelect('profile_details.educations', 'education')
      .leftJoinAndSelect('profile_details.skills', 'skills')
      .leftJoinAndSelect('profile_details.portfolio', 'portfolio')
      .leftJoinAndMapMany(
        'portfolio.media',
        Media,
        'media',
        'media.entity_id::uuid = portfolio.id AND media.entity_type = :entity_type',
        { entity_type: EntityType.PORTFOLIO },
      )
      .leftJoinAndSelect('profile_details.user', 'user')
      .where('job_applicant.id = :id', { id })
      .getOne();

    if (!applicantDetails)
      throw new NotFoundException('Applicant Details not found');

    return applicantDetails;
  }

  async manageStatus(
    { id }: ParamIdDto,
    manageJobApplicantStatusDto: ManageJobApplicantStatusDto,
    currentUser: User,
  ) {
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

    if (!jobApplicant) throw new NotFoundException('Job applicant not found');

    const oldStatus = jobApplicant.status;
    Object.assign(jobApplicant, manageJobApplicantStatusDto);
    const updatedJobApplicant = await jobApplicant.save();

    // Only send notification if status has changed
    if (oldStatus !== manageJobApplicantStatusDto.status) {
      // Get notification title based on status
      const getNotificationTitle = (status: string) => {
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

      // Get status class for styling
      const getStatusClass = (status: string) => {
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

      // Send notification to the technician about status change
      await this.eventEmitter.emitAsync('create-send-notification', {
        user_ids: [jobApplicant.profile_detail.user.id],
        title: getNotificationTitle(manageJobApplicantStatusDto.status),
        message: `Your job application status for ${jobApplicant.job_post.title} has been updated to ${manageJobApplicantStatusDto.status}`,
        template: EmailTemplate.JOB_APPLICATION_STATUS_UPDATE,
        notification_type: NotificationType.TRANSACTION,
        is_displayable: true,
        channels: [NotificationChannel.EMAIL, NotificationChannel.IN_APP],
        bypass_user_preferences: true,
        entity_type: NotificationEntityType.JOB_APPLICANT,
        entity_id: jobApplicant.id,
        meta_data: {
          notification_title: getNotificationTitle(
            manageJobApplicantStatusDto.status,
          ),
          technician_name: `${jobApplicant.profile_detail.user.first_name} ${jobApplicant.profile_detail.user.last_name}`,
          organization_name: `${jobApplicant.job_post.user.first_name} ${jobApplicant.job_post.user.last_name}`,
          organization_logo: jobApplicant.job_post.user.profile_image,
          job_title: jobApplicant.job_post.title,
          status: manageJobApplicantStatusDto.status,
          status_class: getStatusClass(manageJobApplicantStatusDto.status),
          feedback: manageJobApplicantStatusDto.feedback || '',
          update_date: dayjs().format('MMMM D, YYYY'),
          application_date: dayjs(jobApplicant.created_at).format(
            'MMMM D, YYYY',
          ),
          dashboard_link: `${this.configService.get('FRONTEND_URL')}/technician/applied-jobs?id=${jobApplicant?.id}`,
        },
      });
    }

    return updatedJobApplicant;
  }

  private async autoGrantAccess(email: string, requestedBy: ProfileDetails) {
    await this.createAccessRequest(email, requestedBy);
  }

  async createAccessRequest(
    requested_from: string,
    requested_by: ProfileDetails,
  ) {
    const accessRequest = this.accessRequestRepo.create({
      requested_by: requested_by,
      requested_from,
      status: RequestStatus.APPROVED,
      purpose: RequestPurpose.AUTO_ACCESS,
    });

    await accessRequest.save();
  }

  private async sendJobApplicationNotifications(
    jobPost: JobPost,
    appliedJob: JobApplicant,
    currentUser: User,
  ) {
    // Notification to the job poster
    await this.eventEmitter.emitAsync('create-send-notification', {
      user_ids: [jobPost?.user?.id],
      title: `New Job Application Received`,
      message: `You have received a new job application for the position of ${jobPost.title}`,
      template: EmailTemplate.JOB_APPLICATION_ORGANIZATION,
      notification_type: NotificationType.TRANSACTION,
      is_displayable: true,
      channels: [NotificationChannel.EMAIL, NotificationChannel.IN_APP],
      bypass_user_preferences: true,
      entity_type: NotificationEntityType.JOB_APPLICANT,
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

    // Notification to the job applicant
    await this.eventEmitter.emitAsync('create-send-notification', {
      user_ids: [currentUser?.id],
      title: `Job Application Confirmation`,
      message: `Thank you for applying to the position at ${jobPost?.user?.first_name} ${jobPost?.user?.last_name}. Your application has been successfully submitted.`,
      template: EmailTemplate.JOB_APPLICATION_TECHNICIAN,
      notification_type: NotificationType.TRANSACTION,
      is_displayable: true,
      channels: [NotificationChannel.EMAIL],
      bypass_user_preferences: true,
      entity_type: NotificationEntityType.JOB_APPLICANT,
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
}
