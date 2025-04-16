import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { GetAllDto } from 'src/shared/dtos/getAll.dto';
import { Subject } from './entities/subject.entity';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(Subject)
    private subjectRepo: Repository<Subject>,
  ) {}

  async create(createSubjectDto: CreateSubjectDto) {
    const existingSubject = await this.subjectRepo.findOne({
      where: { name: createSubjectDto.name },
    });

    if (existingSubject)
      throw new BadRequestException('Subject already exists');

    const subject = this.subjectRepo.create(createSubjectDto);
    return await subject.save();
  }

  async findAll(getAllDto: GetAllDto) {
    const { page, per_page, search } = getAllDto;

    const query = this.subjectRepo
      .createQueryBuilder('subject')
      .where('subject.deleted_at IS NULL');

    if (search) {
      query.andWhere('subject.name ILIKE :search', { search: `%${search}%` });
    }

    const paginationOptions: IPaginationOptions = {
      page: page,
      limit: per_page,
    };

    return await paginate(query, paginationOptions);
  }

  async findOne({ id }: ParamIdDto) {
    const subject = await this.subjectRepo.findOne({
      where: {
        id,
        deleted_at: IsNull(),
      },
    });
    if (!subject) {
      throw new NotFoundException(`Subject not found`);
    }
    return subject;
  }

  async update(
    { id }: ParamIdDto,
    updateSubjectDto: UpdateSubjectDto,
  ): Promise<Subject> {
    const subject = await this.findOne({ id });

    Object.assign(subject, updateSubjectDto);
    return await subject.save();
  }

  async remove({ id }: ParamIdDto): Promise<void> {
    const subject = await this.findOne({ id });
    await subject.softRemove();
  }
}
