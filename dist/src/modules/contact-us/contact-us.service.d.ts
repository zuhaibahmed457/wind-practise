import { Repository } from 'typeorm';
import { GetAllDto } from 'src/shared/dtos/getAll.dto';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { ContactUs } from './entities/contact-us.entity';
import { CreateContactUsDto } from './dto/create-contact-us.dto';
import { Subject } from '../subject/entities/subject.entity';
export declare class ContactUsService {
    private contactUsRepo;
    private subjectRepo;
    constructor(contactUsRepo: Repository<ContactUs>, subjectRepo: Repository<Subject>);
    create(createContactUsDto: CreateContactUsDto): Promise<ContactUs>;
    findAll(getAllDto: GetAllDto): Promise<import("nestjs-typeorm-paginate").Pagination<ContactUs, import("nestjs-typeorm-paginate").IPaginationMeta>>;
    findOne({ id }: ParamIdDto): Promise<ContactUs>;
    remove({ id }: ParamIdDto): Promise<void>;
}
