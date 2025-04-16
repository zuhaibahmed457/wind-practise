import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Education } from './entities/education.entity';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { User } from '../users/entities/user.entity';
import { DegreeType } from '../degree-type/entities/degree-type.entity';
import { GetAllDto } from 'src/shared/dtos/getAll.dto';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { GetAllEducationDto } from './dto/get-all-education.dto';

@Injectable()
export class EducationService {
  constructor(
    @InjectRepository(Education)
    private readonly educationRepository: Repository<Education>,

    @InjectRepository(DegreeType)
    private readonly degreeTypeRepository: Repository<DegreeType>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(createEducationDto: CreateEducationDto, currentUser: User) {
    const user = await this.userRepo.findOne({
      where: {
        id: currentUser?.id,
      },
      relations: {
        profile_detail: true,
      },
    });

    const education = this.educationRepository.create({
      ...createEducationDto,
      profile_details: user?.profile_detail,
    });

    if (createEducationDto?.degree_type_id) {
      const degreeType = await this.degreeTypeRepository.findOne({
        where: { id: createEducationDto.degree_type_id },
      });
      if (!degreeType) throw new NotFoundException('Degree type not found');
      (education as any).degree_type = degreeType;
    }

    return await education.save();
  }

  async findAll(getAllEducationDto: GetAllEducationDto, currentUser: User) {
    const { page, per_page, search, profile_details_id } = getAllEducationDto;
    const query = this.educationRepository
      .createQueryBuilder('education')
      .leftJoinAndSelect('education.degree_type', 'degree_type')
      .leftJoin('education.profile_details', 'profile')
      .leftJoin('profile.user', 'user')
      .where('user.id = :id AND education.deleted_at IS NULL', {
        id: currentUser?.id,
      });

    if(profile_details_id){
      query.where('profile.id = :profile_details_id', {profile_details_id})
    }  

    if (search) {
      query.andWhere(
        '(education.school ILIKE :search OR education.field ILIKE :search OR degree_type.name ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const paginationOptions: IPaginationOptions = {
      page,
      limit: per_page,
    };

    return await paginate<Education>(query, paginationOptions);
  }

  async findOne({ id }: ParamIdDto, currentUser: User) {
    const education = await this.educationRepository.findOne({
      where: {
        id,
        deleted_at: IsNull(),
        profile_details: {
          user: {
            id: currentUser?.id,
          },
        },
      },
    });

    if (!education) throw new NotFoundException('Education not found');

    return education;
  }

  async update(
    { id }: ParamIdDto,
    updateEducationDto: UpdateEducationDto,
    currentUser: User,
  ) {
    const education = await this.educationRepository.findOne({
      where: {
        id,
        deleted_at: IsNull(),
        profile_details: {
          user: {
            id: currentUser?.id,
          },
        },
      },
    });

    if (!education) throw new NotFoundException('Education not found');

    if (updateEducationDto?.degree_type_id) {
      const degreeType = await this.degreeTypeRepository.findOne({
        where: { id: updateEducationDto.degree_type_id },
      });
      if (!degreeType) throw new NotFoundException('Degree type not found');
      (education as any).degree_type = degreeType;
    }

    Object.assign(education, updateEducationDto);
    return await education.save();
  }

  async remove({ id }: ParamIdDto, currentUser: User) {
    const education = await this.educationRepository.findOne({
      where: {
        id,
        deleted_at: IsNull(),
        profile_details: {
          user: {
            id: currentUser?.id,
          },
        },
      },
    });

    if (!education) throw new NotFoundException('Education not found');

    await education.softRemove();
  }
}
