import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { GetAllDto } from 'src/shared/dtos/getAll.dto';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { ContactUs } from './entities/contact-us.entity';
import { CreateContactUsDto } from './dto/create-contact-us.dto';
import { Subject } from '../subject/entities/subject.entity';

@Injectable()
export class ContactUsService {
  constructor(
    @InjectRepository(ContactUs)
    private contactUsRepo: Repository<ContactUs>,
    @InjectRepository(Subject)
    private subjectRepo: Repository<Subject>,
  ) {}

  async create(createContactUsDto: CreateContactUsDto): Promise<ContactUs> {
    const subject = await this.subjectRepo.findOne({
      where: {
        id: createContactUsDto?.subject_id,
      },
    });
    if (!subject) throw new NotFoundException('subject not found');
    const contact = this.contactUsRepo.create({
      ...createContactUsDto,
      subject: subject
    });
    return await this.contactUsRepo.save(contact);
  }

  async findAll(getAllDto: GetAllDto) {
    const { page, per_page, search } = getAllDto;

    const query = this.contactUsRepo
      .createQueryBuilder('contact')
      .leftJoinAndSelect('contact.subject', 'sub')
      .where('contact.deleted_at IS NULL');

    if (search) {
      query.andWhere(
        '(contact.name ILIKE :search OR contact.email ILIKE :search OR sub.name ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    query.orderBy('contact.created_at', 'DESC')

    const paginationOptions: IPaginationOptions = {
      page: page,
      limit: per_page,
    };

    return await paginate(query, paginationOptions);
  }

  async findOne({ id }: ParamIdDto): Promise<ContactUs> {
    const contact = await this.contactUsRepo.findOne({
      where: {
        id,
        deleted_at: IsNull(),
      },
      relations: {
        subject: true,
      },
    });
    if (!contact) {
      throw new NotFoundException(`Contact not found`);
    }
    return contact;
  }

  async remove({ id }: ParamIdDto): Promise<void> {
    const contact = await this.findOne({ id });
    await contact.softRemove();
  }
}
