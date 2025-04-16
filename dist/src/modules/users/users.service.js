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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("./entities/user.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const nestjs_typeorm_paginate_1 = require("nestjs-typeorm-paginate");
const login_attempt_entity_1 = require("../auth/entities/login-attempt.entity");
const validation_exception_formatter_1 = require("../../utils/validation-exception-formatter");
const user_validation_1 = require("./validation/user-validation");
const user_get_one_validation_1 = require("./validation/user-get-one.validation");
const profile_details_entity_1 = require("../profile-details/entities/profile-details.entity");
const media_service_1 = require("../media/media.service");
const s3_paths_1 = require("../../static/s3-paths");
const media_entity_1 = require("../media/entities/media.entity");
const notifications_service_1 = require("../notifications/notifications.service");
let UsersService = class UsersService {
    constructor(usersRepository, loginAttemptRepository, profileDetailsRepo, mediaRepo, mediaService, notificationsService) {
        this.usersRepository = usersRepository;
        this.loginAttemptRepository = loginAttemptRepository;
        this.profileDetailsRepo = profileDetailsRepo;
        this.mediaRepo = mediaRepo;
        this.mediaService = mediaService;
        this.notificationsService = notificationsService;
    }
    async create(createUserDto, currentUser) {
        const isEmailExist = await this.usersRepository.findOne({
            where: {
                email: createUserDto.email,
            },
        });
        if (isEmailExist)
            throw new validation_exception_formatter_1.ValidationException({ email: 'this email is already exist' });
        if (createUserDto?.role === user_entity_1.UserRole.ADMIN &&
            currentUser.role != user_entity_1.UserRole.SUPER_ADMIN) {
            throw new common_1.ForbiddenException(`you cant't create another admin`);
        }
        const user = this.usersRepository.create({
            ...createUserDto,
        });
        await user.save();
        await this.notificationsService.createUserNotificationSetting(user);
        if (createUserDto?.role === user_entity_1.UserRole.TECHNICIAN) {
            const createProfile = this.profileDetailsRepo.create({
                user: user,
            });
            await createProfile.save();
        }
        const { password, ...userData } = user;
        return userData;
    }
    async uploadProfile(uploadProfileDto, currentUser) {
        const user = await this.usersRepository.findOne({
            where: {
                id: currentUser?.id,
            },
        });
        const payload = {
            file: uploadProfileDto.image,
            folder_path: s3_paths_1.UserS3Paths.PROFILE_IMAGE,
            entity_id: user?.id,
            entity_type: media_entity_1.EntityType.USER,
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
    async updateTimeZone(currentUser, updateTimeZoneDto) {
        const user = await this.usersRepository.findOne({
            where: {
                id: currentUser?.id,
            },
        });
        Object.assign(user, updateTimeZoneDto);
        return await user.save();
    }
    async changePassword(currentUser, changePasswordDto) {
        const user = await this.usersRepository.findOne({
            where: { id: currentUser.id },
            select: ['password', 'id', 'role'],
        });
        if (!(await user.comparePassword(changePasswordDto.password))) {
            throw new validation_exception_formatter_1.ValidationException({ password: 'Invalid password' });
        }
        user.password = changePasswordDto.new_password;
        await user.save();
    }
    async findAll(currentUser, getAllDto) {
        const { page, per_page, search, status, role, date_from, date_to } = getAllDto;
        const query = this.usersRepository
            .createQueryBuilder('users')
            .where('users.role != :excludeRole AND users.deleted_at IS NULL', {
            excludeRole: user_entity_1.UserRole.SUPER_ADMIN,
        });
        if (currentUser?.role === user_entity_1.UserRole.ADMIN) {
            query.andWhere('users.role != :excludeRole', {
                excludeRole: user_entity_1.UserRole.ADMIN,
            });
        }
        if (role) {
            query.andWhere('users.role = :role', { role: role });
        }
        if (search) {
            query.andWhere('(users.full_name ILIKE :search OR users.email ILIKE :search)', { search: `%${search}%` });
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
        const paginationOptions = {
            page: page,
            limit: per_page,
        };
        return await (0, nestjs_typeorm_paginate_1.paginate)(query, paginationOptions);
    }
    async findOne({ id }, currentUser) {
        const user = await this.usersRepository.findOne({
            where: {
                id,
            },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        await (0, user_get_one_validation_1.validateOneUser)(currentUser, user);
        return user;
    }
    async update({ id }, updateUserDto, currentUser) {
        const user = await this.usersRepository.findOne({
            where: {
                id,
                deleted_at: (0, typeorm_2.IsNull)(),
            },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (updateUserDto?.email) {
            const user = await this.usersRepository.findOne({
                where: {
                    email: updateUserDto.email,
                    id: (0, typeorm_2.Not)(id),
                },
            });
            if (user)
                throw new common_1.NotFoundException('this email already exist');
        }
        await (0, user_validation_1.validateUser)(id, currentUser, updateUserDto, user);
        Object.assign(user, updateUserDto);
        return user.save();
    }
    async manageStatus({ id }, manageStatusDto, currentUser) {
        const user = await this.usersRepository.findOne({
            where: {
                id,
                deleted_at: (0, typeorm_2.IsNull)(),
            },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (user?.role === user_entity_1.UserRole.ADMIN && currentUser?.role === user_entity_1.UserRole.ADMIN) {
            throw new common_1.ForbiddenException("You are not allowed to update other admin's status");
        }
        if (user?.role === user_entity_1.UserRole.SUPER_ADMIN) {
            throw new common_1.ForbiddenException("You are not allowed to update super admin's status");
        }
        Object.assign(user, manageStatusDto);
        return user.save();
    }
    async remove({ id }, currentUser) {
        const user = await this.usersRepository.findOne({
            where: {
                id,
                deleted_at: (0, typeorm_2.IsNull)(),
            },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (user?.role === user_entity_1.UserRole.SUPER_ADMIN && currentUser?.role === user_entity_1.UserRole.SUPER_ADMIN) {
            throw new common_1.BadRequestException(`A Super Admin cannot delete their account.`);
        }
        if (user?.role === user_entity_1.UserRole.ADMIN && currentUser?.role === user_entity_1.UserRole.ADMIN) {
            throw new common_1.ForbiddenException(`Admin cannot delete another admin`);
        }
        user.deleted_at = new Date();
        await user.save();
    }
    async addDeviceToken(currentLoginAttempt, addDeviceTokenDto) {
        currentLoginAttempt.fcm_device_token = addDeviceTokenDto.device_token;
        await this.loginAttemptRepository.save(currentLoginAttempt);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(login_attempt_entity_1.LoginAttempt)),
    __param(2, (0, typeorm_1.InjectRepository)(profile_details_entity_1.ProfileDetails)),
    __param(3, (0, typeorm_1.InjectRepository)(media_entity_1.Media)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        media_service_1.MediaService,
        notifications_service_1.NotificationsService])
], UsersService);
//# sourceMappingURL=users.service.js.map