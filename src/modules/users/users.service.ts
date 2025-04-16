import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRole } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { GetAllUserDto } from './dto/get-all-user-dto';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { ManageStatusDto } from './dto/manage-status-dto';
import { AddDeviceTokenDto } from './dto/add-device-token.dto';
import { LoginAttempt } from '../auth/entities/login-attempt.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ValidationException } from 'src/utils/validation-exception-formatter';
import { ChangePasswordDto } from './dto/change-password.dto';
import { validateUser } from './validation/user-validation';
import { validateOneUser } from './validation/user-get-one.validation';
import { ProfileDetails } from '../profile-details/entities/profile-details.entity';
import { UploadProfileDto } from './dto/upload-profile.dto';
import { MediaService } from '../media/media.service';
import { UserS3Paths } from 'src/static/s3-paths';
import { EntityType, Media } from '../media/entities/media.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { UpdateTimeZoneDto } from './dto/update-time-zone.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(LoginAttempt)
    private readonly loginAttemptRepository: Repository<LoginAttempt>,

    @InjectRepository(ProfileDetails)
    private readonly profileDetailsRepo: Repository<ProfileDetails>,

    @InjectRepository(Media)
    private readonly mediaRepo: Repository<Media>,

    private readonly mediaService: MediaService,

    private readonly notificationsService: NotificationsService,
  ) {}

  async create(createUserDto: CreateUserDto, currentUser: User) {
    const isEmailExist = await this.usersRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (isEmailExist)
      throw new ValidationException({ email: 'this email is already exist' });

    if (
      createUserDto?.role === UserRole.ADMIN &&
      currentUser.role != UserRole.SUPER_ADMIN
    ) {
      throw new ForbiddenException(`you cant't create another admin`);
    }

    const user = this.usersRepository.create({
      ...createUserDto,
    });

    await user.save();

    await this.notificationsService.createUserNotificationSetting(user);

    if (createUserDto?.role === UserRole.TECHNICIAN) {
      const createProfile = this.profileDetailsRepo.create({
        user: user,
      });

      await createProfile.save();
    }

    const { password, ...userData } = user;
    return userData;
  }

  async uploadProfile(uploadProfileDto: UploadProfileDto, currentUser: User) {
    const user = await this.usersRepository.findOne({
      where: {
        id: currentUser?.id,
      },
    });

    const payload = {
      file: uploadProfileDto.image,
      folder_path: UserS3Paths.PROFILE_IMAGE,
      entity_id: user?.id,
      entity_type: EntityType.USER,
    };

    const mediaDetails = await this.mediaService.createMedia(payload);

    if (user?.profile_image) {
      const media = await this.mediaRepo.findOne({
        where: {
          entity_id: user?.id,
        },
      });

      await this.mediaService.deleteMedia({ id: media?.id });
    }

    user.profile_image = mediaDetails.url;
    return await user.save();
  }

  async updateTimeZone(
    currentUser: User,
    updateTimeZoneDto: UpdateTimeZoneDto,
  ) {
    const user = await this.usersRepository.findOne({
      where: {
        id: currentUser?.id,
      },
    });

    Object.assign(user, updateTimeZoneDto);
    return await user.save();
  }

  async changePassword(
    currentUser: User,
    changePasswordDto: ChangePasswordDto,
  ) {
    const user = await this.usersRepository.findOne({
      where: { id: currentUser.id },
      select: ['password', 'id', 'role'],
    });

    if (!(await user.comparePassword(changePasswordDto.password))) {
      throw new ValidationException({ password: 'Invalid password' });
    }

    user.password = changePasswordDto.new_password;

    await user.save();
  }

  async findAll(currentUser: User, getAllDto: GetAllUserDto) {
    const { page, per_page, search, status, role, date_from, date_to } = getAllDto;

    const query = this.usersRepository
      .createQueryBuilder('users')
      .where('users.role != :excludeRole AND users.deleted_at IS NULL', {
        excludeRole: UserRole.SUPER_ADMIN,
      });

    if (currentUser?.role === UserRole.ADMIN) {
      query.andWhere('users.role != :excludeRole', {
        excludeRole: UserRole.ADMIN,
      });
    }

    if (role) {
      query.andWhere('users.role = :role', { role: role });
    }

    if (search) {
      query.andWhere(
        '(users.full_name ILIKE :search OR users.email ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (status) {
      query.andWhere('users.status = :status', { status });
    }

    if (date_from) {
      query.andWhere('users.created_at >= :date_from', {
        date_from,
      });
    }

    if (date_to) {
      query.andWhere('users.created_at <= :date_to', {
        date_to,
      });
    }

    const paginationOptions: IPaginationOptions = {
      page: page,
      limit: per_page,
    };

    return await paginate<User>(query, paginationOptions);
  }

  async findOne({ id }: ParamIdDto, currentUser: User) {
    const user = await this.usersRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    await validateOneUser(currentUser, user);
    return user;
  }

  async update(
    { id }: ParamIdDto,
    updateUserDto: UpdateUserDto,
    currentUser: User,
  ) {
    const user = await this.usersRepository.findOne({
      where: {
        id,
        deleted_at: IsNull(),
      },
    });

    if (!user) throw new NotFoundException('User not found');

    if (updateUserDto?.email) {
      const user = await this.usersRepository.findOne({
        where: {
          email: updateUserDto.email,
          id: Not(id),
        },
      });

      if (user) throw new NotFoundException('this email already exist');
    }

    await validateUser(id, currentUser, updateUserDto, user);
    Object.assign(user, updateUserDto);

    return user.save();
  }

  async manageStatus(
    { id }: ParamIdDto,
    manageStatusDto: ManageStatusDto,
    currentUser: User,
  ) {
    const user = await this.usersRepository.findOne({
      where: {
        id,
        deleted_at: IsNull(),
      },
    });

    if (!user) throw new NotFoundException('User not found');

    if (user?.role === UserRole.ADMIN && currentUser?.role === UserRole.ADMIN) {
      throw new ForbiddenException(
        "You are not allowed to update other admin's status",
      );
    }

    if (user?.role === UserRole.SUPER_ADMIN) {
      throw new ForbiddenException(
        "You are not allowed to update super admin's status",
      );
    }

    Object.assign(user, manageStatusDto);

    return user.save();
  }

  async remove({id}: ParamIdDto, currentUser: User) {
    const user = await this.usersRepository.findOne({
      where: {
        id,
        deleted_at: IsNull(),
      },
    });

    if(!user) throw new NotFoundException('User not found')

    if (user?.role === UserRole.SUPER_ADMIN && currentUser?.role === UserRole.SUPER_ADMIN) {
      throw new BadRequestException(
        `A Super Admin cannot delete their account.`,
      );
    }

    if(user?.role === UserRole.ADMIN && currentUser?.role === UserRole.ADMIN){
      throw new ForbiddenException(
        `Admin cannot delete another admin`,
      );
    }  

    user.deleted_at = new Date();
    await user.save();
  }

  async addDeviceToken(
    currentLoginAttempt: LoginAttempt,
    addDeviceTokenDto: AddDeviceTokenDto,
  ) {
    currentLoginAttempt.fcm_device_token = addDeviceTokenDto.device_token;
    await this.loginAttemptRepository.save(currentLoginAttempt);
  }
}
