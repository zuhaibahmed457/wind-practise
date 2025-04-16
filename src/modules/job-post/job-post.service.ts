import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateJobPostDto } from './dto/create-job-post.dto';
import { UpdateJobPostDto } from './dto/update-job-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JobPost, JobStatus } from './entities/job-post.entity';
import { In, IsNull, Repository } from 'typeorm';
import { Designation } from '../designation/entities/designation.entity';
import { EmploymentType } from '../employment-type/entities/employment-type.entity';
import { User, UserRole, UserStatus } from '../users/entities/user.entity';
import { GetAllJobPostDto } from './dto/get-all-job-post.dto';
import {
  IPaginationOptions,
  paginate,
  paginateRaw,
} from 'nestjs-typeorm-paginate';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { ManageJobPostStatusDto } from './dto/manage-job-post-status.dto';
import { ToggleArchiveDto } from './dto/toggle-archive.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  NotificationChannel,
  NotificationEntityType,
  NotificationType,
} from '../notifications/entities/notification.entity';

@Injectable()
export class JobPostService {
  constructor(
    @InjectRepository(JobPost)
    private readonly jobPostRepo: Repository<JobPost>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Designation)
    private readonly designationRepo: Repository<Designation>,
    @InjectRepository(EmploymentType)
    private readonly jobTypeRepo: Repository<EmploymentType>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(createJobPostDto: CreateJobPostDto, currentUser: User) {
    const { designation_id, job_type_id, ...bodyDto } = createJobPostDto;

    const jobTypes = await this.jobTypeRepo
      .createQueryBuilder('job_type')
      .where('job_type.id IN (:...job_type_id)', {
        job_type_id: createJobPostDto?.job_type_id,
      })
      .getMany();

    if (!jobTypes.length) throw new NotFoundException('Job types not found');

    const designations = await this.designationRepo
      .createQueryBuilder('designation')
      .leftJoin('designation.created_by', 'user')
      .where(
        'user.id = :user_id AND designation.id IN (:...designation_id) AND designation.deleted_at IS NULL',
        {
          user_id: currentUser?.id,
          designation_id: createJobPostDto?.designation_id,
        },
      )
      .getMany();

    if (!designations.length)
      throw new NotFoundException('Designation not found');

    const jobPost = this.jobPostRepo.create({
      user: currentUser,
      job_type: jobTypes,
      designation_type: designations,
      ...bodyDto,
    });

    const technicains = await this.userRepo.find({
      where: {
        role: UserRole.TECHNICIAN,
        status: UserStatus.ACTIVE,
        deleted_at: IsNull(),
      },
    });

    // Notification to the job applicant
    await this.eventEmitter.emitAsync('create-send-notification', {
      user_ids: technicains.map((item) => item.id),
      title: `New Job Post: ${jobPost?.title}`,
      message: `A new job opportunity is available at ${jobPost?.user?.first_name} ${jobPost?.user?.last_name}. Check out the details and apply now!`,
      notification_type: NotificationType.TRANSACTION,
      is_displayable: true,
      channels: [NotificationChannel.IN_APP],
      bypass_user_preferences: true,
      entity_type: NotificationEntityType.JOB_POST,
      entity_id: jobPost?.id,
    });

    return await jobPost.save();
  }

  async findAll(getAllJobPostDto: GetAllJobPostDto, currentUser: User) {
    const {
      page,
      per_page,
      search,
      max_experience,
      min_experience,
      status,
      designation_id,
      job_type_id,
      is_archive,
      date_from,
      date_to,
      order,
      exclude_applied_jobs,
    } = getAllJobPostDto;

    const query = this.jobPostRepo
      .createQueryBuilder('job_post')
      .leftJoinAndSelect('job_post.job_type', 'job_type')
      .leftJoinAndSelect('job_post.designation_type', 'designation_type')
      .leftJoinAndSelect('job_post.user', 'user');

    if (exclude_applied_jobs && currentUser?.profile_detail?.id) {
      query
        .leftJoin(
          'job_post.job_applicants',
          'job_applicant',
          'job_applicant.profile_detail.id = :profileDetailId',
          { profileDetailId: currentUser.profile_detail.id },
        )
        .andWhere('job_applicant.id IS NULL');
    }

    if (
      [UserRole.SUPER_ADMIN, UserRole.ADMIN].includes(currentUser?.role) &&
      status
    ) {
      query.andWhere('job_post.status = :status', { status });
    }

    if ([UserRole.ORGANIZATION].includes(currentUser?.role)) {
      query.andWhere(
        'job_post.user.id = :organization_id AND job_post.status = :status ',
        {
          organization_id: currentUser?.id,
          status: JobStatus.ACITVE,
        },
      );

      if (is_archive === true || is_archive === false) {
        query.andWhere('job_post.is_archive = :is_archive', { is_archive });
      }
    }

    if ([UserRole.TECHNICIAN].includes(currentUser?.role)) {
      query.andWhere(
        'job_post.status = :status AND job_post.is_archive = false',
        { status: JobStatus.ACITVE },
      );
    }

    if (search) {
      query.andWhere(
        `(job_post.title ILIKE :search OR job_post.city ILIKE :search OR array_to_string(job_post.qualification, ',') ILIKE :search OR user.full_name ILIKE :search OR user.email ILIKE :search)`,
        {
          search: `%${search}%`,
        },
      );
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

    const paginationOptions: IPaginationOptions = {
      page,
      limit: per_page,
    };

    return await paginate<JobPost>(query, paginationOptions);
  }

  async findOne({ id }: ParamIdDto, currentUser: User) {
    const jobPost = await this.jobPostRepo.findOne({
      where: {
        id,
        deleted_at: IsNull(),
      },
      relations: {
        user: true,
        job_type: true,
        designation_type: true,
      },
    });

    if (!jobPost) throw new NotFoundException('Job post not found');

    if (
      [UserRole.ORGANIZATION, UserRole.TECHNICIAN].includes(
        currentUser?.role,
      ) &&
      jobPost?.status !== JobStatus.ACITVE
    ) {
      throw new BadRequestException('Job post not found');
    }

    return jobPost;
  }

  async update(
    { id }: ParamIdDto,
    currentUser: User,
    updateJobPostDto: UpdateJobPostDto,
  ) {
    const jobPost = await this.jobPostRepo.findOne({
      where: {
        id,
        deleted_at: IsNull(),
        user: {
          id: currentUser?.id,
        },
      },
    });

    if (!jobPost) throw new NotFoundException('Job post not found');

    if (updateJobPostDto?.job_type_id) {
      const jobTypes = await this.jobTypeRepo.find({
        where: {
          id: In(updateJobPostDto?.job_type_id),
          deleted_at: IsNull(),
        },
      });

      if (!jobTypes.length) throw new NotFoundException('Job type not found');

      jobPost.job_type = jobTypes;
    }

    if (updateJobPostDto?.designation_id) {
      const designations = await this.designationRepo.find({
        where: {
          id: In(updateJobPostDto?.designation_id),
          created_by: {
            id: currentUser?.id,
          },
        },
      });

      if (!designations.length)
        throw new NotFoundException('Designation not found');

      jobPost.designation_type = designations;
    }

    Object.assign(jobPost, updateJobPostDto);
    return await jobPost.save();
  }

  async toggleArchive(
    { id }: ParamIdDto,
    toggleArchiveDto: ToggleArchiveDto,
    currentUser: User,
  ) {
    const jobPost = await this.jobPostRepo.findOne({
      where: {
        id,
        deleted_at: IsNull(),
        user: {
          id: currentUser?.id,
        },
      },
    });

    if (!jobPost) throw new NotFoundException('Job post not found');

    Object.assign(jobPost, toggleArchiveDto);

    return jobPost.save();
  }

  async manageStatus(
    { id }: ParamIdDto,
    manageJobPostStatusDto: ManageJobPostStatusDto,
    currentUser: User,
  ) {
    const jobPost = await this.jobPostRepo.findOne({
      where: {
        id,
        deleted_at: IsNull(),
      },
    });

    if (!jobPost) throw new NotFoundException('Job post not found');

    Object.assign(jobPost, manageJobPostStatusDto);

    return jobPost.save();
  }

  async remove({ id }: ParamIdDto, currentUser: User) {
    const jobPost = await this.jobPostRepo.findOne({
      where: {
        id,
        deleted_at: IsNull(),
        user: {
          id: currentUser?.id,
        },
      },
    });

    if (!jobPost) throw new NotFoundException('Job post not found');
    await jobPost.softRemove();
  }
}
