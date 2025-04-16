import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDesignationDto } from './dto/create-designation.dto';
import { UpdateDesignationDto } from './dto/update-designation.dto';
import { User, UserRole } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Designation } from './entities/designation.entity';
import { Repository } from 'typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { GetAllDesignationDto } from './dto/get-all-designation.dto';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { DesignationManageStatusDto } from './dto/designation-status.dto';

@Injectable()
export class DesignationService {
  constructor(
    @InjectRepository(Designation)
    private readonly designationRepo: Repository<Designation>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(createDesignationDto: CreateDesignationDto, currentUser: User) {
    const designation = this.designationRepo.create({
      ...createDesignationDto,
      created_by: currentUser,
    });

    return await designation.save();
  }

  async findAll(getAllDesignationDto: GetAllDesignationDto, currentUser: User) {
    const { page, per_page, search, status } = getAllDesignationDto;

    const query = this.designationRepo
      .createQueryBuilder('designation')
      .leftJoin('designation.created_by', 'user')
      .where('designation.created_by.id = :id', { id: currentUser?.id });

    if (search) {
      query.andWhere('designation.name ILIKE :search', {
        search: `%${search}%`,
      });
    }

    if (status) {
      query.andWhere('designation.status = :status', { status });
    }

    const paginationOptions: IPaginationOptions = {
      page: page,
      limit: per_page,
    };

    return await paginate<Designation>(query, paginationOptions);
  }

  async findOne({ id }: ParamIdDto, currentUser: User) {
    const designation = await this.designationRepo.findOne({
      where: {
        id,
        created_by: {
          id: currentUser?.id,
        },
      },
    });

    if (!designation) throw new NotFoundException('Designation not found');

    return designation;
  }

  async update(
    { id }: ParamIdDto,
    updateDesignationDto: UpdateDesignationDto,
    currentUser: User,
  ) {
    const designation = await this.designationRepo.findOne({
      where: {
        id,
        created_by: {
          id: currentUser?.id,
        },
      },
    });

    if (!designation) throw new NotFoundException('Designation not found');

    Object.assign(designation, updateDesignationDto);
    return await designation.save();
  }

  async manageStatus(
    { id }: ParamIdDto,
    manageStatusDto: DesignationManageStatusDto,
    currentUser: User,
  ) {
    const designation = await this.designationRepo.findOne({
      where: {
        id,
        created_by: {
          id: currentUser?.id,
        },
      },
    });

    if (!designation) throw new NotFoundException('Designation not found');

    Object.assign(designation, manageStatusDto);

    return designation.save();
  }

  async remove(id: string, currentUser: User) {
    const designation = await this.designationRepo.findOne({
      where: {
        id,
        created_by: {
          id: currentUser?.id,
        },
      },
    });
    if (!designation) throw new NotFoundException('Designation not found');

    const isDesignationUsedAnyWhere = await this.userRepo.count({
      where: {
        role: UserRole.EMPLOYEE,
        created_by: {
          id: currentUser?.id,
        },
        profile_detail: {
          designation: {
            id: designation?.id,
          },
        },
      },
    });

    if (isDesignationUsedAnyWhere)
      throw new BadRequestException(
        'This designation is in use. Remove it before deleting.',
      );

    await this.designationRepo.softDelete(id);
  }
}
