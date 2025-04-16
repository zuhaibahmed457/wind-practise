import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmploymentTypeDto } from './dto/create-employment-type.dto';
import { UpdateEmploymentTypeDto } from './dto/update-employment-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EmploymentType } from './entities/employment-type.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { GetAllEmploymentTypeDto } from './dto/get-all-employment-type.dto';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { EmploymentTypeManageStatusDto } from './dto/manage-status.dto';

@Injectable()
export class EmploymentTypeService {
  constructor(
    @InjectRepository(EmploymentType)
    private readonly employmentTypeRepository: Repository<EmploymentType>,
  ) {}

  async create(
    createEmploymentTypeDto: CreateEmploymentTypeDto,
    currentUser: User,
  ): Promise<EmploymentType> {
    const employmentType = this.employmentTypeRepository.create({
      ...createEmploymentTypeDto,
      created_by: currentUser,
    });
    return await employmentType.save();
  }

  async findAll(getAllEmploymentTypeDto: GetAllEmploymentTypeDto) {
    const { page, per_page, search, status } = getAllEmploymentTypeDto;
    const query = this.employmentTypeRepository
      .createQueryBuilder('employment_type')
      .where('employment_type.deleted_at IS NULL');

    if (search) {
      query.andWhere(
        'employment_type.name ILIKE :search',
        { search: `%${search}%` },
      );
    }

    if (status) {
      query.andWhere('employment_type.status = :status', { status });
    }

    const paginationOptions: IPaginationOptions = {
      page: page,
      limit: per_page,
    };

    return await paginate<EmploymentType>(query, paginationOptions);
  }

  async findOne({ id }: ParamIdDto) {
    const employmentType = await this.employmentTypeRepository.findOne({
      where: { id },
    });

    if (!employmentType) {
      throw new NotFoundException('Employment type not found');
    }

    return employmentType;
  }

  async update(
    { id }: ParamIdDto,
    updateEmploymentTypeDto: UpdateEmploymentTypeDto,
  ): Promise<EmploymentType> {
    const employmentType = await this.employmentTypeRepository.findOne({
      where: {
        id,
      },
    });

    if (!employmentType) {
      throw new NotFoundException('Employment type not found');
    }

    Object.assign(employmentType, updateEmploymentTypeDto);
    return await employmentType.save();
  }

  async manageStatus(
    { id }: ParamIdDto,
    manageStatusDto: EmploymentTypeManageStatusDto,
  ) {
    const employmentType = await this.employmentTypeRepository.findOne({
      where: {
        id,
      },
    });

    if (!employmentType) {
      throw new NotFoundException('Employment type not found');
    }

    Object.assign(employmentType, manageStatusDto);

    return employmentType.save();
  }
}
