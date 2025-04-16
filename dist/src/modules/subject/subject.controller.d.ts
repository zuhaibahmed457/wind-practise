import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { GetAllDto } from 'src/shared/dtos/getAll.dto';
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
export declare class SubjectController {
    private readonly subjectService;
    constructor(subjectService: SubjectService);
    create(createSubjectDto: CreateSubjectDto): Promise<{
        message: string;
        details: import("./entities/subject.entity").Subject;
    }>;
    findAll(getAllDto: GetAllDto): Promise<{
        message: string;
        details: import("./entities/subject.entity").Subject[];
        extra: import("nestjs-typeorm-paginate").IPaginationMeta;
    }>;
    findOne(paramIdDto: ParamIdDto): Promise<{
        message: string;
        details: import("./entities/subject.entity").Subject;
    }>;
    update(paramIdDto: ParamIdDto, updateSubjectDto: UpdateSubjectDto): Promise<{
        message: string;
        details: import("./entities/subject.entity").Subject;
    }>;
    remove(paramIdDto: ParamIdDto): Promise<{
        message: string;
    }>;
}
