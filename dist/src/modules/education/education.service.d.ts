import { Repository } from 'typeorm';
import { Education } from './entities/education.entity';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { User } from '../users/entities/user.entity';
import { DegreeType } from '../degree-type/entities/degree-type.entity';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { GetAllEducationDto } from './dto/get-all-education.dto';
export declare class EducationService {
    private readonly educationRepository;
    private readonly degreeTypeRepository;
    private readonly userRepo;
    constructor(educationRepository: Repository<Education>, degreeTypeRepository: Repository<DegreeType>, userRepo: Repository<User>);
    create(createEducationDto: CreateEducationDto, currentUser: User): Promise<Education>;
    findAll(getAllEducationDto: GetAllEducationDto, currentUser: User): Promise<import("nestjs-typeorm-paginate").Pagination<Education, import("nestjs-typeorm-paginate").IPaginationMeta>>;
    findOne({ id }: ParamIdDto, currentUser: User): Promise<Education>;
    update({ id }: ParamIdDto, updateEducationDto: UpdateEducationDto, currentUser: User): Promise<Education>;
    remove({ id }: ParamIdDto, currentUser: User): Promise<void>;
}
