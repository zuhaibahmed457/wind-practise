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
exports.CertificatesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const certificate_entity_1 = require("./entities/certificate.entity");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const certificate_history_entity_1 = require("./entities/certificate-history.entity");
const s3_paths_1 = require("../../static/s3-paths");
const s3_service_1 = require("../s3/s3.service");
const get_all_certificates_dto_1 = require("./dto/get-all-certificates.dto");
const dayjs = require("dayjs");
const nestjs_typeorm_paginate_1 = require("nestjs-typeorm-paginate");
const profile_details_entity_1 = require("../profile-details/entities/profile-details.entity");
let CertificatesService = class CertificatesService {
    constructor(certificateRepository, certificateHistoryRepository, userRepository, profileDetailsRepository, s3Service) {
        this.certificateRepository = certificateRepository;
        this.certificateHistoryRepository = certificateHistoryRepository;
        this.userRepository = userRepository;
        this.profileDetailsRepository = profileDetailsRepository;
        this.s3Service = s3Service;
    }
    async updateUserCertificateExpirationDate(profileDetails) {
        const soonestExpiringCertificate = await this.certificateRepository.findOne({
            where: {
                profile_details: {
                    id: profileDetails.id,
                },
            },
            order: {
                expiration_date: 'ASC',
            },
        });
        if (!soonestExpiringCertificate) {
            profileDetails.soonest_expiring_certificate_date = null;
        }
        else {
            profileDetails.soonest_expiring_certificate_date =
                soonestExpiringCertificate.expiration_date;
        }
        await profileDetails.save();
    }
    async create(currentUser, createCertificateDto) {
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
            throw new common_1.NotFoundException('User not found');
        }
        if (currentUser.role === user_entity_1.UserRole.ORGANIZATION &&
            profileDetails.user.created_by.id !== currentUser.id) {
            throw new common_1.ForbiddenException('Employee not found');
        }
        if (currentUser.role === user_entity_1.UserRole.TECHNICIAN &&
            currentUser.id !== profileDetails.user.id) {
            throw new common_1.ForbiddenException('You are not allowed to create certificate for this user');
        }
        const certificateUrl = await this.s3Service.uploadFile(createCertificateDto.certificate_pdf, currentUser.role === user_entity_1.UserRole.ORGANIZATION
            ? s3_paths_1.CertificateS3Paths.ORGANIZATION
            : s3_paths_1.CertificateS3Paths.TECHNICIAN);
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
    async findAll(getAllCertificatesDto, currentUser) {
        const { profile_details_id, status, sort, order, page, per_page, search, expiration_date_from, expiration_date_to, issue_date_from, issue_date_to, } = getAllCertificatesDto;
        const query = this.certificateRepository
            .createQueryBuilder('certificate')
            .leftJoinAndSelect('certificate.profile_details', 'profile_details')
            .leftJoinAndSelect('profile_details.user', 'user')
            .leftJoinAndSelect('certificate.created_by', 'created_by');
        if (search) {
            query.andWhere('(certificate.name ILIKE :search OR certificate.issuing_authority ILIKE :search OR created_by.full_name ILIKE :search OR created_by.email ILIKE :search OR  user.full_name ILIKE :search OR user.email ILIKE :search)', { search: `%${search}%` });
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
        if (profile_details_id) {
            query.andWhere('profile_details.id = :profile_details_id', {
                profile_details_id: profile_details_id,
            });
        }
        if (currentUser?.role === user_entity_1.UserRole.ORGANIZATION) {
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
        }
        else if (currentUser?.role === user_entity_1.UserRole.TECHNICIAN) {
            query.andWhere('certificate.profile_details_id = :profile_details_id', {
                profile_details_id: profile_details_id,
            });
        }
        const currentDate = new Date();
        const twoMonthsFromNow = dayjs().add(2, 'months').toDate();
        if (status === get_all_certificates_dto_1.CertificateStatus.EXPIRED) {
            query.andWhere('certificate.expiration_date < :currentDate', {
                currentDate,
            });
        }
        else if (status === get_all_certificates_dto_1.CertificateStatus.EXPIRING_SOON) {
            query.andWhere('certificate.expiration_date BETWEEN :currentDate AND :twoMonthsFromNow', { currentDate, twoMonthsFromNow });
        }
        else if (status === get_all_certificates_dto_1.CertificateStatus.VALID) {
            query.andWhere('certificate.expiration_date > :twoMonthsFromNow', {
                twoMonthsFromNow,
            });
        }
        if (sort) {
            const orderBy = order === 'desc' ? 'DESC' : 'ASC';
            query.orderBy(`certificate.${sort}`, orderBy);
        }
        else {
            query.orderBy('certificate.created_at', 'DESC');
        }
        const paginationOptions = {
            page: page,
            limit: per_page,
        };
        return await (0, nestjs_typeorm_paginate_1.paginate)(query, paginationOptions);
    }
    async findOne({ id }, currentUser) {
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
            throw new common_1.NotFoundException('Certificate not found');
        }
        if (currentUser?.role === user_entity_1.UserRole.TECHNICIAN &&
            certificate.created_by?.id !== currentUser?.id) {
            throw new common_1.ForbiddenException('Unauthorized to perform this action');
        }
        return certificate;
    }
    async update({ id }, currentUser, updateCertificateDto) {
        const { certificate_pdf, profile_details_id, ...rest } = updateCertificateDto;
        const certificate = await this.certificateRepository.findOne({
            where: { id },
            relations: {
                created_by: true,
                profile_details: { user: true },
            },
        });
        if (!certificate) {
            throw new common_1.NotFoundException('Certificate not found');
        }
        if (certificate.created_by.id !== currentUser.id) {
            throw new common_1.ForbiddenException('Unauthorized to perform this action');
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
            const certificateUrl = await this.s3Service.uploadFile(updateCertificateDto.certificate_pdf, currentUser.role === user_entity_1.UserRole.ORGANIZATION
                ? s3_paths_1.CertificateS3Paths.ORGANIZATION
                : s3_paths_1.CertificateS3Paths.TECHNICIAN);
            certificate.certificate_url = certificateUrl;
        }
        await certificate.save();
        await this.updateUserCertificateExpirationDate(certificate.profile_details);
        return certificate;
    }
    async remove({ id }, currentUser) {
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
            throw new common_1.NotFoundException('Certificate not found');
        }
        if (certificate.created_by.id !== currentUser.id) {
            throw new common_1.ForbiddenException('Unauthorized to perform this action');
        }
        await this.certificateRepository.softRemove(certificate);
        await this.updateUserCertificateExpirationDate(certificate.profile_details);
        return certificate;
    }
    async getAllCertificateHistory({ id }, currentUser, getAllCertificateHistoryDto) {
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
        const paginationOptions = {
            page: page,
            limit: per_page,
        };
        return await (0, nestjs_typeorm_paginate_1.paginate)(query, paginationOptions);
    }
};
exports.CertificatesService = CertificatesService;
exports.CertificatesService = CertificatesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(certificate_entity_1.Certificate)),
    __param(1, (0, typeorm_1.InjectRepository)(certificate_history_entity_1.CertificateHistory)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(profile_details_entity_1.ProfileDetails)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        s3_service_1.S3Service])
], CertificatesService);
//# sourceMappingURL=certificates.service.js.map