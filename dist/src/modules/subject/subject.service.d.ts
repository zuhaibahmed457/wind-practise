import { Repository } from 'typeorm';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { GetAllDto } from 'src/shared/dtos/getAll.dto';
import { Subject } from './entities/subject.entity';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
export declare class SubjectService {
    private subjectRepo;
    constructor(subjectRepo: Repository<Subject>);
    create(createSubjectDto: CreateSubjectDto): Promise<Subject>;
    findAll(getAllDto: GetAllDto): Promise<import("nestjs-typeorm-paginate").Pagination<Subject, import("nestjs-typeorm-paginate").IPaginationMeta>>;
    findOne({ id }: ParamIdDto): Promise<Subject>;
    update({ id }: ParamIdDto, updateSubjectDto: UpdateSubjectDto): Promise<Subject>;
    remove({ id }: ParamIdDto): Promise<void>;
}
