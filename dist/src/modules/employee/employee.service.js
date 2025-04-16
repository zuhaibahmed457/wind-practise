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
exports.EmployeeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const designation_entity_1 = require("../designation/entities/designation.entity");
const employment_type_entity_1 = require("../employment-type/entities/employment-type.entity");
const user_entity_1 = require("../users/entities/user.entity");
const transaction_manager_service_1 = require("../../shared/services/transaction-manager.service");
const validation_exception_formatter_1 = require("../../utils/validation-exception-formatter");
const nestjs_typeorm_paginate_1 = require("nestjs-typeorm-paginate");
const profile_details_entity_1 = require("../profile-details/entities/profile-details.entity");
const certificate_entity_1 = require("../certificates/entities/certificate.entity");
const certificates_service_1 = require("../certificates/certificates.service");
let EmployeeService = class EmployeeService {
    constructor(profileDetailsRepository, userRepository, certificateRepository, certificateService, transactionManagerService) {
        this.profileDetailsRepository = profileDetailsRepository;
        this.userRepository = userRepository;
        this.certificateRepository = certificateRepository;
        this.certificateService = certificateService;
        this.transactionManagerService = transactionManagerService;
    }
    create(createEmployeeDto, currentUser) {
        return this.transactionManagerService.executeInTransaction(async (queryRunner) => {
            const { designation_id, employment_type_id, organization_id, email, first_name, last_name, phone_no, ...bodyData } = createEmployeeDto;
            const isEmailAlreadyExist = await this.userRepository.findOne({
                where: {
                    email: createEmployeeDto.email,
                    deleted_at: (0, typeorm_2.IsNull)(),
                    created_by: {
                        id: currentUser?.id,
                    },
                },
            });
            if (isEmailAlreadyExist)
                throw new common_1.BadRequestException(`Employee with email ${createEmployeeDto.email} already exists`);
            let createdBy = currentUser;
            if (!currentUser.latest_subscription) {
                throw new common_1.BadRequestException('Please take a subscription plan first');
            }
            const numberOfEmployee = await this.userRepository.count({
                where: {
                    role: user_entity_1.UserRole.EMPLOYEE,
                    created_by: {
                        id: currentUser.id,
                    },
                },
            });
            if (numberOfEmployee >=
                currentUser.latest_subscription.plan.number_of_employees_allowed) {
                throw new common_1.BadRequestException(`You have currently ${numberOfEmployee} employees, please take plan which correspond to your number of employees`);
            }
            if (currentUser.latest_subscription.plan.number_of_employees_allowed)
                if ([user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.SUPER_ADMIN].includes(currentUser?.role)) {
                    if (createEmployeeDto?.organization_id) {
                        createdBy = await queryRunner.manager.findOne(user_entity_1.User, {
                            where: {
                                id: organization_id,
                                deleted_at: (0, typeorm_2.IsNull)(),
                                status: user_entity_1.UserStatus.ACTIVE,
                            },
                        });
                        if (createdBy) {
                            throw new common_1.NotFoundException('Organization not found');
                        }
                    }
                    else {
                        throw new validation_exception_formatter_1.ValidationException({
                            organization_id: 'organization_id is required',
                        });
                    }
                }
            const designation = await queryRunner.manager.findOne(designation_entity_1.Designation, {
                where: {
                    id: designation_id,
                    status: designation_entity_1.DesignationStatus.ACTIVE,
                    deleted_at: (0, typeorm_2.IsNull)(),
                    created_by: {
                        id: createdBy?.id,
                    },
                },
            });
            if (!designation) {
                throw new common_1.NotFoundException('Designation not found');
            }
            const employmentType = await queryRunner.manager.findOne(employment_type_entity_1.EmploymentType, {
                where: {
                    id: employment_type_id,
                    status: employment_type_entity_1.EmploymentTypeStatus.ACTIVE,
                },
            });
            if (!employmentType) {
                throw new common_1.NotFoundException('Employment type not found');
            }
            const employee = this.userRepository.create({
                first_name,
                last_name,
                email,
                phone_no,
                role: user_entity_1.UserRole.EMPLOYEE,
                created_by: createdBy,
            });
            const saveEmployee = await queryRunner.manager.save(user_entity_1.User, employee);
            const profileDetails = this.profileDetailsRepository.create({
                ...bodyData,
                designation,
                employment_type: employmentType,
                user: saveEmployee,
            });
            const { user: { password, ...userData }, ...details } = await queryRunner.manager.save(profile_details_entity_1.ProfileDetails, profileDetails);
            return await queryRunner.manager.save(profile_details_entity_1.ProfileDetails, {
                ...details,
                user: userData,
            });
        });
    }
    async findAll(getAllEmployeeDto, currentUser) {
        const { city, country, designation_id, employment_type_id, join_date_from, join_date_to, page, per_page, search, status, order, } = getAllEmployeeDto;
        const query = this.userRepository
            .createQueryBuilder('user')
            .leftJoin('user.created_by', 'created_by')
            .leftJoinAndSelect('user.profile_detail', 'profile')
            .leftJoinAndSelect('profile.designation', 'designation')
            .leftJoinAndSelect('profile.employment_type', 'employment_type')
            .where('created_by.id = :id AND user.deleted_at IS NULL ', {
            id: currentUser?.id,
        })
            .andWhere('user.role = :role', { role: user_entity_1.UserRole.EMPLOYEE });
        if (search) {
            query.andWhere('(user.full_name ILIKE :search OR user.email ILIKE :search OR user.phone_no ILIKE :search OR profile.city ILIKE :search)', { search: `%${search}%` });
        }
        if (city) {
            query.andWhere('profile.city = :city', { city });
        }
        if (country) {
            query.andWhere('profile.country = :country', { country });
        }
        if (join_date_from) {
            query.andWhere('profile.join_date >= :join_date_from', {
                join_date_from,
            });
        }
        if (join_date_to) {
            query.andWhere('profile.join_date <= :join_date_to', {
                join_date_to,
            });
        }
        if (status) {
            query.andWhere('user.status = :status', { status });
        }
        if (designation_id) {
            query.andWhere('designation.id IN (:...designation_id)', {
                designation_id,
            });
        }
        if (employment_type_id) {
            query.andWhere('employment_type.id IN (:...employment_type_id)', {
                employment_type_id,
            });
        }
        query
            .distinctOn(['user.created_at'])
            .orderBy('user.created_at', order ?? 'DESC');
        const paginationOptions = {
            page: page,
            limit: per_page,
        };
        return await (0, nestjs_typeorm_paginate_1.paginate)(query, paginationOptions);
    }
    async findOne({ id }, currentUser) {
        const employee = await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.profile_detail', 'profile_detail')
            .leftJoinAndSelect('profile_detail.designation', 'designation')
            .leftJoinAndSelect('profile_detail.employment_type', 'employment_type')
            .where('user.id = :id AND user.created_by.id = :createdById AND user.deleted_at IS NULL', { id, createdById: currentUser?.id })
            .getOne();
        if (!employee) {
            throw new common_1.NotFoundException('Employee not found');
        }
        return employee;
    }
    async update({ id }, updateEmployeeDto, currentUser) {
        return this.transactionManagerService.executeInTransaction(async (queryRunner) => {
            const { designation_id, employment_type_id, first_name, last_name, email, phone_no, ...bodyData } = updateEmployeeDto;
            const employee = await queryRunner.manager.findOne(user_entity_1.User, {
                where: {
                    id: id,
                    role: user_entity_1.UserRole.EMPLOYEE,
                    deleted_at: (0, typeorm_2.IsNull)(),
                    created_by: { id: currentUser.id },
                },
                relations: ['profile_detail'],
            });
            if (!employee) {
                throw new common_1.NotFoundException('Employee not found');
            }
            const profileDetails = await queryRunner.manager.findOne(profile_details_entity_1.ProfileDetails, {
                where: { id: employee.profile_detail?.id },
                relations: ['designation', 'employment_type'],
            });
            if (!profileDetails) {
                throw new common_1.NotFoundException('Profile not found');
            }
            if (designation_id) {
                const designation = await queryRunner.manager.findOne(designation_entity_1.Designation, {
                    where: {
                        id: designation_id,
                        status: designation_entity_1.DesignationStatus.ACTIVE,
                        deleted_at: (0, typeorm_2.IsNull)(),
                        created_by: { id: currentUser.id },
                    },
                });
                if (!designation) {
                    throw new common_1.NotFoundException('Designation not found');
                }
                profileDetails.designation = designation;
            }
            if (employment_type_id) {
                const employmentType = await queryRunner.manager.findOne(employment_type_entity_1.EmploymentType, {
                    where: {
                        id: employment_type_id,
                        status: employment_type_entity_1.EmploymentTypeStatus.ACTIVE,
                    },
                });
                if (!employmentType) {
                    throw new common_1.NotFoundException('Employment type not found');
                }
                profileDetails.employment_type = employmentType;
            }
            Object.assign(profileDetails, bodyData);
            await queryRunner.manager.save(profile_details_entity_1.ProfileDetails, profileDetails);
            Object.assign(employee, { first_name, last_name, phone_no, email });
            const { password, ...employeeData } = await queryRunner.manager.save(user_entity_1.User, employee);
            return employeeData;
        });
    }
    async manageStatus({ id }, manageEmployeeStatusDto, currentUser) {
        const employee = await this.userRepository.findOne({
            where: {
                id,
                deleted_at: (0, typeorm_2.IsNull)(),
                created_by: {
                    id: currentUser?.id,
                },
            },
        });
        if (!employee)
            throw new common_1.NotFoundException('Employee not found');
        Object.assign(employee, manageEmployeeStatusDto);
        return employee.save();
    }
    async delete({ id }, currentUser) {
        const employee = await this.findOne({ id }, currentUser);
        const certificate = await this.certificateRepository.find({
            where: {
                deleted_at: (0, typeorm_2.IsNull)(),
                created_by: {
                    id: currentUser?.id,
                },
                profile_details: {
                    id: employee?.profile_detail?.id,
                },
            },
            relations: {
                created_by: true,
                profile_details: true,
            },
        });
        if (certificate.length) {
            certificate.map(async (item) => {
                await item.softRemove();
                await this.certificateService.updateUserCertificateExpirationDate(item.profile_details);
            });
        }
        employee.deleted_at = new Date();
        await employee.save();
    }
};
exports.EmployeeService = EmployeeService;
exports.EmployeeService = EmployeeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(profile_details_entity_1.ProfileDetails)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(certificate_entity_1.Certificate)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        certificates_service_1.CertificatesService,
        transaction_manager_service_1.TransactionManagerService])
], EmployeeService);
//# sourceMappingURL=employee.service.js.map