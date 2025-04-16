import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import {
  Designation,
  DesignationStatus,
} from '../designation/entities/designation.entity';
import {
  EmploymentType,
  EmploymentTypeStatus,
} from '../employment-type/entities/employment-type.entity';
import { User, UserRole, UserStatus } from '../users/entities/user.entity';
import { TransactionManagerService } from 'src/shared/services/transaction-manager.service';
import { ValidationException } from 'src/utils/validation-exception-formatter';
import { GetAllEmployeeDto } from './dto/get-all-employee.dto';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { ProfileDetails } from '../profile-details/entities/profile-details.entity';
import { Certificate } from '../certificates/entities/certificate.entity';
import { CertificatesService } from '../certificates/certificates.service';
import { ManageEmployeeStatusDto } from './dto/manage-employee-status.dto';
import { Country } from '../country/entities/country.entity';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(ProfileDetails)
    private readonly profileDetailsRepository: Repository<ProfileDetails>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Certificate)
    private readonly certificateRepository: Repository<Certificate>,
    private readonly certificateService: CertificatesService,
    private readonly transactionManagerService: TransactionManagerService,
  ) {}

  create(createEmployeeDto: CreateEmployeeDto, currentUser: User) {
    return this.transactionManagerService.executeInTransaction(
      async (queryRunner) => {
        const {
          designation_id,
          employment_type_id,
          organization_id,
          email,
          first_name,
          last_name,
          phone_no,
          ...bodyData
        } = createEmployeeDto;

        const isEmailAlreadyExist = await this.userRepository.findOne({
          where: {
            email: createEmployeeDto.email,
            deleted_at: IsNull(),
            created_by: {
              id: currentUser?.id,
            },
          },
        });

        if (isEmailAlreadyExist)
          throw new BadRequestException(
            `Employee with email ${createEmployeeDto.email} already exists`,
          );

        let createdBy = currentUser;

        if (!currentUser.latest_subscription) {
          throw new BadRequestException(
            'Please take a subscription plan first',
          );
        }

        const numberOfEmployee = await this.userRepository.count({
          where: {
            role: UserRole.EMPLOYEE,
            created_by: {
              id: currentUser.id,
            },
          },
        });

        if (
          numberOfEmployee >=
          currentUser.latest_subscription.plan.number_of_employees_allowed
        ) {
          throw new BadRequestException(
            `You have currently ${numberOfEmployee} employees, please take plan which correspond to your number of employees`,
          );
        }

        if (currentUser.latest_subscription.plan.number_of_employees_allowed)
          if (
            [UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(currentUser?.role)
          ) {
            if (createEmployeeDto?.organization_id) {
              createdBy = await queryRunner.manager.findOne(User, {
                where: {
                  id: organization_id,
                  deleted_at: IsNull(),
                  status: UserStatus.ACTIVE,
                },
              });

              if (createdBy) {
                throw new NotFoundException('Organization not found');
              }
            } else {
              throw new ValidationException({
                organization_id: 'organization_id is required',
              });
            }
          }

        const designation = await queryRunner.manager.findOne(Designation, {
          where: {
            id: designation_id,
            status: DesignationStatus.ACTIVE,
            deleted_at: IsNull(),
            created_by: {
              id: createdBy?.id,
            },
          },
        });

        if (!designation) {
          throw new NotFoundException('Designation not found');
        }

        const employmentType = await queryRunner.manager.findOne(
          EmploymentType,
          {
            where: {
              id: employment_type_id,
              status: EmploymentTypeStatus.ACTIVE,
            },
          },
        );

        if (!employmentType) {
          throw new NotFoundException('Employment type not found');
        }

        const employee = this.userRepository.create({
          first_name,
          last_name,
          email,
          phone_no,
          role: UserRole.EMPLOYEE,
          created_by: createdBy,
        });

        const saveEmployee = await queryRunner.manager.save(User, employee);

        const profileDetails = this.profileDetailsRepository.create({
          ...bodyData,
          designation,
          employment_type: employmentType,
          user: saveEmployee,
        });

        const {
          user: { password, ...userData },
          ...details
        } = await queryRunner.manager.save(ProfileDetails, profileDetails);
        return await queryRunner.manager.save(ProfileDetails, {
          ...details,
          user: userData,
        });
      },
    );
  }

  async findAll(getAllEmployeeDto: GetAllEmployeeDto, currentUser: User) {
    const {
      city,
      country,
      designation_id,
      employment_type_id,
      join_date_from,
      join_date_to,
      page,
      per_page,
      search,
      status,
      order,
    } = getAllEmployeeDto;

    const query = this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.created_by', 'created_by')
      .leftJoinAndSelect('user.profile_detail', 'profile')
      .leftJoinAndSelect('profile.designation', 'designation')
      .leftJoinAndSelect('profile.employment_type', 'employment_type')
      .where('created_by.id = :id AND user.deleted_at IS NULL ', {
        id: currentUser?.id,
      })
      .andWhere('user.role = :role', { role: UserRole.EMPLOYEE });

    if (search) {
      query.andWhere(
        '(user.full_name ILIKE :search OR user.email ILIKE :search OR user.phone_no ILIKE :search OR profile.city ILIKE :search)',
        { search: `%${search}%` },
      );
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

    const paginationOptions: IPaginationOptions = {
      page: page,
      limit: per_page,
    };

    return await paginate<User>(query, paginationOptions);
  }

  async findOne({ id }: ParamIdDto, currentUser: User) {
    const employee = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile_detail', 'profile_detail')
      .leftJoinAndSelect('profile_detail.designation', 'designation')
      .leftJoinAndSelect('profile_detail.employment_type', 'employment_type')
      .where(
        'user.id = :id AND user.created_by.id = :createdById AND user.deleted_at IS NULL',
        { id, createdById: currentUser?.id },
      )
      .getOne();

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return employee;
  }

  async update(
    { id }: ParamIdDto,
    updateEmployeeDto: UpdateEmployeeDto,
    currentUser: User,
  ) {
    return this.transactionManagerService.executeInTransaction(
      async (queryRunner) => {
        const {
          designation_id,
          employment_type_id,
          first_name,
          last_name,
          email,
          phone_no,
          ...bodyData
        } = updateEmployeeDto;

        const employee = await queryRunner.manager.findOne(User, {
          where: {
            id: id,
            role: UserRole.EMPLOYEE,
            deleted_at: IsNull(),
            created_by: { id: currentUser.id },
          },
          relations: ['profile_detail'],
        });

        if (!employee) {
          throw new NotFoundException('Employee not found');
        }

        const profileDetails = await queryRunner.manager.findOne(
          ProfileDetails,
          {
            where: { id: employee.profile_detail?.id },
            relations: ['designation', 'employment_type'],
          },
        );

        if (!profileDetails) {
          throw new NotFoundException('Profile not found');
        }

        if (designation_id) {
          const designation = await queryRunner.manager.findOne(Designation, {
            where: {
              id: designation_id,
              status: DesignationStatus.ACTIVE,
              deleted_at: IsNull(),
              created_by: { id: currentUser.id },
            },
          });

          if (!designation) {
            throw new NotFoundException('Designation not found');
          }

          profileDetails.designation = designation;
        }

        if (employment_type_id) {
          const employmentType = await queryRunner.manager.findOne(
            EmploymentType,
            {
              where: {
                id: employment_type_id,
                status: EmploymentTypeStatus.ACTIVE,
              },
            },
          );

          if (!employmentType) {
            throw new NotFoundException('Employment type not found');
          }

          profileDetails.employment_type = employmentType;
        }

        Object.assign(profileDetails, bodyData);
        await queryRunner.manager.save(ProfileDetails, profileDetails);

        Object.assign(employee, { first_name, last_name, phone_no, email });
        const { password, ...employeeData } = await queryRunner.manager.save(
          User,
          employee,
        );
        return employeeData;
      },
    );
  }

  async manageStatus(
    { id }: ParamIdDto,
    manageEmployeeStatusDto: ManageEmployeeStatusDto,
    currentUser: User,
  ) {
    const employee = await this.userRepository.findOne({
      where: {
        id,
        deleted_at: IsNull(),
        created_by: {
          id: currentUser?.id,
        },
      },
    });

    if (!employee) throw new NotFoundException('Employee not found');

    Object.assign(employee, manageEmployeeStatusDto);

    return employee.save();
  }

  async delete({ id }: ParamIdDto, currentUser: User) {
    const employee = await this.findOne({ id }, currentUser);
    const certificate = await this.certificateRepository.find({
      where: {
        deleted_at: IsNull(),
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
        await this.certificateService.updateUserCertificateExpirationDate(
          item.profile_details,
        );
      });
    }

    employee.deleted_at = new Date();
    await employee.save();
  }
}
