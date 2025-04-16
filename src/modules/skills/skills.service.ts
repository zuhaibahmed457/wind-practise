import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Skill } from './entities/skill.entity';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { User, UserRole } from '../users/entities/user.entity';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { GetAllSkillsDto } from './dto/get-all-skills.dto';
import { ValidationException } from 'src/utils/validation-exception-formatter';

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(createSkillDto: CreateSkillDto, currentUser: User) {
    const user = await this.userRepo.findOne({
      where: {
        id: currentUser?.id,
      },
      relations: {
        profile_detail: true,
      },
    });

    const skill = this.skillRepository.create({
      ...createSkillDto,
      profile_details: user?.profile_detail,
    });
    return await skill.save();
  }

  async findAll(getAllSkillsDto: GetAllSkillsDto, currentUser: User) {
    const { page, per_page, search, profile_details_id } = getAllSkillsDto;
    const query = this.skillRepository
      .createQueryBuilder('skill')
      .leftJoin('skill.profile_details', 'profile')
      .leftJoin('profile.user', 'user')
      .where('user.id = :id AND skill.deleted_at IS NULL', {
        id: currentUser?.id,
      });

    if (profile_details_id) {
      query.where(
        'profile.id = :profile_details_id AND profile.deleted_at IS NULL',
        {
          profile_details_id,
        },
      );
    }

    if (search) {
      query.andWhere('skill.name ILIKE :search', { search: `%${search}%` });
    }

    const paginationOptions: IPaginationOptions = {
      page,
      limit: per_page,
    };

    return await paginate<Skill>(query, paginationOptions);
  }

  async findOne({ id }: ParamIdDto, currentUser: User) {
    const skill = await this.skillRepository.findOne({
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

    if (!skill) throw new NotFoundException('Skill not found');

    return skill;
  }

  async update(
    { id }: ParamIdDto,
    updateSkillDto: UpdateSkillDto,
    currentUser: User,
  ) {
    const skill = await this.skillRepository.findOne({
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

    if (!skill) throw new NotFoundException('Skill not found');

    Object.assign(skill, updateSkillDto);
    return await skill.save();
  }

  async remove({ id }: ParamIdDto, currentUser: User) {
    const skill = await this.skillRepository.findOne({
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

    if (!skill) throw new NotFoundException('Skill not found');

    await skill.softRemove();
  }
}
