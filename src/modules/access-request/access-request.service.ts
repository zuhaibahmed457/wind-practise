import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAccessRequestDto } from './dto/create-access-request.dto';
import { User, UserRole } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessRequest, RequestType } from './entities/access-request.entity';
import { IsNull, Repository } from 'typeorm';
import { ProfileDetails } from '../profile-details/entities/profile-details.entity';
import { GetAllAccessRequestDto } from './dto/get-all-access-request.dto';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { ManageAccessRequestDto } from './dto/manage-access-request.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EmailTemplate } from '../notifications/enums/email-template.enum';
import {
  NotificationChannel,
  NotificationEntityType,
  NotificationType,
} from '../notifications/entities/notification.entity';
import { textCapitalize } from 'src/utils/text-capitalize';
import { ConfigService } from '@nestjs/config';
import { Portfolio } from '../portfolio/entities/portfolio.entity';
import { Certificate } from '../certificates/entities/certificate.entity';
import { ViewAccessRequestDto } from './dto/view-access-request.dto';
import { EmailNotificationService } from '../notifications/services/email-notification.service';

@Injectable()
export class AccessRequestService {
  constructor(
    @InjectRepository(AccessRequest)
    private readonly accessRequestRepo: Repository<AccessRequest>,
    @InjectRepository(ProfileDetails)
    private readonly profileDetailsRepo: Repository<ProfileDetails>,
    @InjectRepository(Portfolio)
    private readonly portfolioRepo: Repository<Portfolio>,
    @InjectRepository(Certificate)
    private readonly certificateRepo: Repository<Certificate>,
    private readonly eventEmitter: EventEmitter2,
    private readonly configService: ConfigService,
    private readonly emailNotificationService: EmailNotificationService,
  ) {}

  async create(createAccessRequestDto: CreateAccessRequestDto) {
    const { email, requested_by_id } = createAccessRequestDto;

    const requestType = [RequestType.PORTFOLIO, RequestType.CERTIFICATE];

    const profileDetails = await this.profileDetailsRepo.findOne({
      where: {
        id: requested_by_id,
        deleted_at: IsNull(),
      },
      relations: { user: true },
    });

    if (!profileDetails)
      throw new NotFoundException('Profile Details not found');

    const portfolioCount = await this.portfolioRepo.count({
      where: {
        profile_details: {
          id: profileDetails?.id,
          deleted_at: IsNull(),
        },
      },
    });

    if (!portfolioCount) {
      throw new NotFoundException(
        `${profileDetails?.user?.role} ${RequestType.PORTFOLIO} does not exist`,
      );
    }

    const certificateCount = await this.certificateRepo.count({
      where: {
        profile_details: {
          id: profileDetails?.id,
          deleted_at: IsNull(),
        },
      },
    });

    if (!portfolioCount && !certificateCount) {
      throw new NotFoundException(
        `${profileDetails?.user?.role} ${RequestType.PORTFOLIO} And ${RequestType.CERTIFICATE} does not exist`,
      );
    }

    const accessRequest = this.accessRequestRepo.create({
      requested_from: email,
      requested_by: profileDetails,
    });
    const saveAccessRequest = await accessRequest.save();

    // // Notify Requested User
    await this.eventEmitter.emitAsync('create-send-notification', {
      user_ids: [profileDetails?.user?.id],
      title: `New Access Request For ${textCapitalize(RequestType.PORTFOLIO)} and ${textCapitalize(RequestType.CERTIFICATE)}`,
      message: `this email: ${email} has requested access from you. Please review the request.`,
      template: EmailTemplate.ACCESS_REQUEST_FROM,
      notification_type: NotificationType.TRANSACTION,
      is_displayable: true,
      channels: [NotificationChannel.EMAIL, NotificationChannel.IN_APP],
      bypass_user_preferences: true,
      entity_type: NotificationEntityType.ACCESS_REQUEST,
      entity_id: accessRequest?.id,
      meta_data: {
        full_name: `${profileDetails?.user?.first_name} ${profileDetails?.user?.last_name}`,
        request_type: `${textCapitalize(RequestType.PORTFOLIO)} AND ${textCapitalize(RequestType.CERTIFICATE)}`,
        email,
        request_url: `${this.configService.get('FRONTEND_URL')}/technician/access_requests`,
      },
    });

    return saveAccessRequest;
  }

  async viewAccessRequest(viewAccessRequestDto: ViewAccessRequestDto) {
    const { email, requested_by_id } = viewAccessRequestDto;

    const profileDetails = await this.profileDetailsRepo.findOne({
      where: {
        id: requested_by_id,
        deleted_at: IsNull(),
      },
      relations: { user: true },
    });

    if (!profileDetails)
      throw new NotFoundException('Profile Details not found');

    const accessRequest = await this.accessRequestRepo.findOne({
      where: {
        requested_from: email,
        requested_by: {
          id: profileDetails?.id,
        },
      },
      order: { created_at: 'DESC' },
    });

    if (!accessRequest) throw new NotFoundException('Please Request First');

    return accessRequest;
  }

  async findAll(
    getAllAccessRequestDto: GetAllAccessRequestDto,
    currentUser: User,
  ) {
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

    const paginationOptions: IPaginationOptions = {
      page,
      limit: per_page,
    };

    return await paginate<AccessRequest>(query, paginationOptions);
  }

  async findOne({ id }: ParamIdDto, currentUser: User) {
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

    if (!accessRequest) throw new NotFoundException('Access Request not found');

    if (
      [UserRole.TECHNICIAN].includes(currentUser.role) &&
      accessRequest?.requested_by?.id !== currentUser?.profile_detail?.id
    ) {
      throw new ForbiddenException(
        'You do not have permission to view this request',
      );
    }

    return accessRequest;
  }

  async manageStatus(
    { id }: ParamIdDto,
    currentUser: User,
    manageAccessRequestDto: ManageAccessRequestDto,
  ) {
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

    if (!accessRequest) throw new NotFoundException('Access Request not found');

    Object.assign(accessRequest, manageAccessRequestDto);
    const updatedAccessRequest = await accessRequest.save();

    // Notify Requested User
    const requesterEmail = accessRequest.requested_from;
    const payload: any = {
      title: `Access Request ${textCapitalize(updatedAccessRequest?.status)} For Certificate And Portfolio`,
      message: `Your access request for Certificate And Portfolio has been approved by ${currentUser.first_name} ${currentUser.last_name}.`,
      request_type: 'Certificate And Portfolio',
      status: `${updatedAccessRequest?.status}`,
      status_class: `${updatedAccessRequest?.status}`,
      approved_by: `${currentUser.first_name} ${currentUser.last_name}`,
      requested_to_email: currentUser?.email,
      access_link: `${this.configService.get('FRONTEND_URL')}/profile_details/${currentUser?.profile_detail?.id}`,
      is_approved: updatedAccessRequest?.status === 'approved' ? true : false,
    };

    await this.emailNotificationService.sendAccessRequestConfirmationEmail(
      requesterEmail,
      payload,
    );

    return updatedAccessRequest;
  }

  async remove({ id }: ParamIdDto, currentUser: User) {
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

    if (!accessRequest) throw new NotFoundException('Access Request not found');

    if (
      [UserRole.TECHNICIAN].includes(currentUser.role) &&
      accessRequest?.requested_by?.id !== currentUser?.profile_detail?.id
    ) {
      throw new ForbiddenException(
        'You do not have permission to view this request',
      );
    }

    await this.accessRequestRepo.delete(id);

    return;
  }
}
