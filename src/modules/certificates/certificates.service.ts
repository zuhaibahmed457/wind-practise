import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Certificate } from './entities/certificate.entity';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { CertificateHistory } from './entities/certificate-history.entity';
import { CertificateS3Paths } from 'src/static/s3-paths';
import { S3Service } from '../s3/s3.service';
import {
  CertificateStatus,
  GetAllCertificatesDto,
} from './dto/get-all-certificates.dto';
import * as dayjs from 'dayjs';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { GetAllCertificateHistoryDto } from './dto/get-all-certificate-history.dto';
import { ProfileDetails } from '../profile-details/entities/profile-details.entity';

@Injectable()
export class CertificatesService {
  constructor(
    @InjectRepository(Certificate)
    private readonly certificateRepository: Repository<Certificate>,

    @InjectRepository(CertificateHistory)
    private readonly certificateHistoryRepository: Repository<CertificateHistory>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(ProfileDetails)
    private readonly profileDetailsRepository: Repository<ProfileDetails>,

    private readonly s3Service: S3Service,
  ) {}

  async updateUserCertificateExpirationDate(profileDetails: ProfileDetails) {
    const soonestExpiringCertificate = await this.certificateRepository.findOne(
      {
        where: {
          profile_details: {
            id: profileDetails.id,
          },
        },
        order: {
          expiration_date: 'ASC',
        },
      },
    );

    if (!soonestExpiringCertificate) {
      profileDetails.soonest_expiring_certificate_date = null;
    } else {
      profileDetails.soonest_expiring_certificate_date =
        soonestExpiringCertificate.expiration_date;
    }

    await profileDetails.save();
  }

  async create(currentUser: User, createCertificateDto: CreateCertificateDto) {
    const profileDetails = await this.profileDetailsRepository.findOne({
      where: {
        id: createCertificateDto.profile_details_id,
      },
      relations: {
        user: {
          created_by: true,
        },
      },
    });

    if (!profileDetails) {
      throw new NotFoundException('User not found');
    }

    if (
      currentUser.role === UserRole.ORGANIZATION &&
      profileDetails.user.created_by.id !== currentUser.id
    ) {
      throw new ForbiddenException('Employee not found');
    }

    if (
      currentUser.role === UserRole.TECHNICIAN &&
      currentUser.id !== profileDetails.user.id
    ) {
      throw new ForbiddenException(
        'You are not allowed to create certificate for this user',
      );
    }

    const certificateUrl = await this.s3Service.uploadFile(
      createCertificateDto.certificate_pdf,
      currentUser.role === UserRole.ORGANIZATION
        ? CertificateS3Paths.ORGANIZATION
        : CertificateS3Paths.TECHNICIAN,
    );

    const certificate = this.certificateRepository.create({
      ...createCertificateDto,
      profile_details: profileDetails,
      created_by: currentUser,
      certificate_url: certificateUrl,
    });
    await certificate.save();

    await this.updateUserCertificateExpirationDate(profileDetails);

    return certificate;
  }

  async findAll(
    getAllCertificatesDto: GetAllCertificatesDto,
    currentUser: User,
  ) {
    const {
      profile_details_id,
      status,
      sort,
      order,
      page,
      per_page,
      search,
      expiration_date_from,
      expiration_date_to,
      issue_date_from,
      issue_date_to,
    } = getAllCertificatesDto;

    const query = this.certificateRepository
      .createQueryBuilder('certificate')
      .leftJoinAndSelect('certificate.profile_details', 'profile_details')
      .leftJoinAndSelect('profile_details.user', 'user')
      .leftJoinAndSelect('certificate.created_by', 'created_by');

    if (search) {
      query.andWhere(
        '(certificate.name ILIKE :search OR certificate.issuing_authority ILIKE :search OR created_by.full_name ILIKE :search OR created_by.email ILIKE :search OR  user.full_name ILIKE :search OR user.email ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (issue_date_from) {
      query.andWhere('certificate.issuing_date >= :issue_date_from', {
        issue_date_from,
      });
    }
    if (issue_date_to) {
      query.andWhere('certificate.issuing_date <= :issue_date_to', {
        issue_date_to,
      });
    }

    if (expiration_date_from) {
      query.andWhere('certificate.expiration_date >= :expiration_date_from', {
        expiration_date_from,
      });
    }
    if (expiration_date_to) {
      query.andWhere('certificate.expiration_date <= :expiration_date_to', {
        expiration_date_to,
      });
    }

    // For Unauthorized User
    if (profile_details_id) {
      query.andWhere('profile_details.id = :profile_details_id', {
        profile_details_id: profile_details_id,
      });
    }

    if (currentUser?.role === UserRole.ORGANIZATION) {
      // ** 1) organization can acces certificates of all of his employees
      // ** 2) organization can acces certificates one of his employee (provide profile detail id) VALIDATION HANDLED IN GUARD
      // ** 3) organization can acces certificates of technician if he has accesss to that technician certifcates VALIDATION HANDLED IN GUARD

      if (!profile_details_id) {
        query.andWhere('created_by.id = :organizationId', {
          organizationId: currentUser?.id,
        });
      }

      if (profile_details_id) {
        query.andWhere('profile_details.id = :profile_details_id', {
          profile_details_id: profile_details_id,
        });
      }
    } else if (currentUser?.role === UserRole.TECHNICIAN) {
      query.andWhere('certificate.profile_details_id = :profile_details_id', {
        profile_details_id: profile_details_id,
      });
    }

    // ** FILTERING BASED ON STATUS
    const currentDate = new Date();
    const twoMonthsFromNow = dayjs().add(2, 'months').toDate();
    if (status === CertificateStatus.EXPIRED) {
      query.andWhere('certificate.expiration_date < :currentDate', {
        currentDate,
      });
    } else if (status === CertificateStatus.EXPIRING_SOON) {
      query.andWhere(
        'certificate.expiration_date BETWEEN :currentDate AND :twoMonthsFromNow',
        { currentDate, twoMonthsFromNow },
      );
    } else if (status === CertificateStatus.VALID) {
      query.andWhere('certificate.expiration_date > :twoMonthsFromNow', {
        twoMonthsFromNow,
      });
    }

    // ** Sorting & Ordering
    if (sort) {
      const orderBy = order === 'desc' ? 'DESC' : 'ASC';
      query.orderBy(`certificate.${sort}`, orderBy);
    } else {
      query.orderBy('certificate.created_at', 'DESC'); // Default sorting
    }

    const paginationOptions: IPaginationOptions = {
      page: page,
      limit: per_page,
    };

    return await paginate(query, paginationOptions);
  }

  async findOne({ id }: ParamIdDto, currentUser: User) {
    const certificate = await this.certificateRepository.findOne({
      where: {
        id,
      },
      relations: {
        profile_details: { user: true },
        created_by: true,
      },
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    if (
      currentUser?.role === UserRole.TECHNICIAN &&
      certificate.created_by?.id !== currentUser?.id
    ) {
      throw new ForbiddenException('Unauthorized to perform this action');
    }

    return certificate;
  }

  async update(
    { id }: ParamIdDto,
    currentUser: User,
    updateCertificateDto: UpdateCertificateDto,
  ) {
    const { certificate_pdf, profile_details_id, ...rest } =
      updateCertificateDto;

    const certificate = await this.certificateRepository.findOne({
      where: { id },
      relations: {
        created_by: true,
        profile_details: { user: true },
      },
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    if (certificate.created_by.id !== currentUser.id) {
      throw new ForbiddenException('Unauthorized to perform this action');
    }

    const { id: certificateId, ...certificateWithoutId } = certificate;

    const certificateHistory = this.certificateHistoryRepository.create({
      ...certificateWithoutId,
      modified_by: currentUser,
      certificate: certificate,
    });

    await certificateHistory.save();

    Object.assign(certificate, rest);

    if (updateCertificateDto.certificate_pdf) {
      const certificateUrl = await this.s3Service.uploadFile(
        updateCertificateDto.certificate_pdf,
        currentUser.role === UserRole.ORGANIZATION
          ? CertificateS3Paths.ORGANIZATION
          : CertificateS3Paths.TECHNICIAN,
      );

      certificate.certificate_url = certificateUrl;
    }
    await certificate.save();

    await this.updateUserCertificateExpirationDate(certificate.profile_details);

    return certificate;
  }

  async remove({ id }: ParamIdDto, currentUser: User) {
    const certificate = await this.certificateRepository.findOne({
      where: {
        id,
      },
      relations: {
        created_by: true,
        profile_details: true,
      },
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    if (certificate.created_by.id !== currentUser.id) {
      throw new ForbiddenException('Unauthorized to perform this action');
    }

    await this.certificateRepository.softRemove(certificate);

    await this.updateUserCertificateExpirationDate(certificate.profile_details);

    return certificate;
  }

  async getAllCertificateHistory(
    { id }: ParamIdDto,
    currentUser: User,
    getAllCertificateHistoryDto: GetAllCertificateHistoryDto,
  ) {
    const { page, per_page } = getAllCertificateHistoryDto;

    const query = this.certificateHistoryRepository
      .createQueryBuilder('certificate_history')
      .leftJoinAndSelect('certificate_history.modified_by', 'modified_by')
      .leftJoinAndSelect('certificate_history.certificate', 'certificate')
      .where('certificate_history.certificate_id = :certificateId', {
        certificateId: id,
      })
      .andWhere('certificate_history.modified_by_id = :currentUserId', {
        currentUserId: currentUser.id,
      })
      .orderBy('certificate_history.modified_at', 'DESC');

    const paginationOptions: IPaginationOptions = {
      page: page,
      limit: per_page,
    };

    return await paginate(query, paginationOptions);
  }
}
