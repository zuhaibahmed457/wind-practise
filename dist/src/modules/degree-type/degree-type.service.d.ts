import { Repository } from 'typeorm';
import { DegreeType } from './entities/degree-type.entity';
import { CreateDegreeTypeDto } from './dto/create-degree-type.dto';
import { UpdateDegreeTypeDto } from './dto/update-degree-type.dto';
import { GetAllDto } from 'src/shared/dtos/getAll.dto';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
export declare class DegreeTypeService {
    private readonly degreeTypeRepository;
    constructor(degreeTypeRepository: Repository<DegreeType>);
    create(createDegreeTypeDto: CreateDegreeTypeDto): Promise<DegreeType>;
    findAll(getAllDto: GetAllDto): Promise<import("nestjs-typeorm-paginate").Pagination<DegreeType, import("nestjs-typeorm-paginate").IPaginationMeta>>;
    findOne({ id }: ParamIdDto): Promise<DegreeType>;
    update({ id }: ParamIdDto, updateDegreeTypeDto: UpdateDegreeTypeDto): Promise<DegreeType>;
}
