import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DegreeType } from './entities/degree-type.entity';
import { CreateDegreeTypeDto } from './dto/create-degree-type.dto';
import { UpdateDegreeTypeDto } from './dto/update-degree-type.dto';
import { GetAllDto } from 'src/shared/dtos/getAll.dto';
import { query } from 'express';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';

@Injectable()
export class DegreeTypeService {
  constructor(
    @InjectRepository(DegreeType)
    private readonly degreeTypeRepository: Repository<DegreeType>,
  ) {}

  async create(createDegreeTypeDto: CreateDegreeTypeDto) {
    const degreeType = this.degreeTypeRepository.create(createDegreeTypeDto);
    return await degreeType.save();
  }

  async findAll(getAllDto: GetAllDto) {
    const { page, per_page, search } = getAllDto;

    const query = this.degreeTypeRepository
      .createQueryBuilder('degree')
      .where('degree.deleted_at IS NULL');

    if (search) {
      query.andWhere('degree.name ILIKE :search', { search: `%${search}%` });
    }

    const paginationOptions: IPaginationOptions = {
      page,
      limit: per_page,
    };

    return await paginate<DegreeType>(query, paginationOptions);
  }

  async findOne({ id }: ParamIdDto) {
    const degreeType = await this.degreeTypeRepository.findOne({
      where: { id },
    });
    if (!degreeType) throw new NotFoundException('Degree type not found');

    return degreeType;
  }

  async update(
    { id }: ParamIdDto,
    updateDegreeTypeDto: UpdateDegreeTypeDto,
  ): Promise<DegreeType> {
    const degreeType = await this.degreeTypeRepository.findOne({
      where: { id },
    });
    if (!degreeType) throw new NotFoundException('Degree type not found');

    Object.assign(degreeType, updateDegreeTypeDto);
    return await degreeType.save();
  }
}
